import os
from fastapi import FastAPI, Request, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from loguru import logger
import sys

from app.config import settings
from app.database.session import engine, Base
from app.routers import auth_router, resume_router, analysis_router

# ========================
# Configure Logging
# ========================
logger.remove()
logger.add(
    sys.stderr,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <cyan>{name}</cyan> | {message}",
    level="DEBUG" if settings.DEBUG else "INFO",
)
logger.add(
    "logs/app.log",
    rotation="10 MB",
    retention="30 days",
    level="INFO",
    catch=True,
)

# ========================
# Create tables
# ========================
os.makedirs("uploads", exist_ok=True)
os.makedirs("logs", exist_ok=True)

from app.models import User, Resume, Analysis  # noqa

# Dynamic ALTER TABLE Migration Hook to add semantic_alignment column
with engine.connect() as conn:
    try:
        from sqlalchemy import text
        conn.execute(text("ALTER TABLE analyses ADD COLUMN IF NOT EXISTS semantic_alignment JSON;"))
        conn.commit()
        logger.info("Database migration successful: analyses.semantic_alignment column verified.")
    except Exception as e:
        logger.debug(f"SQLite or initial database run detected, skipping explicit ALTER TABLE: {e}")

Base.metadata.create_all(bind=engine)

# ========================
# FastAPI App
# ========================
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered Resume Analyzer & ATS Optimizer API",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ========================
# CORS (Dynamic Browser-Safe Whitelisting Middleware)
# ========================
@app.middleware("http")
async def dynamic_cors_middleware(request: Request, call_next):
    origin = request.headers.get("origin")
    
    # Preflight OPTIONS requests
    if request.method == "OPTIONS":
        response = Response(status_code=204)
        if origin:
            if any(x in origin for x in ["localhost", "127.0.0.1", "vercel.app", "onrender.com"]):
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH"
                response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, apikey"
                response.headers["Access-Control-Max-Age"] = "86400"
        return response

    response = await call_next(request)
    
    if origin:
        if any(x in origin for x in ["localhost", "127.0.0.1", "vercel.app", "onrender.com"]):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, apikey"
            
    return response

# ========================
# Exception Handlers
# ========================
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"])
        errors.append({"field": field, "message": error["msg"]})
    response = JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": errors},
    )
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception occurred: {exc}", exc_info=True)
    response = JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal Server Error. An unexpected error occurred. Please contact support or check server logs."},
    )
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# ========================
# Routers
# ========================
app.include_router(auth_router, prefix="/api/v1")
app.include_router(resume_router, prefix="/api/v1")
app.include_router(analysis_router, prefix="/api/v1")


# ========================
# Health Check
# ========================
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
        "version": settings.VERSION,
    }
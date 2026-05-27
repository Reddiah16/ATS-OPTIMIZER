from app.routers.auth import router as auth_router
from app.routers.resume import router as resume_router
from app.routers.analysis import router as analysis_router

__all__ = ["auth_router", "resume_router", "analysis_router"]

from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from datetime import timedelta
import httpx

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import AuthService
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.utils.jwt import create_access_token
from app.config import settings
from fastapi import HTTPException, status
from app.utils.rate_limiter import RateLimiterDependency

router = APIRouter(prefix="/auth", tags=["Authentication"])
auth_rate_limiter = RateLimiterDependency(limit=5, window=60, scope="auth")


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db), _rate_limit = Depends(auth_rate_limiter)):
    service = AuthService(db)
    return service.register(user_data)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db), _rate_limit = Depends(auth_rate_limiter)):
    service = AuthService(db)
    return service.login(credentials)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    """Exchange Supabase token for backend JWT."""
    supabase_token = authorization.replace("Bearer ", "")

    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase credentials are not configured on the backend server. Please verify your Render environment variables."
        )

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {supabase_token}",
                    "apikey": settings.SUPABASE_ANON_KEY
                },
                timeout=15.0
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to connect to Supabase Auth Server: {str(e)}"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Supabase token: {response.text}"
        )

    supabase_user = response.json()
    email = supabase_user.get("email")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not found in token"
        )

    # Find or create user in database
    user = db.query(User).filter(User.email == email).first()
    if not user:
        username = email.split("@")[0]
        base_username = username
        counter = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}{counter}"
            counter += 1

        user = User(
            username=username,
            email=email,
            hashed_password="",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )
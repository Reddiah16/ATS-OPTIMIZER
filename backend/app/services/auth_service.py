from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from loguru import logger

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.config import settings


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, user_data: UserCreate) -> TokenResponse:
        """Register a new user and return access token."""
        # Check if email already exists
        existing_email = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )

        # Check if username already exists
        existing_username = (
            self.db.query(User).filter(User.username == user_data.username).first()
        )
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This username is already taken",
            )

        # Create user
        hashed_pw = hash_password(user_data.password)
        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_pw,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        logger.info(f"New user registered: {user.email}")

        # Generate token
        token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )

    def login(self, credentials: UserLogin) -> TokenResponse:
        """Authenticate user and return access token."""
        user = self.db.query(User).filter(User.email == credentials.email).first()

        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Your account has been deactivated",
            )

        logger.info(f"User logged in: {user.email}")

        token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )

    def get_profile(self, user: User) -> UserResponse:
        """Return current user profile."""
        return UserResponse.model_validate(user)

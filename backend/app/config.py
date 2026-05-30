from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from loguru import logger
import secrets


class Settings(BaseSettings):

    # ================= APP =================
    APP_NAME: str = "ATS Optimizer"
    DEBUG: bool = False
    VERSION: str = "1.0.0"

    # ================= DATABASE =================
    DATABASE_URL: str

    # ================= JWT =================
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # ================= GROQ =================
    GROQ_API_KEY: str

    # ================= FILES =================
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10

    # ================= FRONTEND =================
    FRONTEND_URL: str = "http://localhost:3000"

    # ================= SUPABASE =================
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not v.startswith("postgresql://") and not v.startswith("postgresql+psycopg2://"):
            raise ValueError("DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql://")
        return v

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if len(v) < 32:
            logger.warning(
                "SECRET_KEY is insecure (less than 32 characters)! "
                "Generating a secure fallback key dynamically for this session."
            )
            return secrets.token_hex(32)
        return v

    @field_validator("GROQ_API_KEY")
    @classmethod
    def validate_groq_key(cls, v: str) -> str:
        if v and not v.startswith("gsk_") and not v.startswith("gsk-"):
            raise ValueError("GROQ_API_KEY must start with 'gsk-' or 'gsk_'")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


def print_safe_settings(settings: Settings):
    """Log active settings but securely mask secrets."""
    def mask_secret(value: str) -> str:
        if not value:
            return "[NOT SET]"
        if len(value) <= 8:
            return "********"
        return f"{value[:4]}...{value[-4:]}"

    logger.info("Initializing Secure Server Configuration Settings:")
    logger.info(f"  APP_NAME: {settings.APP_NAME}")
    logger.info(f"  DEBUG: {settings.DEBUG}")
    logger.info(f"  VERSION: {settings.VERSION}")
    logger.info(f"  DATABASE_URL: {mask_secret(settings.DATABASE_URL)}")
    logger.info(f"  SECRET_KEY: {mask_secret(settings.SECRET_KEY)}")
    logger.info(f"  GROQ_API_KEY: {mask_secret(settings.GROQ_API_KEY)}")
    logger.info(f"  SUPABASE_URL: {settings.SUPABASE_URL or '[NOT SET]'}")


@lru_cache()
def get_settings():
    try:
        s = Settings()
        print_safe_settings(s)
        return s
    except Exception as e:
        logger.error(f"ENVIRONMENT VALIDATION ERROR: Startup configuration validation failed! Details: {e}")
        raise e


settings = get_settings()
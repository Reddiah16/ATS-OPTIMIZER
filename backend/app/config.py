from pydantic_settings import BaseSettings
from functools import lru_cache


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

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
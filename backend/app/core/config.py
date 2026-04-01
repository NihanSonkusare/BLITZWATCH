"""
Application configuration via environment variables.
All secrets are loaded from .env — never committed to Git.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"

    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str  # Server-side only — never expose to frontend

    # Redis / Celery
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI Providers
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Video Generation Providers (ordered fallback list)
    HEYGEN_API_KEY: str = ""
    RUNWAY_API_KEY: str = ""
    LUMA_API_KEY: str = ""

    # Monitoring
    SENTRY_DSN: str = ""

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

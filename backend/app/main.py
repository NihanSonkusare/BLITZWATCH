"""
BLITZWATCH FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

from app.core.config import settings

# ── Sentry (error tracking) ─────────────────────────────────────────────────
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
        send_default_pii=False,  # Never log PII in plaintext (REQ-NF-11)
    )

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="BLITZWATCH API",
    version="0.1.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers (imported lazily to avoid circular imports) ──────────────────────
# from app.api.auth import router as auth_router
# from app.api.uploads import router as uploads_router
# app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
# app.include_router(uploads_router, prefix="/api/uploads", tags=["uploads"])


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "version": "0.1.0"}

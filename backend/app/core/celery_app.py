"""
Celery application configuration.
Uses Redis as both broker and result backend.
"""
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "blitzwatch",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.pipeline"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,  # Fair task distribution
    # Retry settings
    task_default_retry_delay=30,  # 30 seconds
    task_max_retries=3,
)

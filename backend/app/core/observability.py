from typing import Optional

from langfuse import get_client
from langfuse.langchain import CallbackHandler

from app.core.config import get_settings


def get_langfuse_client():
    """
    Returns a configured Langfuse client or None if keys are missing.
    Uses environment variables / Settings automatically.
    """
    settings = get_settings()
    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        return None

    # Ensure the modern env vars are present for the SDK
    import os
    os.environ.setdefault("LANGFUSE_PUBLIC_KEY", settings.langfuse_public_key)
    os.environ.setdefault("LANGFUSE_SECRET_KEY", settings.langfuse_secret_key)
    os.environ.setdefault("LANGFUSE_BASE_URL", settings.get_langfuse_base_url())
    if settings.langfuse_tracing_environment:
        os.environ.setdefault(
            "LANGFUSE_TRACING_ENVIRONMENT", settings.langfuse_tracing_environment
        )

    try:
        return get_client()
    except Exception:
        return None


def build_langfuse_callback() -> Optional[CallbackHandler]:
    """
    Create a Langfuse CallbackHandler for LangChain / LangGraph.
    Returns None when credentials are not configured (graceful degradation).
    """
    settings = get_settings()
    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        return None

    # Make sure env vars are set so the handler picks them up
    import os
    os.environ.setdefault("LANGFUSE_PUBLIC_KEY", settings.langfuse_public_key)
    os.environ.setdefault("LANGFUSE_SECRET_KEY", settings.langfuse_secret_key)
    os.environ.setdefault("LANGFUSE_BASE_URL", settings.get_langfuse_base_url())
    if settings.langfuse_tracing_environment:
        os.environ.setdefault(
            "LANGFUSE_TRACING_ENVIRONMENT", settings.langfuse_tracing_environment
        )

    try:
        return CallbackHandler()
    except Exception:
        return None
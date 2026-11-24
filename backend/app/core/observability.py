from typing import Optional
from langfuse import Langfuse
from langfuse.callback import CallbackHandler
from app.core.config import get_settings


def get_langfuse_client() -> Optional[Langfuse]:
    settings = get_settings()
    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        return None
    return Langfuse(
        public_key=settings.langfuse_public_key,
        secret_key=settings.langfuse_secret_key,
        host=settings.langfuse_host,
    )


def build_langfuse_callback(
    trace_name: str,
    user_id: str,
    session_id: str,
    tags: Optional[list[str]] = None,
) -> Optional[CallbackHandler]:
    settings = get_settings()
    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        return None
    return CallbackHandler(
        public_key=settings.langfuse_public_key,
        secret_key=settings.langfuse_secret_key,
        host=settings.langfuse_host,
        trace_name=trace_name,
        user_id=user_id,
        session_id=session_id,
        tags=tags or ["viralytiq", "langgraph", "groq"],
    )

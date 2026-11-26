from functools import lru_cache
from typing import Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Viralytiq API"
    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql+asyncpg://viralytiq:viralytiq@localhost:5432/viralytiq"
    sync_database_url: str = "postgresql+psycopg://viralytiq:viralytiq@localhost:5432/viralytiq"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    groq_api_key: str = ""
    groq_primary_model: str = "openai/gpt-oss-120b"
    groq_fast_model: str = "llama-3.1-8b-instant"

    embedding_api_key: str = ""
    embedding_dimensions: int = 1536

    # Langfuse
    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    # Prefer LANGFUSE_BASE_URL. Fall back to LANGFUSE_HOST for older .env files.
    langfuse_base_url: str = "https://cloud.langfuse.com"
    langfuse_host: str = ""  # legacy – used only as fallback
    langfuse_tracing_environment: str = "development"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        if v is None or v == "":
            return ["http://localhost:3000", "http://localhost:3001"]
        if isinstance(v, list):
            return [str(x).strip() for x in v if str(x).strip()]
        if isinstance(v, str):
            s = v.strip()
            if s.startswith("[") and s.endswith("]"):
                import json

                try:
                    parsed = json.loads(s)
                    if isinstance(parsed, list):
                        return [str(x).strip() for x in parsed if str(x).strip()]
                except json.JSONDecodeError:
                    pass
            return [part.strip() for part in s.split(",") if part.strip()]
        return ["http://localhost:3000"]

    def get_langfuse_base_url(self) -> str:
        """Return the effective Langfuse base URL (prefers BASE_URL over HOST)."""
        if self.langfuse_base_url:
            return self.langfuse_base_url.rstrip("/")
        if self.langfuse_host:
            return self.langfuse_host.rstrip("/")
        return "https://cloud.langfuse.com"


@lru_cache
def get_settings() -> Settings:
    return Settings()
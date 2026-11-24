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

    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    langfuse_host: str = "https://cloud.langfuse.com"

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


@lru_cache
def get_settings() -> Settings:
    return Settings()
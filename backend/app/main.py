from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, posts, rag, strategist
from app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI-powered Personal Content Strategist for LinkedIn creators.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.api_v1_prefix)
app.include_router(strategist.router, prefix=settings.api_v1_prefix)
app.include_router(rag.router, prefix=settings.api_v1_prefix)
app.include_router(posts.router, prefix=settings.api_v1_prefix)

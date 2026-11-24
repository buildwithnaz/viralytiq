import uuid
from datetime import datetime
from typing import Optional
from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class CreatorProfile(Base):
    __tablename__ = "creator_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    handle: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    headline: Mapped[str] = mapped_column(String(280), nullable=False)
    audience_icp: Mapped[str] = mapped_column(Text, nullable=False)
    followers: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    weekly_target_posts: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    voice_documents: Mapped[list["VoiceDocument"]] = relationship(
        back_populates="creator", cascade="all, delete-orphan"
    )
    posts: Mapped[list["LinkedInPost"]] = relationship(
        back_populates="creator", cascade="all, delete-orphan"
    )


class VoiceDocument(Base):
    __tablename__ = "voice_documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    token_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    creator: Mapped["CreatorProfile"] = relationship(back_populates="voice_documents")
    chunks: Mapped[list["VoiceChunk"]] = relationship(
        back_populates="document", cascade="all, delete-orphan"
    )


class VoiceChunk(Base):
    __tablename__ = "voice_chunks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("voice_documents.id", ondelete="CASCADE"), nullable=False
    )
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float]] = mapped_column(Vector(1536), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    document: Mapped["VoiceDocument"] = relationship(back_populates="chunks")

    __table_args__ = (
        Index(
            "ix_voice_chunks_embedding_hnsw",
            "embedding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "vector_cosine_ops"},
        ),
    )


class LinkedInPost(Base):
    __tablename__ = "linkedin_posts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    pillar: Mapped[str] = mapped_column(String(80), nullable=False)
    post_format: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Draft", nullable=False)
    hook: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    cta: Mapped[str] = mapped_column(Text, nullable=False)
    hook_variants: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    scheduled_for: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    scheduled_time: Mapped[Optional[str]] = mapped_column(String(24), nullable=True)
    impressions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reactions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    comments: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reposts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    engagement_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    virality_score: Mapped[int] = mapped_column(Integer, default=80, nullable=False)
    rag_sources: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    creator: Mapped["CreatorProfile"] = relationship(back_populates="posts")


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False
    )
    langfuse_trace_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    topic: Mapped[str] = mapped_column(Text, nullable=False)
    total_latency_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    node_traces: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

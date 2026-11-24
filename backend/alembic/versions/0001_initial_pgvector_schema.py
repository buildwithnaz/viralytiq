"""Initial pgvector schema for Viralytiq

Revision ID: 0001_initial_pgvector
Revises:
Create Date: 2026-11-22 05:35:00
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial_pgvector"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "creator_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("handle", sa.String(120), nullable=False, unique=True),
        sa.Column("headline", sa.String(280), nullable=False),
        sa.Column("audience_icp", sa.Text(), nullable=False),
        sa.Column("followers", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("weekly_target_posts", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "voice_documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "creator_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("creator_profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(240), nullable=False),
        sa.Column("category", sa.String(64), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("token_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "voice_chunks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "document_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("voice_documents.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("chunk_text", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(1536), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_index(
        "ix_voice_chunks_embedding_hnsw",
        "voice_chunks",
        ["embedding"],
        postgresql_using="hnsw",
        postgresql_with={"m": 16, "ef_construction": 64},
        postgresql_ops={"embedding": "vector_cosine_ops"},
    )

    op.create_table(
        "linkedin_posts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "creator_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("creator_profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(240), nullable=False),
        sa.Column("pillar", sa.String(80), nullable=False),
        sa.Column("post_format", sa.String(80), nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="Draft"),
        sa.Column("hook", sa.Text(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("cta", sa.Text(), nullable=False),
        sa.Column("hook_variants", postgresql.ARRAY(sa.Text()), nullable=False, server_default="{}"),
        sa.Column("scheduled_for", sa.String(20), nullable=True),
        sa.Column("scheduled_time", sa.String(24), nullable=True),
        sa.Column("impressions", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("reactions", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("comments", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("reposts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("engagement_rate", sa.Float(), nullable=False, server_default="0"),
        sa.Column("virality_score", sa.Integer(), nullable=False, server_default="80"),
        sa.Column("rag_sources", postgresql.ARRAY(sa.Text()), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "agent_runs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "creator_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("creator_profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("langfuse_trace_id", sa.String(128), nullable=True),
        sa.Column("topic", sa.Text(), nullable=False),
        sa.Column("total_latency_ms", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("node_traces", postgresql.JSONB(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("agent_runs")
    op.drop_table("linkedin_posts")
    op.drop_index("ix_voice_chunks_embedding_hnsw", table_name="voice_chunks")
    op.drop_table("voice_chunks")
    op.drop_table("voice_documents")
    op.drop_table("creator_profiles")

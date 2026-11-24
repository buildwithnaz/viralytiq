import hashlib
import math
import uuid
from typing import Any

from langchain_text_splitters import RecursiveCharacterTextSplitter
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.entities import VoiceChunk, VoiceDocument

settings = get_settings()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=80,
    separators=["\n\n", "\n", ". ", " "],
)


def compute_deterministic_embedding(text: str, dims: int = 1536) -> list[float]:
    """
    Normalized 1536-dim vector for local/dev pgvector when no embedding API key is set.
    """
    vec = [0.0] * dims
    tokens = [t.lower().strip(".,!?:;\"'") for t in text.split() if len(t) > 1]
    if not tokens:
        vec[0] = 1.0
        return vec
    for token in tokens:
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        idx = int.from_bytes(digest[:4], "big") % dims
        sign = 1.0 if digest[4] % 2 == 0 else -1.0
        vec[idx] += sign
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


async def index_voice_document(
    db: AsyncSession,
    creator_id: uuid.UUID,
    title: str,
    category: str,
    content: str,
) -> VoiceDocument:
    chunks_text = splitter.split_text(content) or [content[:600]]
    doc = VoiceDocument(
        creator_id=creator_id,
        title=title,
        category=category,
        content=content,
        token_count=max(20, int(len(content.split()) * 1.35)),
        active=True,
    )
    db.add(doc)
    await db.flush()

    for idx, chunk in enumerate(chunks_text):
        emb = compute_deterministic_embedding(chunk, settings.embedding_dimensions)
        db.add(
            VoiceChunk(
                document_id=doc.id,
                chunk_index=idx,
                chunk_text=chunk,
                embedding=emb,
            )
        )
    await db.flush()
    return doc


async def search_voice_chunks(
    db: AsyncSession,
    query: str,
    top_k: int = 3,
) -> list[dict[str, Any]]:
    query_vec = compute_deterministic_embedding(query, settings.embedding_dimensions)
    distance_expr = VoiceChunk.embedding.cosine_distance(query_vec)

    stmt = (
        select(
            VoiceChunk.chunk_text,
            VoiceDocument.title,
            (1.0 - distance_expr).label("similarity"),
        )
        .join(VoiceDocument, VoiceChunk.document_id == VoiceDocument.id)
        .where(VoiceDocument.active.is_(True))
        .order_by(distance_expr)
        .limit(top_k)
    )
    try:
        rows = (await db.execute(stmt)).all()
    except Exception:
        return []

    return [
        {
            "docTitle": row.title,
            "similarity": round(float(row.similarity), 3),
            "excerpt": (row.chunk_text or "")[:180],
        }
        for row in rows
    ]
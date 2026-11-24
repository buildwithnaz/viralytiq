import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.entities import CreatorProfile, VoiceDocument
from app.schemas.strategist import VoiceDocumentCreate
from app.services.rag_service import index_voice_document, search_voice_chunks

router = APIRouter(prefix="/rag", tags=["rag"])


async def _ensure_default_creator(db: AsyncSession) -> CreatorProfile:
    creator = (await db.execute(select(CreatorProfile).limit(1))).scalar_one_or_none()
    if creator is None:
        creator = CreatorProfile(
            name="Elena Vance",
            handle="in/elenavance-ai",
            headline="Founder @ LatticeFlow",
            audience_icp="Seed-Series B SaaS Founders & Staff Engineers",
            followers=42860,
        )
        db.add(creator)
        await db.flush()
    return creator


@router.get("/documents")
async def list_voice_documents(db: AsyncSession = Depends(get_db)) -> list[dict]:
    rows = (
        await db.execute(select(VoiceDocument).order_by(VoiceDocument.created_at.desc()))
    ).scalars().all()
    return [
        {
            "id": str(doc.id),
            "title": doc.title,
            "category": doc.category,
            "content": doc.content,
            "tokenCount": doc.token_count,
            "active": doc.active,
            "createdAt": doc.created_at.strftime("%Y-%m-%d") if doc.created_at else "",
        }
        for doc in rows
    ]


@router.post("/documents")
async def create_voice_document(
    payload: VoiceDocumentCreate,
    db: AsyncSession = Depends(get_db),
) -> dict:
    creator = await _ensure_default_creator(db)
    doc = await index_voice_document(
        db=db,
        creator_id=creator.id,
        title=payload.title,
        category=payload.category,
        content=payload.content,
    )
    return {
        "id": str(doc.id),
        "title": doc.title,
        "tokenCount": doc.token_count,
        "category": doc.category,
    }


@router.get("/search")
async def semantic_search(
    q: str = Query(..., min_length=2),
    top_k: int = Query(3, ge=1, le=10),
    db: AsyncSession = Depends(get_db),
) -> list[dict]:
    return await search_voice_chunks(db=db, query=q, top_k=top_k)


@router.delete("/documents/{doc_id}")
async def delete_voice_document(
    doc_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    doc = await db.get(VoiceDocument, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Voice document not found")
    await db.delete(doc)
    await db.flush()
    return {"status": "deleted", "id": str(doc_id)}
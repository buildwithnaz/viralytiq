import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.entities import LinkedInPost

router = APIRouter(prefix="/posts", tags=["posts"])


class PostStatusUpdate(BaseModel):
    status: str
    scheduled_for: str | None = None
    scheduled_time: str | None = None


@router.get("")
async def list_posts(db: AsyncSession = Depends(get_db)) -> list[dict]:
    rows = (
        await db.execute(select(LinkedInPost).order_by(LinkedInPost.created_at.desc()))
    ).scalars().all()
    return [
        {
            "id": str(p.id),
            "title": p.title,
            "pillar": p.pillar,
            "format": p.post_format,
            "status": p.status,
            "hook": p.hook,
            "body": p.body,
            "cta": p.cta,
            "scheduledFor": p.scheduled_for,
            "scheduledTime": p.scheduled_time,
            "impressions": p.impressions,
            "engagementRate": p.engagement_rate,
            "viralityScore": p.virality_score,
        }
        for p in rows
    ]


@router.patch("/{post_id}")
async def update_post_status(
    post_id: uuid.UUID,
    payload: PostStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    post = await db.get(LinkedInPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = payload.status
    if payload.scheduled_for is not None:
        post.scheduled_for = payload.scheduled_for
    if payload.scheduled_time is not None:
        post.scheduled_time = payload.scheduled_time
    await db.flush()
    return {"id": str(post.id), "status": post.status}
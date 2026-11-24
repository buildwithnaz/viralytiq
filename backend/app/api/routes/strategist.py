import json
import re
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.strategist_graph import run_strategist_langgraph
from app.core.config import get_settings
from app.core.database import get_db
from app.models.entities import CreatorProfile, LinkedInPost
from app.schemas.strategist import (
    BrainstormRequest,
    BrainstormResponse,
    BrainstormIdea,
    HookEvaluateRequest,
    StrategyGenerationRequest,
    StrategyGenerationResponse,
)

router = APIRouter(prefix="/strategist", tags=["strategist"])
settings = get_settings()


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


def _get_llm() -> Optional[ChatGroq]:
    if not settings.groq_api_key or settings.groq_api_key in ("", "your_groq_api_key"):
        return None
    return ChatGroq(
        api_key=settings.groq_api_key,
        model=settings.groq_fast_model or settings.groq_primary_model,
        temperature=0.7,
        max_tokens=1200,
    )


def _fallback_ideas(topic: str, count: int) -> list[dict[str, str]]:
    templates = [
        ("Contrarian take", "Everyone optimizes X. Almost nobody measures Y.", "Creates scroll-stop tension"),
        ("Operator playbook", "Three changes that cut our {topic} pain in half.", "Specificity + numbers"),
        ("Failure autopsy", "We shipped {topic} the wrong way. Here is the autopsy.", "Story + humility"),
        ("Benchmark reveal", "Our P95 on {topic} dropped under 200ms. How:", "Concrete proof"),
        ("Hiring signal", "What I look for when someone claims expertise in {topic}.", "Authority + ICP fit"),
        ("Stack teardown", "The boring architecture that made {topic} reliable.", "Anti-hype credibility"),
        ("Customer moment", "A single support ticket that forced us to rethink {topic}.", "Narrative hook"),
        ("Tradeoff post", "Fast vs correct on {topic} — what we chose and why.", "Decision framing"),
        ("Myth bust", "The {topic} advice that works in decks and fails in prod.", "Contrarian energy"),
        ("Weekly lesson", "What shipping {topic} taught me about team velocity.", "Founder lesson"),
    ]
    out = []
    for i, (angle, hook, why) in enumerate(templates[:count]):
        t = topic.strip() or "this"
        out.append(
            {
                "id": f"idea-{i+1}",
                "title": f"{angle}: {t[:48]}",
                "angle": angle,
                "hookPreview": hook.replace("{topic}", t[:40]),
                "whyItWorks": why,
            }
        )
    return out


@router.post("/brainstorm", response_model=BrainstormResponse)
async def brainstorm_ideas(payload: BrainstormRequest) -> BrainstormResponse:
    count = payload.count
    llm = _get_llm()
    ideas: list[dict[str, Any]] = []

    if llm:
        try:
            msg = await llm.ainvoke(
                [
                    SystemMessage(
                        content=(
                            "You are a LinkedIn content strategist for B2B technical founders. "
                            f"Return ONLY a JSON array of {count} objects with keys: "
                            "title, angle, hookPreview, whyItWorks. "
                            "hookPreview must be 1-2 short lines. No markdown fences."
                        )
                    ),
                    HumanMessage(
                        content=(
                            f"Topic / seed: {payload.topic}\n"
                            f"Audience: {payload.audience}\n"
                            "Ideas should be distinct angles (contrarian, playbook, story, proof, myth-bust)."
                        )
                    ),
                ]
            )
            raw = str(msg.content).strip()
            fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", raw, re.I)
            if fence:
                raw = fence.group(1).strip()
            start, end = raw.find("["), raw.rfind("]")
            if start != -1 and end > start:
                parsed = json.loads(raw[start : end + 1])
                if isinstance(parsed, list):
                    for i, item in enumerate(parsed[:count]):
                        if not isinstance(item, dict):
                            continue
                        ideas.append(
                            {
                                "id": f"idea-{i+1}",
                                "title": str(item.get("title") or f"Idea {i+1}")[:120],
                                "angle": str(item.get("angle") or "Angle")[:80],
                                "hookPreview": str(item.get("hookPreview") or "")[:240],
                                "whyItWorks": str(item.get("whyItWorks") or "")[:200],
                            }
                        )
        except Exception:
            ideas = []

    if len(ideas) < 5:
        ideas = _fallback_ideas(payload.topic, count)

    return BrainstormResponse(
        topic=payload.topic,
        ideas=[BrainstormIdea(**x) for x in ideas],
    )


@router.post("/generate", response_model=StrategyGenerationResponse)
async def generate_linkedin_strategy(
    payload: StrategyGenerationRequest,
    db: AsyncSession = Depends(get_db),
) -> StrategyGenerationResponse:
    result = await run_strategist_langgraph(db=db, req=payload)

    try:
        creator = await _ensure_default_creator(db)
        post_data = result["post"]
        post = LinkedInPost(
            id=uuid.uuid4(),
            creator_id=creator.id,
            title=post_data.get("title") or payload.topic[:120],
            pillar=post_data.get("pillar") or payload.pillar,
            post_format=post_data.get("format") or payload.format,
            status=post_data.get("status") or "Draft",
            hook=post_data.get("hook") or "",
            body=post_data.get("body") or "",
            cta=post_data.get("cta") or "",
            hook_variants=list(post_data.get("hookVariants") or []),
            scheduled_for=post_data.get("scheduledFor"),
            scheduled_time=post_data.get("scheduledTime"),
            virality_score=int(post_data.get("viralityScore") or 80),
            rag_sources=list(post_data.get("ragSourcesUsed") or []),
        )
        db.add(post)
        await db.flush()
        result["post"]["id"] = str(post.id)
    except Exception:
        pass

    return StrategyGenerationResponse(**result)


@router.post("/evaluate-hook")
async def evaluate_hook(payload: HookEvaluateRequest) -> dict:
    hook = payload.hook.strip()
    char_count = len(hook)
    lines = [line for line in hook.split("\n") if line.strip()]
    has_number = any(ch.isdigit() for ch in hook)
    scroll_stop = min(
        97,
        68 + (16 if char_count <= 170 else 0) + (10 if len(lines) >= 2 else 0),
    )
    specificity = min(96, 60 + (26 if has_number else 0))
    curiosity = min(95, 65 + (18 if len(lines) >= 2 else 0))
    return {
        "overallScore": round((scroll_stop + specificity + curiosity) / 3),
        "scrollStopPower": scroll_stop,
        "curiosityGap": curiosity,
        "specificity": specificity,
        "mobileFoldFit": char_count <= 210 and len(lines) <= 3,
        "charCount": char_count,
    }
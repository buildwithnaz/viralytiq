from typing import Literal, Optional
from pydantic import BaseModel, Field


ContentPillar = Literal[
    "Founder Lessons",
    "Technical Deep-Dive",
    "Contrarian Take",
    "Product Breakdown",
]

PostFormat = Literal["Text + Hook", "Carousel Outline", "Case Study"]

ToneOption = Literal[
    "Direct & Analytical",
    "Story-Driven",
    "Contrarian Sharp",
    "Educational",
]


class StrategyGenerationRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500)
    pillar: ContentPillar = "Technical Deep-Dive"
    format: PostFormat = "Text + Hook"
    tone: ToneOption = "Direct & Analytical"
    targetAudience: str = "Seed-Series B SaaS Founders & Staff Engineers"
    useVoiceRag: bool = True
    creatorId: Optional[str] = None


class BrainstormRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=400)
    audience: str = "Seed-Series B SaaS Founders & Staff Engineers"
    count: int = Field(default=8, ge=5, le=12)


class BrainstormIdea(BaseModel):
    id: str
    title: str
    angle: str
    hookPreview: str
    whyItWorks: str


class BrainstormResponse(BaseModel):
    topic: str
    ideas: list[BrainstormIdea]


class RetrievedChunkOut(BaseModel):
    docTitle: str
    similarity: float
    excerpt: str


class LangGraphNodeTraceOut(BaseModel):
    id: str
    nodeName: str
    label: str
    model: str
    status: Literal["idle", "running", "completed"]
    durationMs: int
    tokensIn: int
    tokensOut: int
    summary: str
    retrievedChunks: Optional[list[RetrievedChunkOut]] = None


class GeneratedPostOut(BaseModel):
    id: Optional[str] = None
    title: str
    pillar: ContentPillar
    format: PostFormat
    status: str = "Draft"
    hook: str
    body: str
    cta: str
    hookVariants: list[str]
    scheduledFor: str
    scheduledTime: str
    viralityScore: int
    ragSourcesUsed: list[str]


class StrategyGenerationResponse(BaseModel):
    post: GeneratedPostOut
    traces: list[LangGraphNodeTraceOut]
    langfuseTraceId: Optional[str] = None


class VoiceDocumentCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=240)
    category: Literal[
        "Past Viral Post",
        "Voice Guideline",
        "ICP Research",
        "Case Proof",
        "My LinkedIn Style",
        "Competitor Style",
        "Generated Draft",
    ]
    content: str = Field(..., min_length=20)
    creatorId: Optional[str] = None
    sourceUrl: Optional[str] = None


class HookEvaluateRequest(BaseModel):
    hook: str = Field(..., min_length=4, max_length=800)
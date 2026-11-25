# Viralytiq v2.0.0

AI Content Strategist powered by FastAPI, LangGraph, Groq, Supabase, and pgvector.

Viralytiq is a production-deployed AI content generation platform that combines Retrieval-Augmented Generation (RAG), multi-agent orchestration, creator voice memory, semantic search, analytics, and agent traces into a single workflow designed for LinkedIn content creation.

---

## Live Demo

### Frontend
https://viralytiq.vercel.app

### Backend API
https://viralytiq-api.onrender.com/docs

---

## Key Features

### Multi-Agent Content Generation

Viralytiq uses a specialized multi-agent workflow to generate high-quality LinkedIn content.

Agents include:

1. Audience & Signal Researcher
2. Voice RAG Retriever
3. Hook & Narrative Strategist
4. Virality & Anti-Slop Critic

Each agent performs a specific task before passing context to the next stage.

---

### Brand Memory

Store creator knowledge and writing style inside PostgreSQL + pgvector.

Capabilities:

- Long-term creator memory
- Semantic search
- Similarity retrieval
- Voice consistency
- Context-aware content generation

---

### Retrieval-Augmented Generation (RAG)

Viralytiq retrieves relevant creator memory before content generation.

Pipeline:

```text
Creator Memory
    ↓
Embeddings
    ↓
pgvector Search
    ↓
Relevant Chunks
    ↓
Content Generation
```

Benefits:

- Personalized outputs
- Reduced hallucinations
- Higher content consistency
- Reusable creator knowledge

---

### Agent Traces

Every workflow execution produces structured trace information.

Tracks:

- Agent steps
- Execution order
- RAG retrieval
- Token usage
- Latency metrics
- Trace identifiers

Example Workflow:

```text
Research Agent
    ↓
Voice RAG Retrieval
    ↓
Content Generation
    ↓
Quality Critique
```

---

### Analytics Dashboard

Track generated content and workflow performance.

Includes:

- Draft counts
- Virality scoring
- API generated posts
- Local session drafts
- Historical content tracking

---

### Semantic Search

Query stored creator memory using pgvector similarity search.

Example:

```text
"How do I write technical LinkedIn posts?"
```

returns semantically relevant memory documents instead of exact keyword matches.

---

## Architecture

```text
┌────────────────────────────┐
│        Next.js UI          │
│        (Vercel)            │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│       FastAPI API          │
│        (Render)            │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      LangGraph Agents      │
└─────────────┬──────────────┘
              │
     ┌────────┴────────┐
     ▼                 ▼
┌───────────┐   ┌─────────────┐
│   Groq    │   │ Brand Memory│
│   LLMs    │   │  pgvector   │
└───────────┘   └─────────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ PostgreSQL      │
               │ Supabase        │
               └─────────────────┘
```

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- LangGraph
- LangChain
- Python

### AI

- Groq
- GPT-OSS-120B
- Llama 3.1

### Data & Storage

- PostgreSQL
- Supabase
- pgvector

### Infrastructure

- Vercel
- Render

### Observability

- Langfuse-ready trace integration
- Agent execution traces
- Workflow telemetry

---

## Database Schema

Key tables:

```text
agent_runs
alembic_version
creator_profiles
linkedin_posts
voice_chunks
voice_documents
```

Capabilities:

- Creator memory
- Semantic retrieval
- Stored generations
- Trace persistence

---

## Example Workflow

```text
Topic Input
      ↓
Audience Research
      ↓
Retrieve Creator Voice
      ↓
Generate LinkedIn Draft
      ↓
Critique & Refinement
      ↓
Save Analytics & Traces
```

---

## Local Development

### Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# Windows:
# .venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API Docs:

```text
http://localhost:8000/docs
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## Environment Variables

Backend:

```env
DATABASE_URL=
SYNC_DATABASE_URL=

GROQ_API_KEY=

LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_HOST=https://cloud.langfuse.com
```

Frontend:

```env
NEXT_PUBLIC_API_URL=
```

---

## Production Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- Supabase PostgreSQL

### Vector Search

- pgvector

---

## Changelog

### v2.0.0

Production Launch

Features shipped:

- Public deployment
- Multi-agent generation workflow
- Supabase integration
- PostgreSQL persistence
- pgvector semantic search
- Brand Memory
- Analytics Dashboard
- Agent Traces
- Creator Voice RAG
- Semantic Search
- Production-ready infrastructure
- FastAPI API
- Next.js Frontend

### v1.0.0

Initial MVP release

- Local-first workflow
- Basic strategist generation
- LangGraph pipeline
- Initial UI

---

## Future Roadmap

### v2.1

- Real Langfuse cloud observability
- Trace drill-down views
- Cost analytics

### v2.2

- LinkedIn post scheduling
- Multi-account creator profiles

### v3.0

- Multi-platform publishing
- X/Twitter support
- Blog generation
- YouTube script generation

---

## License

MIT License

Copyright (c) 2026 Nazimuddin Borbora

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

See the LICENSE file for full details.
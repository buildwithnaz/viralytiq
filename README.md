# Viralytiq

AI-powered LinkedIn content strategy platform that combines multi-agent workflows, Brand Memory (RAG), semantic search, and observability to generate creator-aligned content at scale.

## Live Demo

Frontend:
https://viralytiq.vercel.app/

Backend API:
https://viralytiq-api.onrender.com/

API Documentation:
https://viralytiq-api.onrender.com/docs

OpenAPI Schema:
https://viralytiq-api.onrender.com/openapi.json

---

## Overview

Viralytiq helps creators, founders, and B2B professionals generate high-quality LinkedIn content using:

- Multi-agent AI workflows
- Creator Brand Memory
- Semantic Search via pgvector
- LangGraph orchestration
- Langfuse observability
- PostgreSQL persistence

The system stores creator-specific knowledge and retrieves it during content generation to maintain consistency in style, tone, positioning, and messaging.

---

## Features

### AI Content Strategy Engine

- Multi-agent LinkedIn content generation
- Audience research and positioning
- Hook and narrative generation
- CTA optimization
- Virality scoring
- Content critique and refinement

### Brand Memory (RAG)

- Upload creator voice documents
- Store knowledge in PostgreSQL
- Automatic chunking pipeline
- Semantic retrieval using pgvector
- Memory-aware content generation
- Consistent creator voice

### Semantic Search

- pgvector-powered similarity search
- Vector-based content retrieval
- Context-aware knowledge injection
- Fast retrieval workflow

### Observability & Monitoring

- Langfuse tracing integration
- Session-level tracking
- User-level attribution
- LangGraph execution monitoring
- Prompt observability
- Response tracing
- Agent workflow debugging

### Production Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on Supabase
- Environment-based configuration
- Production-ready API architecture

---

## Architecture

```text
                   Frontend
               (Next.js 15)
                      |
                      v
               FastAPI Backend
                      |
                      v
              LangGraph Workflow
                      |
     -----------------------------------
     |               |                |
     v               v                v
Research Agent   Voice RAG      Draft Agent
                 Retrieval
                      |
                      v
               Critique Agent
                      |
                      v
               LinkedIn Draft
```

### Observability Layer

```text
LangGraph
    |
    v
Langfuse
    |
    v
Execution Traces
Prompt Tracking
Agent Monitoring
```

---

## AI Workflow

### 1. Research Agent

Analyzes:

- Topic
- Audience
- Content Pillar
- Strategic Angles

### 2. Brand Memory Retrieval

Retrieves:

- Past creator knowledge
- Voice documents
- Strategic insights
- Relevant context

### 3. Draft Generation

Generates:

- Hooks
- Main content
- Narrative flow
- CTA

### 4. Critique Agent

Evaluates:

- Virality potential
- Hook quality
- Formatting
- Content quality

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL

### AI Stack

- LangGraph
- LangChain
- Groq
- pgvector

### Observability

- Langfuse

### Infrastructure

- Vercel
- Render
- Supabase

---

## Database Components

### Creator Profiles

Stores creator metadata and preferences.

### LinkedIn Posts

Stores generated content and analytics.

### Voice Documents

Stores uploaded creator memory documents.

### Voice Chunks

Stores chunked content with embeddings for semantic retrieval.

---

## Environment Variables

### Backend

```env
APP_ENV=production

DATABASE_URL=
SYNC_DATABASE_URL=

GROQ_API_KEY=

LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

---

## Local Development

### Backend

```bash
cd backend

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Deployment

### Frontend

Vercel

### Backend

Render

### Database

Supabase PostgreSQL

---

## Version History

### v2.1.0

#### Added

- Langfuse observability integration
- LangGraph execution tracing
- Session metadata tracking
- User-level trace attribution
- Automatic trace flushing

#### Improved

- Workflow visibility
- AI debugging experience
- Agent execution monitoring

#### Verified

- Brand Memory retrieval
- pgvector semantic search
- Content generation workflow
- PostgreSQL persistence
- Render deployment
- Vercel deployment

---

### v2.0.0

#### Added

- Brand Memory RAG
- pgvector semantic search
- Voice document ingestion
- Creator memory retrieval
- Supabase PostgreSQL integration

---

### v1.0.0

#### Initial Release

- LinkedIn content generation
- LangGraph workflow
- Groq integration
- FastAPI backend
- Next.js frontend

---

## License

MIT License

---

## Author

Nazimuddin Borbora

Built as a production-focused AI Content Strategy Platform demonstrating:

- Retrieval-Augmented Generation (RAG)
- Multi-Agent Systems
- Vector Databases
- LangGraph Orchestration
- Langfuse Observability
- Full-Stack AI Engineering
<div align="center">

# Viralytiq

### AI-Powered Content Strategist for LinkedIn Creators & Professionals

Generate high-performing LinkedIn content using AI, brand memory, semantic search, and strategic content frameworks.

</div>

---

## Overview

Viralytiq is an AI content strategy platform that helps professionals create consistent, high-quality LinkedIn content.

Instead of generating generic AI posts, Viralytiq builds a reusable brand memory layer that learns writing style, positioning, and content patterns to generate more authentic content.

The platform supports:

- Idea generation
- Content expansion
- Voice & style memory
- Semantic search
- Brand knowledge retrieval
- AI-powered content workflows
- Agent traces and observability (in progress)

---

## Features

### Content Strategy Engine

Generate content ideas from:

- Personal experiences
- Technical insights
- Industry trends
- Customer stories
- Failure analysis
- Contrarian viewpoints

---

### Content Studio

Convert ideas into complete LinkedIn drafts.

Features:

- Hook generation
- Long-form post creation
- Content refinement
- Strategic storytelling structures

---

### Brand Memory (Voice RAG)

Store writing samples and content references to build a personalized knowledge base.

Features:

- Writing style storage
- Competitor style analysis
- Semantic retrieval
- Vector search
- Voice consistency

---

### Analytics Dashboard

Track:

- Content generation activity
- Draft quality metrics
- Strategy usage

---

### Agent Trace Viewer

Observe AI workflow execution:

- Prompt flow
- Retrieval events
- LLM calls
- Validation steps

---

## Architecture

```text
                    ┌─────────────┐
                    │   Frontend  │
                    │  Next.js    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  FastAPI    │
                    │  Backend    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼

   Content Engine    Brand Memory      Analytics

         │
         ▼

   Embeddings Layer
         │
         ▼

     Vector Store
         │
         ▼

 Semantic Retrieval
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
- Python
- Pydantic

### AI Stack

- Groq
- Google Gemini
- Embeddings
- RAG Pipeline

### Data Layer

- PostgreSQL
- Vector Storage
- Semantic Search

---

## Screenshots

### Overview Dashboard

![Overview](docs/screenshots/overview.png)

### Brand Memory

![Brand Memory](docs/screenshots/brand-memory.png)

### Content Studio

![Content Studio](docs/screenshots/content-studio.png)

---

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL
- Docker (optional)

---

### Backend Setup

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

Create:

```env
GROQ_API_KEY=
GEMINI_API_KEY=
DATABASE_URL=
EMBEDDING_API_KEY=
```

Run:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

### Frontend Setup

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

## Roadmap

### Completed

- [x] Idea Generation
- [x] Content Studio
- [x] LinkedIn Draft Expansion
- [x] Multi-page Dashboard
- [x] FastAPI Backend
- [x] Modern UI

### In Progress

- [ ] Brand Memory Persistence
- [ ] Vector Indexing
- [ ] Semantic Search
- [ ] Content-to-Memory Sync
- [ ] Agent Tracing

### Planned

- [ ] Evaluation Framework
- [ ] Content Scoring
- [ ] Multi-Model Support
- [ ] Analytics Improvements
- [ ] Export to LinkedIn

---

## Why I Built This

Most AI writing tools generate generic content.

Viralytiq focuses on helping creators build a consistent personal brand by combining content strategy, retrieval-augmented generation (RAG), semantic memory, and AI-powered drafting workflows.

This project is being developed as a demonstration of modern AI engineering concepts including:

- LLM Applications
- RAG
- Embeddings
- Semantic Search
- Agent Workflows
- Observability
- FastAPI
- Next.js

---

## License

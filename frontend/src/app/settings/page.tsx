'use client';

import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>
        <p className="mt-2 text-slate-400">
          Configure providers and observability via backend environment variables.
        </p>
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Backend configuration</h2>
        <p className="mb-4 text-slate-300">
          Secrets live in the FastAPI service <code className="text-xs">.env</code> (see{' '}
          <code className="text-xs">backend/.env.example</code>). The Next.js app proxies{' '}
          <code className="text-xs">/api/v1/*</code> to{' '}
          <code className="text-xs">FASTAPI_URL</code>.
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>
            <span className="text-slate-200">GROQ_API_KEY</span> — primary LLM for LangGraph nodes
          </li>
          <li>
            <span className="text-slate-200">DATABASE_URL</span> — Postgres + pgvector
          </li>
          <li>
            <span className="text-slate-200">LANGFUSE_*</span> — optional tracing
          </li>
          <li>
            <span className="text-slate-200">CORS_ORIGINS</span> — frontend origin allowlist
          </li>
          <li>
            <span className="text-slate-200">FASTAPI_URL</span> — Next rewrite target (default{' '}
            <code className="text-xs">http://localhost:8000</code>)
          </li>
        </ul>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Product surface</h2>
        <p className="text-sm text-slate-400">
          Dashboard and Content Studio call the strategist graph. Brand Memory maps to RAG
          document CRUD and semantic search. Analytics reads the posts library.
        </p>
      </Card>
    </div>
  );
}
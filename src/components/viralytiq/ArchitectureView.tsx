import * as React from 'react';
import { Cpu, Database, Layers, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { LangGraphNodeTrace } from '../../types/viralytiq';

interface ArchitectureViewProps {
  traces: LangGraphNodeTrace[];
}

export function ArchitectureView({ traces }: ArchitectureViewProps) {
  const totalLatency = traces.reduce((acc, n) => acc + n.durationMs, 0);
  const totalTokens = traces.reduce((acc, n) => acc + n.tokensIn + n.tokensOut, 0);

  const stackLayers = [
    {
      title: 'Frontend Layer (frontend/)',
      subtitle: 'Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS · Shadcn UI',
      detail:
        'App Router glassmorphism workspace with server-ready API proxy rewrites (/api/v1/*) to FastAPI and accessible Radix/Shadcn primitives.',
      icon: Layers,
    },
    {
      title: 'Backend Layer (backend/)',
      subtitle: 'Python 3.12 · FastAPI · Async SQLAlchemy 2.0 · Alembic Migrations',
      detail:
        'Strict FastAPI-only service exposing typed Pydantic v2 endpoints for LangGraph strategy execution, pgvector document ingestion, hook evaluation, and creator analytics.',
      icon: Server,
    },
    {
      title: 'AI & Vector Stack',
      subtitle: 'Groq API · LangGraph · LangChain · PostgreSQL pgvector · Langfuse',
      detail:
        '4-node stateful LangGraph workflow (researcher -> pgvector voice RAG -> writer -> critic) running ultra-low-latency Llama 3.3 inference on Groq with Langfuse span tracing.',
      icon: Cpu,
    },
    {
      title: 'Infrastructure (infrastructure/)',
      subtitle: 'Docker Compose · pgvector:pg16 · Nginx Reverse Proxy · Langfuse',
      detail:
        'Containerized multi-service topology with PostgreSQL 16 HNSW vector indexing, automated Alembic schema upgrades, and health-checked service orchestration.',
      icon: Database,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {stackLayers.map((layer) => {
          const Icon = layer.icon;
          return (
            <Card key={layer.title}>
              <CardHeader className="pb-2 flex flex-row items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-400/25 text-indigo-300">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <CardTitle>{layer.title}</CardTitle>
                  <CardDescription>{layer.subtitle}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 leading-relaxed">{layer.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Latest Langfuse + LangGraph Run Waterfall */}
      <Card>
        <CardHeader className="border-b border-white/[0.06] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Latest LangGraph + Langfuse Execution Waterfall</CardTitle>
            <CardDescription>
              Per-node latency, token budget, and inference model attribution
            </CardDescription>
          </div>
          <span className="font-mono text-xs text-slate-300 tabular-nums">
            {totalLatency} ms · {totalTokens.toLocaleString()} tokens
          </span>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {traces.map((node) => {
            const widthPct = Math.max(8, Math.round((node.durationMs / Math.max(totalLatency, 1)) * 100));
            return (
              <div key={node.id} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-slate-100">{node.label}</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {node.model} · {node.durationMs}ms · {node.tokensIn} in / {node.tokensOut} out
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

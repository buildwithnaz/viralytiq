'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { loadLastTraces } from '@/lib/api';

type TraceRow = {
  id?: string;
  nodeName?: string;
  label?: string;
  model?: string;
  status?: string;
  durationMs?: number;
  summary?: string;
};

export default function TracesPage() {
  const [at, setAt] = React.useState<string | null>(null);
  const [traces, setTraces] = React.useState<TraceRow[]>([]);

  React.useEffect(() => {
    const data = loadLastTraces();
    if (data?.traces?.length) {
      setTraces(data.traces as TraceRow[]);
      setAt(data.at || null);
    }
  }, []);

  const refresh = () => {
    const data = loadLastTraces();
    if (data?.traces?.length) {
      setTraces(data.traces as TraceRow[]);
      setAt(data.at || null);
    } else {
      setTraces([]);
      setAt(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Agent Traces</h1>
          <p className="mt-2 text-slate-400">
            Live LangGraph node timeline from your last generate / expand run in this
            browser (saved when Overview or Content Studio completes a strategist call).
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10"
        >
          Refresh
        </button>
      </div>

      {at && (
        <p className="text-xs text-slate-500">
          Last run: {new Date(at).toLocaleString()}
        </p>
      )}

      <Card>
        {traces.length === 0 ? (
          <div className="space-y-2 text-slate-400">
            <p>No live traces yet.</p>
            <p className="text-sm">
              Run <strong className="text-slate-200">Generate 8 ideas → expand</strong> on
              Overview, or <strong className="text-slate-200">Generate draft</strong> in
              Content Studio. Node timings from the API response will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {traces.map((step, i) => (
              <div
                key={step.id || step.nodeName || i}
                className="flex flex-col gap-1 rounded-xl bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">
                    <span className="mr-2 text-slate-500">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    {step.label || step.nodeName || 'Node'}
                  </p>
                  {step.nodeName && (
                    <p className="font-mono text-xs text-slate-500">{step.nodeName}</p>
                  )}
                  {step.model && (
                    <p className="text-xs text-slate-500">{step.model}</p>
                  )}
                  {step.summary && (
                    <p className="mt-1 text-sm text-slate-400">{step.summary}</p>
                  )}
                </div>
                <span className="shrink-0 text-green-400">
                  {step.status === 'completed' || !step.status ? '✅' : '…'}{' '}
                  {typeof step.durationMs === 'number'
                    ? `${(step.durationMs / 1000).toFixed(1)}s`
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Pipeline (reference)</h2>
        <p className="text-sm text-slate-400">
          research_trends → retrieve_voice_rag → draft_linkedin_post → critique_and_refine.
          With Langfuse keys on the backend, each generate also emits a cloud trace id.
        </p>
      </Card>
    </div>
  );
}
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  brainstormIdeas,
  type BrainstormIdea,
  generateStrategy,
  saveLastTraces,
  saveLocalPost,
} from '@/lib/api';

export default function OverviewPage() {
  const router = useRouter();
  const [topic, setTopic] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [expandingId, setExpandingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [ideas, setIdeas] = React.useState<BrainstormIdea[]>([]);
  const [selected, setSelected] = React.useState<BrainstormIdea | null>(null);
  const [draft, setDraft] = React.useState<{
    hook: string;
    body: string;
    cta: string;
    viralityScore: number;
  } | null>(null);

  const handleBrainstorm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Enter a topic or theme to brainstorm.');
      return;
    }
    setError(null);
    setLoading(true);
    setSelected(null);
    setDraft(null);
    try {
      const data = await brainstormIdeas({ topic: topic.trim(), count: 8 });
      setIdeas(data.ideas || []);
    } catch {
      const t = topic.trim();
      setIdeas(
        [
          ['Contrarian', `Everyone optimizes ${t}. Almost nobody measures the bottleneck.`],
          ['Playbook', `Three changes that made ${t} actually ship.`],
          ['Story', `The support ticket that forced us to rethink ${t}.`],
          ['Proof', `We cut ${t} latency in half. Here is the boring architecture.`],
          ['Myth', `The ${t} advice that works in decks and fails in production.`],
          ['Hiring', `What I test for when someone claims ${t} expertise.`],
          ['Tradeoff', `Fast vs correct on ${t} — what we chose.`],
          ['Lesson', `What shipping ${t} taught me about team velocity.`],
        ].map(([angle, hook], i) => ({
          id: `local-${i + 1}`,
          title: `${angle}: ${t.slice(0, 48)}`,
          angle,
          hookPreview: hook,
          whyItWorks: 'Strong scroll-stop + concrete framing',
        }))
      );
      setError('Backend brainstorm unavailable — showing local idea templates.');
    } finally {
      setLoading(false);
    }
  };

  const expandIdea = async (idea: BrainstormIdea) => {
    setSelected(idea);
    setExpandingId(idea.id);
    setDraft(null);
    try {
      const data = await generateStrategy({
        topic: `${idea.title}. Angle: ${idea.angle}. Hook seed: ${idea.hookPreview}`,
        useVoiceRag: true,
      });
      if (data?.traces) saveLastTraces(data.traces);
      if (data?.post) {
        const post = {
          hook: data.post.hook,
          body: data.post.body,
          cta: data.post.cta,
          viralityScore: data.post.viralityScore ?? 85,
          title: data.post.title || idea.title,
          status: 'Draft',
        };
        setDraft(post);
        saveLocalPost(post);
      }
    } catch {
      setDraft({
        hook: idea.hookPreview,
        body: `Expanding "${idea.title}" into a full LinkedIn draft.\n\n1. Open with the tension in the hook\n2. Ground the middle in a real operator decision\n3. Close with a question your ICP can answer in one line`,
        cta: 'What would you try first?',
        viralityScore: 84,
      });
    } finally {
      setExpandingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Overview</h1>
        <p className="mt-2 text-slate-400">
          Brainstorm post ideas from a theme, pick one, then expand into a full draft.
          Full writing controls live in Content Studio.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-400">Ideas this session</p>
          <h3 className="mt-2 text-3xl font-bold">{ideas.length || '—'}</h3>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Selected</p>
          <h3 className="mt-2 text-3xl font-bold text-indigo-300">
            {selected ? '1' : '0'}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Draft ready</p>
          <h3 className="mt-2 text-3xl font-bold text-green-400">
            {draft ? 'Yes' : '—'}
          </h3>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Virality score</p>
          <h3 className="mt-2 text-3xl font-bold">
            {draft?.viralityScore ?? '—'}
          </h3>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-300" />
          <h2 className="text-xl font-semibold">Idea brainstorm</h2>
        </div>
        <form onSubmit={handleBrainstorm} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              What topic or theme do you want ideas for?
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. RAG latency in production, hiring staff engineers, multi-agent workflows"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500/50"
            />
          </div>
          {error && <p className="text-sm text-amber-300/90">{error}</p>}
          <Button type="submit" disabled={loading}>
            <Sparkles className="h-4 w-4" />
            {loading ? 'Brainstorming…' : 'Generate 8 ideas'}
          </Button>
        </form>
      </Card>

      {ideas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Pick an idea to expand</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {ideas.map((idea) => {
              const active = selected?.id === idea.id;
              return (
                <button
                  key={idea.id}
                  type="button"
                  onClick={() => expandIdea(idea)}
                  disabled={expandingId !== null}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    active
                      ? 'border-indigo-500/40 bg-indigo-500/15'
                      : 'border-white/10 bg-white/5 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-white">{idea.title}</p>
                    <span className="shrink-0 rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                      {idea.angle}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                    {idea.hookPreview}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{idea.whyItWorks}</p>
                  {expandingId === idea.id && (
                    <p className="mt-2 text-xs text-indigo-300">Expanding to full draft…</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {draft && (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Expanded draft</h2>
            <Button
              type="button"
              variant="glass"
              size="sm"
              onClick={() => {
                try {
                  sessionStorage.setItem(
                    'viralytiq_studio_seed',
                    JSON.stringify({
                      topic: selected?.title || topic,
                      hook: draft.hook,
                      body: draft.body,
                      cta: draft.cta,
                    })
                  );
                } catch {
                  /* ignore */
                }
                router.push('/content');
              }}
            >
              Open in Content Studio
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="whitespace-pre-line text-lg font-bold">{draft.hook}</p>
          <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">{draft.body}</p>
          <p className="mt-4 font-semibold text-indigo-300">{draft.cta}</p>
        </Card>
      )}
    </div>
  );
}
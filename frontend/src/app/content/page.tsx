'use client';

import * as React from 'react';
import { Sparkles, BookmarkPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  generateStrategy,
  createVoiceDocument,
  saveLastTraces,
  saveLocalPost,
  type StrategyRequest,
} from '@/lib/api';

export default function ContentPage() {
  const [topic, setTopic] = React.useState('');
  const [tone, setTone] =
    React.useState<NonNullable<StrategyRequest['tone']>>('Direct & Analytical');
  const [loading, setLoading] = React.useState(false);
  const [savingMemory, setSavingMemory] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    hook: string;
    body: string;
    cta: string;
    viralityScore: number;
    title?: string;
  } | null>(null);

  React.useEffect(() => {
    try {
      const seed = sessionStorage.getItem('viralytiq_studio_seed');
      if (seed) {
        const data = JSON.parse(seed);
        if (data.topic) setTopic(String(data.topic));
        if (data.hook || data.body) {
          setResult({
            hook: data.hook || '',
            body: data.body || '',
            cta: data.cta || '',
            viralityScore: 86,
            title: data.topic,
          });
        }
        sessionStorage.removeItem('viralytiq_studio_seed');
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Enter a topic or idea to generate content.');
      return;
    }
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const data = await generateStrategy({
        topic: topic.trim(),
        tone,
        format: 'Text + Hook',
        useVoiceRag: true,
      });
      if (data?.traces) saveLastTraces(data.traces);
      const post = data?.post;
      if (post) {
        const shaped = {
          hook: post.hook,
          body: post.body,
          cta: post.cta,
          viralityScore: post.viralityScore ?? 0,
          title: post.title,
        };
        setResult(shaped);
        saveLocalPost({ ...shaped, status: 'Draft' });
      } else {
        setError('Unexpected response from strategist.');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reach the FastAPI strategist. Is the backend running?'
      );
      const shaped = {
        title: topic.trim().slice(0, 80),
        hook: `Most teams treat ${topic.trim().slice(0, 40)} as a model problem.\nIt's usually an architecture problem.`,
        body: `When shipping ${topic.trim()}, the winning pattern is measurable outcomes, clear boundaries, and systems you can observe end-to-end.`,
        cta: 'What part of this are you optimizing next?',
        viralityScore: 87,
      };
      setResult(shaped);
      saveLocalPost({ ...shaped, status: 'Draft' });
    } finally {
      setLoading(false);
    }
  };

  const saveToBrandMemory = async () => {
    if (!result) return;
    setSavingMemory(true);
    setNotice(null);
    setError(null);
    const content = `HOOK:\n${result.hook}\n\nBODY:\n${result.body}\n\nCTA:\n${result.cta}`;
    try {
      await createVoiceDocument({
        title: result.title || topic.slice(0, 80) || 'Generated draft',
        category: 'Generated Draft',
        content,
      });
      setNotice('Saved to Brand Memory as a Generated Draft (used by Voice RAG).');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not save to Brand Memory — is the backend up?'
      );
    } finally {
      setSavingMemory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Content Studio</h1>
        <p className="mt-2 text-slate-400">
          Turn a topic or selected idea into a voice-aligned LinkedIn draft via the LangGraph strategist.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Topic or idea</label>
              <textarea
                rows={6}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 outline-none focus:border-indigo-500/50"
                placeholder="Write a LinkedIn post about why RAG latency matters more than model size..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Writing tone</label>
              <select
                value={tone}
                onChange={(e) =>
                  setTone(e.target.value as NonNullable<StrategyRequest['tone']>)
                }
                className="dark-select w-full rounded-xl border border-white/10 bg-[#0b1020] px-3 py-2.5 text-slate-100 outline-none focus:border-indigo-500/50"
              >
                <option value="Direct & Analytical">Direct & Analytical</option>
                <option value="Story-Driven">Story-Driven</option>
                <option value="Contrarian Sharp">Contrarian Sharp</option>
                <option value="Educational">Educational</option>
              </select>
            </div>
            {error && <p className="text-sm text-amber-300/90">{error}</p>}
            {notice && <p className="text-sm text-green-300/90">{notice}</p>}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading}>
                <Sparkles className="h-4 w-4" />
                {loading ? 'Generating…' : 'Generate draft'}
              </Button>
              {result && (
                <Button
                  type="button"
                  variant="glass"
                  disabled={savingMemory}
                  onClick={saveToBrandMemory}
                >
                  <BookmarkPlus className="h-4 w-4" />
                  {savingMemory ? 'Saving…' : 'Save to Brand Memory'}
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Draft preview</h2>
          {!result ? (
            <p className="text-slate-400">
              Generate a draft here, or pick an idea on Overview and open it in the studio.
            </p>
          ) : (
            <div className="space-y-4">
              {result.title && (
                <p className="text-sm font-medium text-slate-400">{result.title}</p>
              )}
              <p className="whitespace-pre-line text-lg font-bold">{result.hook}</p>
              <p className="whitespace-pre-line leading-7 text-slate-300">{result.body}</p>
              <p className="font-semibold text-indigo-300">{result.cta}</p>
              <p className="text-sm text-slate-500">
                Virality score:{' '}
                <span className="text-indigo-300">{result.viralityScore}</span>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
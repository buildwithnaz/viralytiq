'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  createVoiceDocument,
  fetchVoiceDocuments,
  deleteVoiceDocument,
  searchVoiceMemory,
} from '@/lib/api';

type Doc = {
  id: string;
  title: string;
  category: string;
  content: string;
  tokenCount?: number;
  active?: boolean;
  createdAt?: string;
};

const CATEGORIES = [
  'My LinkedIn Style',
  'Competitor Style',
  'Past Viral Post',
  'Voice Guideline',
  'ICP Research',
  'Case Proof',
  'Generated Draft',
] as const;

export default function MemoryPage() {
  const [docs, setDocs] = React.useState<Doc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState('');
  const [category, setCategory] =
    React.useState<(typeof CATEGORIES)[number]>('My LinkedIn Style');
  const [content, setContent] = React.useState('');
  const [sourceUrl, setSourceUrl] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [searchHits, setSearchHits] = React.useState<
    Array<{ docTitle?: string; excerpt?: string; similarity?: number }>
  >([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVoiceDocuments();
      setDocs(Array.isArray(data) ? data : []);
    } catch {
      setError(
        'Could not load Brand Memory from the API. Start Postgres + FastAPI to index style samples.'
      );
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || content.trim().length < 20) {
      setError('Title required; paste at least ~20 characters of writing samples.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body = sourceUrl.trim()
        ? `Source: ${sourceUrl.trim()}\n\n${content.trim()}`
        : content.trim();
      await createVoiceDocument({
        title: title.trim(),
        category,
        content: body,
        sourceUrl: sourceUrl.trim() || undefined,
      });
      setTitle('');
      setContent('');
      setSourceUrl('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to index document.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVoiceDocument(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError('Delete failed.');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    try {
      const hits = await searchVoiceMemory(query.trim());
      setSearchHits(Array.isArray(hits) ? hits : []);
    } catch {
      setSearchHits([]);
      setError('Semantic search failed (is pgvector + backend up?).');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Brand Memory</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          This is your <span className="text-slate-200">Voice RAG</span> store — not a post
          archive by itself. Paste your own LinkedIn posts (or a competitor&apos;s public
          writing) so the strategist can match tone, structure, and phrasing. Content Studio
          can also push finished drafts here with &quot;Save to Brand Memory&quot;.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-xl font-semibold">Add style / knowledge source</h2>
          <p className="mb-4 text-xs text-slate-500">
            Optional LinkedIn profile or post URL for reference. Paste the actual writing
            sample in the box (APIs cannot scrape LinkedIn for you).
          </p>
          <form onSubmit={handleAdd} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My top 10 posts · Competitor: Jane Doe style"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-indigo-500/50"
            />
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="LinkedIn profile or post URL (optional)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-indigo-500/50"
            />
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as (typeof CATEGORIES)[number])
              }
              className="dark-select w-full rounded-xl border border-white/10 bg-[#0b1020] px-3 py-2.5 text-slate-100 outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste several posts or excerpts so the model can learn cadence, hooks, and vocabulary…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 outline-none focus:border-indigo-500/50"
            />
            <Button type="submit" disabled={saving}>
              {saving ? 'Indexing…' : 'Index into Voice RAG'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Semantic search</h2>
          <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query voice memory…"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-indigo-500/50"
            />
            <Button type="submit" variant="glass">
              Search
            </Button>
          </form>
          <ul className="space-y-3">
            {searchHits.length === 0 && (
              <li className="text-sm text-slate-500">No hits yet.</li>
            )}
            {searchHits.map((h, i) => (
              <li
                key={i}
                className="rounded-xl border border-white/8 bg-white/5 p-3 text-sm"
              >
                <p className="font-medium text-slate-200">
                  {h.docTitle ?? 'Chunk'}
                  {typeof h.similarity === 'number' && (
                    <span className="ml-2 text-xs text-indigo-300">
                      sim {(h.similarity * 100).toFixed(0)}%
                    </span>
                  )}
                </p>
                <p className="mt-1 line-clamp-3 text-slate-400">{h.excerpt}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">
          Indexed sources {loading ? '(loading…)' : `(${docs.length})`}
        </h2>
        {docs.length === 0 && !loading ? (
          <p className="text-slate-400">
            Empty memory. Add your posts, competitor samples, or save drafts from Content
            Studio so RAG can ground future generations.
          </p>
        ) : (
          <ul className="space-y-3">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/5 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white">{d.title}</p>
                  <p className="text-xs text-slate-500">
                    {d.category}
                    {d.tokenCount != null ? ` · ~${d.tokenCount} tokens` : ''}
                    {d.createdAt ? ` · ${d.createdAt}` : ''}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{d.content}</p>
                </div>
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
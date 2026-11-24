'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { fetchPosts, loadLocalPosts } from '@/lib/api';

type PostRow = {
  title?: string;
  viralityScore?: number;
  engagementRate?: number;
  impressions?: number;
  status?: string;
  hook?: string;
  source?: 'api' | 'local';
};

export default function AnalyticsPage() {
  const [posts, setPosts] = React.useState<PostRow[]>([]);
  const [sourceNote, setSourceNote] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = loadLocalPosts().map((p) => ({
        title: String(p.title || p.hook || 'Untitled').slice(0, 120),
        viralityScore: Number(p.viralityScore) || undefined,
        status: String(p.status || 'Draft'),
        hook: p.hook ? String(p.hook) : undefined,
        impressions: typeof p.impressions === 'number' ? p.impressions : undefined,
        source: 'local' as const,
      }));

      try {
        const data = await fetchPosts();
        if (cancelled) return;
        const apiPosts: PostRow[] = (Array.isArray(data) ? data : []).map(
          (p: Record<string, unknown>) => ({
            title: String(p.title || 'Untitled'),
            viralityScore:
              typeof p.viralityScore === 'number' ? p.viralityScore : undefined,
            engagementRate:
              typeof p.engagementRate === 'number' ? p.engagementRate : undefined,
            impressions:
              typeof p.impressions === 'number' ? p.impressions : undefined,
            status: String(p.status || 'Draft'),
            hook: p.hook ? String(p.hook) : undefined,
            source: 'api' as const,
          })
        );
        const titles = new Set(apiPosts.map((p) => p.title));
        const merged = [
          ...apiPosts,
          ...local.filter((p) => p.title && !titles.has(p.title)),
        ];
        setPosts(merged);
        setSourceNote(
          apiPosts.length
            ? `Loaded ${apiPosts.length} post(s) from API` +
                (local.length ? ` + ${local.length} local draft(s)` : '')
            : local.length
              ? `API returned 0 posts — showing ${local.length} local draft(s) from this browser`
              : 'No posts yet. Generate from Overview or Content Studio.'
        );
      } catch {
        if (cancelled) return;
        setPosts(local);
        setSourceNote(
          local.length
            ? `Could not reach /api/v1/posts — showing ${local.length} local draft(s) stored in this browser`
            : 'Could not load posts from API and no local drafts found. Generate content first, or start the backend.'
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scored = posts.filter((p) => typeof p.viralityScore === 'number');
  const avgVirality =
    scored.length > 0
      ? Math.round(
          scored.reduce((s, p) => s + (p.viralityScore || 0), 0) / scored.length
        )
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Analytics</h1>
        <p className="mt-2 text-slate-400">
          Drafts saved by the strategist (database) plus local session drafts.
        </p>
      </div>

      {sourceNote && <p className="text-sm text-slate-400">{sourceNote}</p>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <p className="text-slate-400">Tracked drafts</p>
          <h2 className="mt-1 text-4xl font-bold">{posts.length}</h2>
        </Card>
        <Card>
          <p className="text-slate-400">Avg virality score</p>
          <h2 className="mt-1 text-4xl font-bold text-indigo-300">
            {avgVirality ?? '—'}
          </h2>
        </Card>
        <Card>
          <p className="text-slate-400">From API</p>
          <h2 className="mt-1 text-4xl font-bold">
            {posts.filter((p) => p.source === 'api').length}
          </h2>
        </Card>
        <Card>
          <p className="text-slate-400">Local only</p>
          <h2 className="mt-1 text-4xl font-bold">
            {posts.filter((p) => p.source === 'local').length}
          </h2>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">Recent drafts</h2>
        {posts.length === 0 ? (
          <p className="text-slate-400">
            No drafts yet. Use Overview brainstorm or Content Studio — successful API
            generates are written to Postgres; all generates also stash a copy in
            localStorage for this view.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {posts.slice(0, 20).map((p, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.title ?? 'Untitled'}</p>
                  <p className="text-xs text-slate-500">
                    {p.status ?? 'Draft'}
                    {p.source ? ` · ${p.source}` : ''}
                  </p>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <p className="text-indigo-300">
                    {p.viralityScore != null ? `${p.viralityScore} viral` : '—'}
                  </p>
                  <p className="text-slate-500">
                    {p.impressions != null
                      ? `${p.impressions.toLocaleString()} imp`
                      : 'draft'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
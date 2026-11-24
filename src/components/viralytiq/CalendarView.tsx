import * as React from 'react';
import { ArrowUpRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { LinkedInPost, PostStatus } from '../../types/viralytiq';

interface CalendarViewProps {
  posts: LinkedInPost[];
  onUpdatePost: (post: LinkedInPost) => void;
  onOpenInStrategist: (post: LinkedInPost) => void;
}

const STATUSES: Array<'All' | PostStatus> = [
  'All',
  'Scheduled',
  'Reviewed',
  'Draft',
  'Published',
];

const NEXT_STATUS: Record<PostStatus, PostStatus> = {
  Draft: 'Reviewed',
  Reviewed: 'Scheduled',
  Scheduled: 'Published',
  Published: 'Published',
};

export function CalendarView({
  posts,
  onUpdatePost,
  onOpenInStrategist,
}: CalendarViewProps) {
  const [statusFilter, setStatusFilter] = React.useState<'All' | PostStatus>('All');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const visiblePosts = React.useMemo(() => {
    return [...posts]
      .filter((p) => statusFilter === 'All' || p.status === statusFilter)
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
  }, [posts, statusFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-white/[0.06] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Publishing Pipeline & Schedule</CardTitle>
            <CardDescription>
              Manage weekly LinkedIn cadence, adjust send times, and promote drafts to scheduled
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-white/[0.04] p-1 border border-white/[0.07]">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === s
                    ? 'bg-indigo-500/25 text-indigo-100 border border-indigo-400/35'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="divide-y divide-white/[0.06] p-0">
          {visiblePosts.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <CalendarIcon className="h-7 w-7 text-slate-500 mx-auto" />
              <p className="text-sm font-medium text-slate-200">No posts in this stage</p>
              <p className="text-xs text-slate-400">
                Switch filter tabs or generate a new draft in Post Strategist.
              </p>
            </div>
          ) : (
            visiblePosts.map((post) => {
              const isEditing = editingId === post.id;
              return (
                <div
                  key={post.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-indigo-300 tabular-nums shrink-0">
                        {post.scheduledFor}
                      </span>
                      <span className="text-xs text-slate-500 inline-flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" /> {post.scheduledTime}
                      </span>
                      <span
                        className={`text-xs font-medium shrink-0 ${
                          post.status === 'Published'
                            ? 'text-emerald-300'
                            : post.status === 'Scheduled'
                            ? 'text-sky-300'
                            : post.status === 'Reviewed'
                            ? 'text-indigo-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-white truncate">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {post.pillar} · {post.format} · Virality {post.viralityScore}/100
                    </p>

                    {isEditing && (
                      <div className="mt-3 flex flex-wrap items-center gap-3 pt-2">
                        <Input
                          type="date"
                          value={post.scheduledFor}
                          onChange={(e) =>
                            onUpdatePost({ ...post, scheduledFor: e.target.value })
                          }
                          className="w-40"
                        />
                        <Input
                          type="text"
                          value={post.scheduledTime}
                          onChange={(e) =>
                            onUpdatePost({ ...post, scheduledTime: e.target.value })
                          }
                          className="w-32"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="glass"
                          onClick={() => setEditingId(null)}
                        >
                          Done
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(isEditing ? null : post.id)}
                    >
                      Reschedule
                    </Button>
                    {post.status !== 'Published' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onUpdatePost({ ...post, status: NEXT_STATUS[post.status] })
                        }
                      >
                        Mark {NEXT_STATUS[post.status]}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      onClick={() => onOpenInStrategist(post)}
                    >
                      Edit <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import * as React from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  MessageSquare,
  Sparkles,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { AnalyticsPoint, CreatorProfile, LinkedInPost } from '../../types/viralytiq';

interface OverviewViewProps {
  creator: CreatorProfile;
  analytics: AnalyticsPoint[];
  posts: LinkedInPost[];
  onOpenPostInStrategist: (post: LinkedInPost) => void;
  onStartNewDraft: () => void;
}

type RangeKey = '7D' | '30D' | '90D';
type MetricKey = 'impressions' | 'engagements' | 'profileVisits';

export function OverviewView({
  creator,
  analytics,
  posts,
  onOpenPostInStrategist,
  onStartNewDraft,
}: OverviewViewProps) {
  const [range, setRange] = React.useState<RangeKey>('30D');
  const [metric, setMetric] = React.useState<MetricKey>('impressions');
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  const visibleSeries = React.useMemo(() => {
    const multiplier = range === '7D' ? 0.34 : range === '90D' ? 2.65 : 1;
    const base = range === '7D' ? analytics.slice(-6) : analytics;
    return base.map((pt) => ({
      ...pt,
      impressions: Math.round(pt.impressions * multiplier),
      engagements: Math.round(pt.engagements * multiplier),
      profileVisits: Math.round(pt.profileVisits * multiplier),
    }));
  }, [analytics, range]);

  const totalImpressions = visibleSeries.reduce((acc, p) => acc + p.impressions, 0);
  const totalEngagements = visibleSeries.reduce((acc, p) => acc + p.engagements, 0);
  const totalProfileVisits = visibleSeries.reduce((acc, p) => acc + p.profileVisits, 0);
  const avgEngagementRate =
    totalImpressions > 0 ? ((totalEngagements / totalImpressions) * 100).toFixed(2) : '0.00';

  const kpis = [
    {
      label: `Impressions (${range})`,
      value: totalImpressions.toLocaleString(),
      delta: '+28.4% vs prior period',
      icon: Eye,
      spark: [24, 32, 29, 44, 51, 48, 66, 74],
    },
    {
      label: 'Avg. Engagement Rate',
      value: `${avgEngagementRate}%`,
      delta: '+0.64 pts vs benchmark',
      icon: MessageSquare,
      spark: [38, 41, 40, 49, 53, 55, 61, 68],
    },
    {
      label: `Profile Visits (${range})`,
      value: totalProfileVisits.toLocaleString(),
      delta: '+34.1% inbound intent',
      icon: TrendingUp,
      spark: [18, 22, 26, 31, 40, 44, 57, 64],
    },
    {
      label: 'Total Audience',
      value: creator.followers.toLocaleString(),
      delta: '+1,420 net followers (30d)',
      icon: UserPlus,
      spark: [40, 44, 48, 52, 58, 63, 69, 76],
    },
  ];

  // SVG Area Chart math
  const chartW = 760;
  const chartH = 240;
  const padX = 16;
  const padY = 20;
  const values = visibleSeries.map((d) => d[metric]);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const span = Math.max(maxVal - minVal, 1);

  const coords = visibleSeries.map((pt, idx) => {
    const x =
      visibleSeries.length === 1
        ? chartW / 2
        : padX + (idx / (visibleSeries.length - 1)) * (chartW - padX * 2);
    const norm = (pt[metric] - minVal) / span;
    const y = chartH - padY - norm * (chartH - padY * 2);
    return { x, y, pt };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${chartH} L ${coords[0].x.toFixed(1)} ${chartH} Z`
      : '';

  const activePoint = hoverIdx !== null ? coords[hoverIdx] : coords[coords.length - 1];

  const publishedPosts = posts.filter((p) => p.status === 'Published');
  const queuePosts = posts.filter((p) => p.status !== 'Published');

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const maxS = Math.max(...kpi.spark);
          const minS = Math.min(...kpi.spark);
          const sparkPath = kpi.spark
            .map((v, i) => {
              const sx = (i / (kpi.spark.length - 1)) * 72;
              const sy = 24 - ((v - minS) / Math.max(maxS - minS, 1)) * 20;
              return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
            })
            .join(' ');

          return (
            <Card key={kpi.label} className="hover:border-white/[0.14]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-400">{kpi.label}</p>
                    <p className="font-display text-2xl font-bold tracking-tight text-white tabular-nums">
                      {kpi.value}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/12 border border-indigo-400/20 text-indigo-300">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <span className="text-xs font-medium text-sky-300/90 tabular-nums">
                    {kpi.delta}
                  </span>
                  <svg width="72" height="26" viewBox="0 0 72 26" className="shrink-0 overflow-visible">
                    <path
                      d={sparkPath}
                      fill="none"
                      stroke="url(#sparkGrad)"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics + Action Split */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-stretch">
        <Card className="xl:col-span-8 flex flex-col">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-4">
            <div>
              <CardTitle>Reach & Engagement Velocity</CardTitle>
              <CardDescription>
                Interactive creator performance curve across {creator.handle}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-1 border border-white/[0.07]">
                {(['impressions', 'engagements', 'profileVisits'] as MetricKey[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetric(m)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      metric === m
                        ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-400/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m === 'impressions'
                      ? 'Impressions'
                      : m === 'engagements'
                      ? 'Engagements'
                      : 'Profile Visits'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-1 border border-white/[0.07]">
                {(['7D', '30D', '90D'] as RangeKey[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      range === r
                        ? 'bg-white/[0.12] text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-5 flex flex-col justify-between">
            {activePoint && (
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xl font-semibold text-white tabular-nums">
                    {activePoint.pt[metric].toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activePoint.pt.date} · {activePoint.pt.impressions.toLocaleString()} impressions ·{' '}
                    {activePoint.pt.engagements.toLocaleString()} engagements
                  </span>
                </div>
                <span className="text-xs text-slate-500">Hover chart points to inspect</span>
              </div>
            )}

            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full h-56 overflow-visible select-none"
                onMouseLeave={() => setHoverIdx(null)}
              >
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.42" />
                    <stop offset="65%" stopColor="#8B5CF6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#05070E" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="strokeLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="55%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75].map((ratio) => {
                  const gy = padY + ratio * (chartH - padY * 2);
                  return (
                    <line
                      key={ratio}
                      x1={padX}
                      y1={gy}
                      x2={chartW - padX}
                      y2={gy}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                <path d={areaPath} fill="url(#areaFill)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#strokeLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {coords.map((c, idx) => {
                  const isActive = hoverIdx === idx;
                  return (
                    <g key={c.pt.date}>
                      {isActive && (
                        <line
                          x1={c.x}
                          y1={padY}
                          x2={c.x}
                          y2={chartH - 12}
                          stroke="rgba(129, 140, 248, 0.45)"
                          strokeWidth="1"
                        />
                      )}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={isActive ? 5.5 : 3.5}
                        fill={isActive ? '#38BDF8' : '#818CF8'}
                        stroke="#070A14"
                        strokeWidth="2"
                      />
                      <rect
                        x={c.x - 28}
                        y={0}
                        width={56}
                        height={chartH}
                        fill="transparent"
                        className="cursor-crosshair"
                        onMouseEnter={() => setHoverIdx(idx)}
                      />
                    </g>
                  );
                })}
              </svg>
              <div className="mt-1 flex items-center justify-between px-2 text-[11px] font-mono text-slate-500">
                {visibleSeries.map((pt, i) => (
                  <span key={pt.date} className={i % 2 === 1 && visibleSeries.length > 7 ? 'hidden sm:inline' : ''}>
                    {pt.date}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Strategic Queue Card */}
        <Card className="xl:col-span-4 flex flex-col justify-between">
          <CardHeader className="border-b border-white/[0.06] pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Upcoming Queue</CardTitle>
              <BarChart3 className="h-4 w-4 text-indigo-400" />
            </div>
            <CardDescription>
              {queuePosts.length} posts staged · Target {creator.weeklyTargetPosts}/week
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 divide-y divide-white/[0.06] pt-2">
            {queuePosts.slice(0, 4).map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onOpenPostInStrategist(post)}
                className="w-full py-3.5 text-left group flex items-start justify-between gap-3 hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {post.pillar} · {post.status} · {post.scheduledFor}
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-indigo-300 tabular-nums shrink-0">
                  {post.viralityScore}/100
                </span>
              </button>
            ))}
          </CardContent>
          <div className="p-5 pt-2">
            <Button onClick={onStartNewDraft} className="w-full">
              <Sparkles className="h-4 w-4" />
              Draft Next Viral Post
            </Button>
          </div>
        </Card>
      </div>

      {/* Content Performance Table */}
      <Card>
        <CardHeader className="border-b border-white/[0.06] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Published & Staged Content Ledger</CardTitle>
            <CardDescription>
              Click any post to remix its hook or inspect retrieved pgvector voice sources
            </CardDescription>
          </div>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {publishedPosts.length} published · {posts.length} total
          </span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[12px] font-medium text-slate-400">
                <th className="py-3 pl-5 pr-4">Post Title & Pillar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Impressions</th>
                <th className="py-3 px-4 text-right">Eng. Rate</th>
                <th className="py-3 px-4 text-right">Hook Score</th>
                <th className="py-3 pl-4 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sm">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  onClick={() => onOpenPostInStrategist(post)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="py-3 pl-5 pr-4 max-w-md">
                    <p className="font-medium text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {post.pillar} · {post.format} · {post.scheduledFor}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium whitespace-nowrap">
                    <span
                      className={
                        post.status === 'Published'
                          ? 'text-emerald-300'
                          : post.status === 'Scheduled'
                          ? 'text-sky-300'
                          : post.status === 'Reviewed'
                          ? 'text-indigo-300'
                          : 'text-slate-400'
                      }
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-slate-200 tabular-nums">
                    {post.impressions > 0 ? post.impressions.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-slate-200 tabular-nums">
                    {post.engagementRate > 0 ? `${post.engagementRate.toFixed(2)}%` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-indigo-300 tabular-nums">
                    {post.viralityScore}
                  </td>
                  <td className="py-3 pl-4 pr-5 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 group-hover:text-white whitespace-nowrap">
                      Open <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

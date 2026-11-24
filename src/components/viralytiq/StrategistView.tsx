import * as React from 'react';
import {
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Database,
  Globe,
  Loader2,
  Monitor,
  Send,
  Smartphone,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  Repeat2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { runStrategistPipeline } from '../../lib/viralytiq-engine';
import type {
  ContentPillar,
  CreatorProfile,
  LangGraphNodeTrace,
  LinkedInPost,
  PostFormat,
  StrategyGenerationRequest,
  VoiceMemoryDoc,
} from '../../types/viralytiq';

interface StrategistViewProps {
  creator: CreatorProfile;
  voiceDocs: VoiceMemoryDoc[];
  activeDraft: LinkedInPost;
  traces: LangGraphNodeTrace[];
  onSaveDraft: (post: LinkedInPost, traces: LangGraphNodeTrace[]) => void;
  onScheduleDraft: (post: LinkedInPost) => void;
}

const PILLARS: ContentPillar[] = [
  'Founder Lessons',
  'Technical Deep-Dive',
  'Contrarian Take',
  'Product Breakdown',
];

const FORMATS: PostFormat[] = ['Text + Hook', 'Carousel Outline', 'Case Study'];

const TONES: StrategyGenerationRequest['tone'][] = [
  'Direct & Analytical',
  'Story-Driven',
  'Contrarian Sharp',
  'Educational',
];

export function StrategistView({
  creator,
  voiceDocs,
  activeDraft,
  traces,
  onSaveDraft,
  onScheduleDraft,
}: StrategistViewProps) {
  const [topic, setTopic] = React.useState(activeDraft.title);
  const [pillar, setPillar] = React.useState<ContentPillar>(activeDraft.pillar);
  const [format, setFormat] = React.useState<PostFormat>(activeDraft.format);
  const [tone, setTone] = React.useState<StrategyGenerationRequest['tone']>('Direct & Analytical');
  const [targetAudience, setTargetAudience] = React.useState(creator.audienceIcp);
  const [useVoiceRag, setUseVoiceRag] = React.useState(true);

  const [draft, setDraft] = React.useState<LinkedInPost>(activeDraft);
  const [nodeTraces, setNodeTraces] = React.useState<LangGraphNodeTrace[]>(traces);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [activeStepIdx, setActiveStepIdx] = React.useState<number | null>(null);
  const [expandedNode, setExpandedNode] = React.useState<string | null>('node-rag');
  const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = React.useState(false);
  const [savedNotice, setSavedNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDraft(activeDraft);
    setTopic(activeDraft.title);
    setPillar(activeDraft.pillar);
    setFormat(activeDraft.format);
  }, [activeDraft]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;
    setIsGenerating(true);
    setSavedNotice(null);

    // Animate LangGraph node execution sequence
    const skeleton: LangGraphNodeTrace[] = nodeTraces.map((n) => ({ ...n, status: 'idle' }));
    setNodeTraces(skeleton);

    for (let i = 0; i < 4; i++) {
      setActiveStepIdx(i);
      setNodeTraces((prev) =>
        prev.map((n, idx) => ({
          ...n,
          status: idx < i ? 'completed' : idx === i ? 'running' : 'idle',
        }))
      );
      await new Promise((r) => setTimeout(r, 180));
    }

    const result = await runStrategistPipeline(
      { topic, pillar, format, tone, targetAudience, useVoiceRag },
      voiceDocs
    );

    const newPost: LinkedInPost = {
      ...result.post,
      id: `post-${Date.now()}`,
      impressions: 0,
      reactions: 0,
      comments: 0,
      reposts: 0,
      engagementRate: 0,
    };

    setDraft(newPost);
    setNodeTraces(result.traces);
    setActiveStepIdx(null);
    setIsGenerating(false);
    onSaveDraft(newPost, result.traces);
    setSavedNotice('Generated via LangGraph + Groq');
  };

  const fullPostText = `${draft.hook}\n\n${draft.body}\n\n${draft.cta}`;
  const foldLimit = previewDevice === 'mobile' ? 140 : 210;
  const hookFitsFold = draft.hook.length <= foldLimit;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullPostText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleSaveChanges = () => {
    onSaveDraft(draft, nodeTraces);
    setSavedNotice('Draft saved to workspace');
    setTimeout(() => setSavedNotice(null), 2200);
  };

  const handleSchedule = () => {
    const scheduled: LinkedInPost = { ...draft, status: 'Scheduled' };
    setDraft(scheduled);
    onScheduleDraft(scheduled);
    setSavedNotice(`Scheduled for ${scheduled.scheduledFor}`);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
      {/* Left: LangGraph Configurator & Execution Trace */}
      <div className="xl:col-span-6 space-y-5">
        <Card>
          <CardHeader className="border-b border-white/[0.06] pb-4">
            <CardTitle>AI Content Strategist Brief</CardTitle>
            <CardDescription>
              Configure topic, ICP, and pgvector voice retrieval for the 4-node LangGraph workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="topic-input" className="text-xs font-medium text-slate-300">
                  Core Idea, Product Insight, or Angle
                </label>
                <Input
                  id="topic-input"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Why pgvector HNSW + Groq cut our AI strategist P95 latency to 180ms"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-300">Content Pillar</span>
                <div className="grid grid-cols-2 gap-2">
                  {PILLARS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPillar(p)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border cursor-pointer whitespace-nowrap truncate ${
                        pillar === p
                          ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-100'
                          : 'bg-white/[0.02] border-white/[0.07] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="format-select" className="text-xs font-medium text-slate-300">
                    Post Format
                  </label>
                  <select
                    id="format-select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as PostFormat)}
                    className="h-9 w-full rounded-lg border border-white/[0.1] bg-[#0B1020] px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                  >
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tone-select" className="text-xs font-medium text-slate-300">
                    Tone Calibration
                  </label>
                  <select
                    id="tone-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as StrategyGenerationRequest['tone'])}
                    className="h-9 w-full rounded-lg border border-white/[0.1] bg-[#0B1020] px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="icp-input" className="text-xs font-medium text-slate-300">
                  Target LinkedIn Audience (ICP)
                </label>
                <Input
                  id="icp-input"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="inline-flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useVoiceRag}
                    onChange={(e) => setUseVoiceRag(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-indigo-500"
                  />
                  <span>
                    Ground with pgvector Voice RAG ({voiceDocs.filter((d) => d.active).length} active docs)
                  </span>
                </label>

                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running LangGraph ({(activeStepIdx ?? 0) + 1}/4)...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* LangGraph Multi-Agent Execution Trace */}
        <Card>
          <CardHeader className="border-b border-white/[0.06] pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>LangGraph Agent Execution</CardTitle>
              <CardDescription>
                Groq inference + pgvector cosine retrieval traced with Langfuse
              </CardDescription>
            </div>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              {nodeTraces.reduce((acc, n) => acc + n.durationMs, 0)} ms total
            </span>
          </CardHeader>
          <CardContent className="divide-y divide-white/[0.06] pt-1">
            {nodeTraces.map((node) => {
              const isOpen = expandedNode === node.id;
              return (
                <div key={node.id} className="py-3">
                  <button
                    type="button"
                    onClick={() => setExpandedNode(isOpen ? null : node.id)}
                    className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {node.label}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {node.model} · {node.durationMs}ms · {node.tokensIn + node.tokensOut} tokens
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-medium ${
                          node.status === 'running'
                            ? 'text-sky-300'
                            : node.status === 'completed'
                            ? 'text-emerald-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {node.status === 'running'
                          ? 'Running'
                          : node.status === 'completed'
                          ? 'Done'
                          : 'Pending'}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-2.5 pl-3 border-l border-indigo-500/30 space-y-2 text-xs text-slate-300">
                      <p className="leading-relaxed">{node.summary}</p>
                      {node.retrievedChunks && node.retrievedChunks.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {node.retrievedChunks.map((chunk, i) => (
                            <div
                              key={i}
                              className="rounded-lg bg-white/[0.03] border border-white/[0.07] p-2.5"
                            >
                              <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-indigo-300">
                                <span className="inline-flex items-center gap-1.5 truncate">
                                  <Database className="h-3 w-3 shrink-0" />
                                  {chunk.docTitle}
                                </span>
                                <span className="font-mono tabular-nums shrink-0">
                                  sim {chunk.similarity.toFixed(2)}
                                </span>
                              </div>
                              <p className="mt-1 text-slate-400 leading-relaxed">{chunk.excerpt}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Right: Editable Draft & Live LinkedIn Preview */}
      <div className="xl:col-span-6 space-y-5">
        <Card>
          <CardHeader className="border-b border-white/[0.06] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Live LinkedIn Feed Preview</CardTitle>
              <CardDescription>
                Virality score {draft.viralityScore}/100 ·{' '}
                {hookFitsFold
                  ? `Fits ${previewDevice} fold (${draft.hook.length}/${foldLimit} chars)`
                  : `Truncates before fold (${draft.hook.length}/${foldLimit} chars)`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-1 border border-white/[0.07]">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-white/[0.12] text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-white/[0.12] text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            {/* Hook Variant Switcher */}
            {draft.hookVariants.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400">
                  Alternative Hook Candidates (click to swap)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {draft.hookVariants.map((variant, idx) => {
                    const selected = draft.hook === variant;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDraft({ ...draft, hook: variant })}
                        className={`text-left px-3 py-2 rounded-lg text-xs leading-relaxed border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-indigo-500/15 border-indigo-400/45 text-indigo-100'
                            : 'bg-white/[0.02] border-white/[0.07] text-slate-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        {variant.replace('\n', ' / ')}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LinkedIn Mock Post Surface */}
            <div
              className={`mx-auto rounded-xl border border-white/[0.1] bg-[#0B1122]/90 p-5 transition-all ${
                previewDevice === 'mobile' ? 'max-w-[375px]' : 'w-full'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-full object-cover border border-white/15 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{creator.name}</p>
                  <p className="text-xs text-slate-400 truncate">{creator.headline}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <span>Just now</span>
                    <span aria-hidden="true">·</span>
                    <Globe className="h-3 w-3" />
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-100 whitespace-pre-line leading-relaxed">
                <p className="font-semibold text-white">{draft.hook}</p>
                <div className="border-t border-dashed border-indigo-400/30 pt-2 text-[11px] font-mono text-indigo-300/80">
                  ...see more (LinkedIn {previewDevice} fold indicator)
                </div>
                <p className="text-slate-200">{draft.body}</p>
                <p className="font-medium text-indigo-200">{draft.cta}</p>
              </div>

              {draft.coverImageUrl && (
                <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.08]">
                  <img
                    src={draft.coverImageUrl}
                    alt="LinkedIn carousel visual preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover"
                  />
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <ThumbsUp className="h-3.5 w-3.5" /> Like
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" /> Comment
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Repeat2 className="h-3.5 w-3.5" /> Repost
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Send
                </span>
              </div>
            </div>

            {/* Direct Inline Draft Editor */}
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              <div className="space-y-1.5">
                <label htmlFor="edit-hook" className="text-xs font-medium text-slate-400">
                  Edit Hook
                </label>
                <Textarea
                  id="edit-hook"
                  rows={2}
                  className="min-h-[60px]"
                  value={draft.hook}
                  onChange={(e) => setDraft({ ...draft, hook: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="edit-body" className="text-xs font-medium text-slate-400">
                  Edit Body Narrative
                </label>
                <Textarea
                  id="edit-body"
                  rows={6}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="edit-cta" className="text-xs font-medium text-slate-400">
                  Edit Closing CTA
                </label>
                <Input
                  id="edit-cta"
                  value={draft.cta}
                  onChange={(e) => setDraft({ ...draft, cta: e.target.value })}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-sky-300 font-medium">
                  {savedNotice ?? `${fullPostText.length} characters · ${draft.status}`}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="glass" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy Post'}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleSaveChanges}>
                    Save Draft
                  </Button>
                  <Button type="button" size="sm" onClick={handleSchedule}>
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Schedule Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

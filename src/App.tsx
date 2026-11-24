import * as React from 'react';
import {
  Calendar,
  Command,
  Cpu,
  Database,
  Flame,
  LayoutDashboard,
  Menu,
  PenTool,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Dialog, DialogContent } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { OverviewView } from './components/viralytiq/OverviewView';
import { StrategistView } from './components/viralytiq/StrategistView';
import { RagMemoryView } from './components/viralytiq/RagMemoryView';
import { CalendarView } from './components/viralytiq/CalendarView';
import { HookLabView } from './components/viralytiq/HookLabView';
import { ArchitectureView } from './components/viralytiq/ArchitectureView';
import {
  CREATOR_PROFILES,
  INITIAL_ANALYTICS_30D,
  INITIAL_POSTS,
  INITIAL_TRACES,
  INITIAL_VOICE_DOCS,
} from './lib/viralytiq-engine';
import type {
  LangGraphNodeTrace,
  LinkedInPost,
  NavSection,
  VoiceMemoryDoc,
} from './types/viralytiq';

const NAV_ITEMS: Array<{
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'strategist', label: 'Post Strategist', icon: PenTool },
  { id: 'rag-memory', label: 'Voice RAG Memory', icon: Database },
  { id: 'calendar', label: 'Content Calendar', icon: Calendar },
  { id: 'hook-lab', label: 'Hook Lab', icon: Flame },
  { id: 'architecture', label: 'Stack & Traces', icon: Cpu },
];

const SECTION_TITLES: Record<NavSection, string> = {
  overview: 'Creator Analytics',
  strategist: 'AI Post Strategist',
  'rag-memory': 'Voice RAG Memory',
  calendar: 'Content Calendar',
  'hook-lab': 'Hook Lab',
  architecture: 'Stack & Agent Traces',
};

export default function App() {
  const [section, setSection] = React.useState<NavSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [creatorIdx, setCreatorIdx] = React.useState(0);
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [quickTopic, setQuickTopic] = React.useState('');

  const [posts, setPosts] = React.useState<LinkedInPost[]>(() => {
    try {
      const saved = localStorage.getItem('viralytiq_posts_v1');
      return saved ? (JSON.parse(saved) as LinkedInPost[]) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [voiceDocs, setVoiceDocs] = React.useState<VoiceMemoryDoc[]>(() => {
    try {
      const saved = localStorage.getItem('viralytiq_docs_v1');
      return saved ? (JSON.parse(saved) as VoiceMemoryDoc[]) : INITIAL_VOICE_DOCS;
    } catch {
      return INITIAL_VOICE_DOCS;
    }
  });

  const [traces, setTraces] = React.useState<LangGraphNodeTrace[]>(INITIAL_TRACES);
  const [activeDraft, setActiveDraft] = React.useState<LinkedInPost>(posts[0] ?? INITIAL_POSTS[0]);

  React.useEffect(() => {
    try {
      localStorage.setItem('viralytiq_posts_v1', JSON.stringify(posts));
    } catch {
      // Ignore storage quota errors
    }
  }, [posts]);

  React.useEffect(() => {
    try {
      localStorage.setItem('viralytiq_docs_v1', JSON.stringify(voiceDocs));
    } catch {
      // Ignore storage quota errors
    }
  }, [voiceDocs]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const creator = CREATOR_PROFILES[creatorIdx];

  const handleOpenPostInStrategist = (post: LinkedInPost) => {
    setActiveDraft(post);
    setSection('strategist');
    setMobileMenuOpen(false);
  };

  const handleStartNewDraft = (seedTitle = '') => {
    const freshDraft: LinkedInPost = {
      id: `post-draft-${Date.now()}`,
      title: seedTitle || 'Scaling Multi-Agent AI Workflows with FastAPI & Groq',
      pillar: 'Technical Deep-Dive',
      format: 'Text + Hook',
      status: 'Draft',
      hook: 'Most AI features feel slow because of orchestration, not model weights.',
      body: 'Enter a topic on the left and run the 4-node LangGraph strategist to synthesize a voice-grounded LinkedIn draft.',
      cta: 'What bottleneck surprised you most when shipping AI to production?',
      hookVariants: [
        'Most AI features feel slow because of orchestration, not model weights.',
      ],
      scheduledFor: '2026-11-30',
      scheduledTime: '08:30 EST',
      impressions: 0,
      reactions: 0,
      comments: 0,
      reposts: 0,
      engagementRate: 0,
      viralityScore: 86,
      ragSourcesUsed: [],
    };
    setActiveDraft(freshDraft);
    setSection('strategist');
    setMobileMenuOpen(false);
  };

  const handleSaveDraft = (post: LinkedInPost, nextTraces: LangGraphNodeTrace[]) => {
    setTraces(nextTraces);
    setActiveDraft(post);
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === post.id);
      return exists ? prev.map((p) => (p.id === post.id ? post : p)) : [post, ...prev];
    });
  };

  const handleUpdatePost = (updated: LinkedInPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      return exists ? prev.map((p) => (p.id === updated.id ? updated : p)) : [updated, ...prev];
    });
    if (activeDraft.id === updated.id) {
      setActiveDraft(updated);
    }
  };

  const handleSendHookToStrategist = (hookText: string) => {
    const updated: LinkedInPost = {
      ...activeDraft,
      id: `post-hook-${Date.now()}`,
      title: hookText.split('\n')[0].slice(0, 64),
      hook: hookText,
      hookVariants: [hookText, ...activeDraft.hookVariants.slice(0, 2)],
      status: 'Draft',
    };
    setActiveDraft(updated);
    setSection('strategist');
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTopic.trim()) return;
    handleStartNewDraft(quickTopic.trim());
    setQuickTopic('');
    setQuickOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-1">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setSection('overview');
              setMobileMenuOpen(false);
            }}
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Viralytiq
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Workspace Navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white border border-indigo-400/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-indigo-300' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Creator Workspace Switcher */}
      <div className="pt-4 border-t border-white/[0.07]">
        <button
          type="button"
          onClick={() => setCreatorIdx((prev) => (prev + 1) % CREATOR_PROFILES.length)}
          title="Switch creator profile"
          className="w-full flex items-center gap-3 rounded-xl p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] transition-colors text-left cursor-pointer"
        >
          <img
            src={creator.avatarUrl}
            alt={creator.name}
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full object-cover border border-white/15 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{creator.name}</p>
            <p className="text-[11px] text-slate-400 font-mono tabular-nums truncate">
              {creator.followers.toLocaleString()} followers
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#05070E] text-slate-100 overflow-x-hidden">
      {/* Ambient Obsidian & Purple-Blue Aurora Gradient Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="aurora-ambient absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-indigo-600/18 blur-[140px]" />
        <div className="aurora-ambient absolute top-1/3 -right-24 h-[460px] w-[460px] rounded-full bg-violet-600/14 blur-[150px]" />
        <div className="absolute -bottom-32 left-12 h-[380px] w-[480px] rounded-full bg-sky-500/10 blur-[140px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Desktop Glass Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 glass-sidebar sticky top-0 h-screen">
          {sidebarContent}
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-10 w-64 glass-sidebar h-full">
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main Viewport */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* 3-Zone Glass Top Header */}
          <header className="glass-topbar sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation"
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-200 cursor-pointer"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-sm truncate">
                <span className="text-slate-400 hidden sm:inline">Viralytiq</span>
                <span className="text-slate-600 hidden sm:inline" aria-hidden="true">/</span>
                <h1 className="font-display font-semibold text-white whitespace-nowrap truncate">
                  {SECTION_TITLES[section]}
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setQuickOpen(true)}
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/[0.07] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Command className="h-3.5 w-3.5 text-indigo-300" />
                <span>Quick Strategy</span>
                <span className="font-mono text-[11px] text-slate-500">⌘K</span>
              </button>
            </div>

            <div className="flex items-center shrink-0">
              <Button
                type="button"
                size="sm"
                onClick={() => handleStartNewDraft()}
              >
                <Plus className="h-4 w-4" />
                New Draft
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] w-full mx-auto pb-24">
            {section === 'overview' && (
              <OverviewView
                creator={creator}
                analytics={INITIAL_ANALYTICS_30D}
                posts={posts}
                onOpenPostInStrategist={handleOpenPostInStrategist}
                onStartNewDraft={() => handleStartNewDraft()}
              />
            )}

            {section === 'strategist' && (
              <StrategistView
                creator={creator}
                voiceDocs={voiceDocs}
                activeDraft={activeDraft}
                traces={traces}
                onSaveDraft={handleSaveDraft}
                onScheduleDraft={handleUpdatePost}
              />
            )}

            {section === 'rag-memory' && (
              <RagMemoryView
                docs={voiceDocs}
                onAddDoc={(doc) => setVoiceDocs((prev) => [doc, ...prev])}
                onToggleDoc={(id) =>
                  setVoiceDocs((prev) =>
                    prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
                  )
                }
                onDeleteDoc={(id) =>
                  setVoiceDocs((prev) => prev.filter((d) => d.id !== id))
                }
              />
            )}

            {section === 'calendar' && (
              <CalendarView
                posts={posts}
                onUpdatePost={handleUpdatePost}
                onOpenInStrategist={handleOpenPostInStrategist}
              />
            )}

            {section === 'hook-lab' && (
              <HookLabView onSendHookToStrategist={handleSendHookToStrategist} />
            )}

            {section === 'architecture' && <ArchitectureView traces={traces} />}
          </main>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setQuickOpen(true)}
        aria-label="Open Quick AI Strategy Prompt"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-500 to-violet-500 px-4 py-3 text-sm font-medium text-white shadow-[0_14px_34px_-8px_rgba(99,102,241,0.75)] border border-indigo-300/30 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Quick Idea</span>
      </button>

      {/* Raycast-style Quick Strategy Modal */}
      <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
        <DialogContent onClose={() => setQuickOpen(false)}>
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Capture Idea into Post Strategist
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Seed a LinkedIn topic and jump straight into the 4-node LangGraph studio
              </p>
            </div>
            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <Input
                autoFocus
                value={quickTopic}
                onChange={(e) => setQuickTopic(e.target.value)}
                placeholder="e.g., Why sub-200ms RAG latency doubled our B2B user retention..."
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Press Esc to dismiss</span>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" onClick={() => setQuickOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Open in Strategist</Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

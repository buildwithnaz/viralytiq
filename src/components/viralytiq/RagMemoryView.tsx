import * as React from 'react';
import { Database, Plus, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent } from '../ui/dialog';
import { scoreVoiceSimilarity } from '../../lib/viralytiq-engine';
import type { VoiceMemoryDoc } from '../../types/viralytiq';

interface RagMemoryViewProps {
  docs: VoiceMemoryDoc[];
  onAddDoc: (doc: VoiceMemoryDoc) => void;
  onToggleDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

const CATEGORIES: Array<'All' | VoiceMemoryDoc['category']> = [
  'All',
  'Past Viral Post',
  'Voice Guideline',
  'ICP Research',
  'Case Proof',
];

export function RagMemoryView({
  docs,
  onAddDoc,
  onToggleDoc,
  onDeleteDoc,
}: RagMemoryViewProps) {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<'All' | VoiceMemoryDoc['category']>('All');
  const [modalOpen, setModalOpen] = React.useState(false);

  const [newTitle, setNewTitle] = React.useState('');
  const [newCategory, setNewCategory] =
    React.useState<VoiceMemoryDoc['category']>('Past Viral Post');
  const [newContent, setNewContent] = React.useState('');

  const filteredDocs = React.useMemo(() => {
    return docs
      .filter((d) => category === 'All' || d.category === category)
      .map((d) => ({
        doc: d,
        similarity: query.trim() ? scoreVoiceSimilarity(query, d) : null,
      }))
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
  }, [docs, category, query]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const approxTokens = Math.max(45, Math.round(newContent.trim().split(/\s+/).length * 1.35));
    onAddDoc({
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      tokenCount: approxTokens,
      embeddingModel: 'text-embedding-3-small',
      dimensions: 1536,
      avgEngagementLift: 'Newly indexed',
      active: true,
      createdAt: '2026-11-22',
    });
    setNewTitle('');
    setNewContent('');
    setModalOpen(false);
  };

  const activeCount = docs.filter((d) => d.active).length;
  const totalTokens = docs.reduce((acc, d) => acc + d.tokenCount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-400">Indexed Voice Documents</p>
            <p className="mt-1 font-display text-2xl font-bold text-white tabular-nums">
              {docs.length}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {activeCount} active in pgvector retrieval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-400">Total Embedded Tokens</p>
            <p className="mt-1 font-mono text-2xl font-bold text-white tabular-nums">
              {totalTokens.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              1536-dim cosine HNSW index
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400">Knowledge Ingestion</p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                Add viral posts, ICP notes, or tone rules
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Index Document
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Semantic Search & Filter Controls */}
      <Card>
        <CardHeader className="border-b border-white/[0.06] pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle>pgvector Voice Memory Bank</CardTitle>
            <CardDescription>
              Test semantic cosine similarity retrieval before running the LangGraph strategist
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Simulate vector search (e.g., latency, founder)..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <div className="px-5 py-3 border-b border-white/[0.06] flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-indigo-500/25 text-indigo-100 border border-indigo-400/35'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <CardContent className="divide-y divide-white/[0.06] p-0">
          {filteredDocs.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <Database className="h-8 w-8 text-slate-500 mx-auto" />
              <p className="text-sm font-medium text-slate-200">No matching voice documents</p>
              <p className="text-xs text-slate-400">
                Adjust your category filter or index a new LinkedIn writing sample.
              </p>
            </div>
          ) : (
            filteredDocs.map(({ doc, similarity }) => (
              <div
                key={doc.id}
                className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-sm font-semibold text-white">
                      {doc.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    {doc.category} · {doc.tokenCount} tokens · {doc.dimensions}d ·{' '}
                    {doc.avgEngagementLift} · Added {doc.createdAt}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed pt-1">{doc.content}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                  {similarity !== null && (
                    <span className="font-mono text-xs font-semibold text-sky-300 tabular-nums">
                      cosine sim {similarity.toFixed(2)}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleDoc(doc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                        doc.active
                          ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                          : 'bg-white/[0.03] border-white/[0.08] text-slate-400'
                      }`}
                    >
                      {doc.active ? 'Active in RAG' : 'Paused'}
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${doc.title}`}
                      onClick={() => onDeleteDoc(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Index Voice Memory Document
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Chunked into 1536-dim vectors and stored in PostgreSQL pgvector for creator grounding
              </p>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="doc-title" className="text-xs font-medium text-slate-300">
                  Document Title
                </label>
                <Input
                  id="doc-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Q4 Enterprise AI Case Study Post"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="doc-cat" className="text-xs font-medium text-slate-300">
                  Knowledge Category
                </label>
                <select
                  id="doc-cat"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as VoiceMemoryDoc['category'])}
                  className="h-9 w-full rounded-lg border border-white/[0.1] bg-[#0B1020] px-3 text-sm text-slate-100"
                >
                  <option value="Past Viral Post">Past Viral Post</option>
                  <option value="Voice Guideline">Voice Guideline</option>
                  <option value="ICP Research">ICP Research</option>
                  <option value="Case Proof">Case Proof</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="doc-content" className="text-xs font-medium text-slate-300">
                  Source Text / Writing Sample
                </label>
                <Textarea
                  id="doc-content"
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste a high-performing LinkedIn post, positioning memo, or tone rule..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Embed & Store</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

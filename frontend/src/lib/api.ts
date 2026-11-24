export interface StrategyRequest {
  topic: string;
  pillar?: 'Founder Lessons' | 'Technical Deep-Dive' | 'Contrarian Take' | 'Product Breakdown';
  format?: 'Text + Hook' | 'Carousel Outline' | 'Case Study';
  tone?: 'Direct & Analytical' | 'Story-Driven' | 'Contrarian Sharp' | 'Educational';
  targetAudience?: string;
  useVoiceRag?: boolean;
}

export interface BrainstormIdea {
  id: string;
  title: string;
  angle: string;
  hookPreview: string;
  whyItWorks: string;
}

const STORAGE_POSTS = 'viralytiq_local_posts_v1';
const STORAGE_TRACES = 'viralytiq_last_traces_v1';

export function saveLocalPost(post: Record<string, unknown>) {
  try {
    const prev = JSON.parse(localStorage.getItem(STORAGE_POSTS) || '[]');
    const list = Array.isArray(prev) ? prev : [];
    list.unshift({ ...post, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_POSTS, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

export function loadLocalPosts(): Array<Record<string, unknown>> {
  try {
    const prev = JSON.parse(localStorage.getItem(STORAGE_POSTS) || '[]');
    return Array.isArray(prev) ? prev : [];
  } catch {
    return [];
  }
}

export function saveLastTraces(traces: unknown[]) {
  try {
    localStorage.setItem(
      STORAGE_TRACES,
      JSON.stringify({ at: new Date().toISOString(), traces })
    );
  } catch {
    /* ignore */
  }
}

export function loadLastTraces(): {
  at?: string;
  traces: Array<Record<string, unknown>>;
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_TRACES);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      at: data.at,
      traces: Array.isArray(data.traces) ? data.traces : [],
    };
  } catch {
    return null;
  }
}

export async function brainstormIdeas(payload: {
  topic: string;
  audience?: string;
  count?: number;
}): Promise<{ topic: string; ideas: BrainstormIdea[] }> {
  const res = await fetch('/api/v1/strategist/brainstorm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: payload.topic,
      audience: payload.audience ?? 'Seed-Series B SaaS Founders & Staff Engineers',
      count: payload.count ?? 8,
    }),
  });
  if (!res.ok) {
    throw new Error(`Brainstorm failed: ${res.status}`);
  }
  return res.json();
}

export async function generateStrategy(payload: StrategyRequest) {
  const res = await fetch('/api/v1/strategist/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pillar: 'Technical Deep-Dive',
      format: 'Text + Hook',
      tone: 'Direct & Analytical',
      targetAudience: 'Seed-Series B SaaS Founders & Staff Engineers',
      useVoiceRag: true,
      ...payload,
    }),
  });
  if (!res.ok) {
    throw new Error(`FastAPI strategist error: ${res.status}`);
  }
  return res.json();
}

export async function fetchVoiceDocuments() {
  const res = await fetch('/api/v1/rag/documents', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch RAG documents: ${res.status}`);
  }
  return res.json();
}

export async function createVoiceDocument(payload: {
  title: string;
  category: string;
  content: string;
  sourceUrl?: string;
}) {
  const res = await fetch('/api/v1/rag/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create document: ${res.status}`);
  }
  return res.json();
}

export async function deleteVoiceDocument(id: string) {
  const res = await fetch(`/api/v1/rag/documents/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Failed to delete document: ${res.status}`);
  }
  return res.json();
}

export async function searchVoiceMemory(query: string) {
  const res = await fetch(
    `/api/v1/rag/search?q=${encodeURIComponent(query)}&top_k=3`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error(`Semantic search failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch('/api/v1/posts', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  return res.json();
}
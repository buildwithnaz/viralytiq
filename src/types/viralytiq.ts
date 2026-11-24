export type ContentPillar =
  | 'Founder Lessons'
  | 'Technical Deep-Dive'
  | 'Contrarian Take'
  | 'Product Breakdown';

export type PostFormat = 'Text + Hook' | 'Carousel Outline' | 'Case Study';

export type PostStatus = 'Draft' | 'Reviewed' | 'Scheduled' | 'Published';

export type NavSection =
  | 'overview'
  | 'strategist'
  | 'rag-memory'
  | 'calendar'
  | 'hook-lab'
  | 'architecture';

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  headline: string;
  avatarUrl: string;
  audienceIcp: string;
  followers: number;
  weeklyTargetPosts: number;
}

export interface AnalyticsPoint {
  date: string;
  impressions: number;
  engagements: number;
  profileVisits: number;
}

export interface LinkedInPost {
  id: string;
  title: string;
  pillar: ContentPillar;
  format: PostFormat;
  status: PostStatus;
  hook: string;
  body: string;
  cta: string;
  hookVariants: string[];
  scheduledFor: string; // ISO date YYYY-MM-DD
  scheduledTime: string; // e.g., "08:30 EST"
  impressions: number;
  reactions: number;
  comments: number;
  reposts: number;
  engagementRate: number;
  viralityScore: number;
  ragSourcesUsed: string[];
  coverImageUrl?: string;
}

export interface VoiceMemoryDoc {
  id: string;
  title: string;
  category: 'Past Viral Post' | 'Voice Guideline' | 'ICP Research' | 'Case Proof';
  content: string;
  tokenCount: number;
  embeddingModel: string;
  dimensions: number;
  avgEngagementLift: string;
  active: boolean;
  createdAt: string;
}

export interface LangGraphNodeTrace {
  id: string;
  nodeName: string;
  label: string;
  model: string;
  status: 'idle' | 'running' | 'completed';
  durationMs: number;
  tokensIn: number;
  tokensOut: number;
  summary: string;
  retrievedChunks?: Array<{ docTitle: string; similarity: number; excerpt: string }>;
}

export interface StrategyGenerationRequest {
  topic: string;
  pillar: ContentPillar;
  format: PostFormat;
  tone: 'Direct & Analytical' | 'Story-Driven' | 'Contrarian Sharp' | 'Educational';
  targetAudience: string;
  useVoiceRag: boolean;
}

export interface HookEvaluationResult {
  overallScore: number;
  scrollStopPower: number;
  curiosityGap: number;
  specificity: number;
  mobileFoldFit: boolean;
  lineBreakCount: number;
  charCount: number;
  feedback: string[];
  rewrites: Array<{
    angle: 'Contrarian' | 'Data-Backed' | 'Story Open' | 'Framework';
    text: string;
    predictedLift: string;
  }>;
}

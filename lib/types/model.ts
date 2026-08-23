// ─────────────────────────────────────────────────────────────────────────────
// BenchAtlas — Model Type System
// ─────────────────────────────────────────────────────────────────────────────

export type ModelModality = 'text' | 'image' | 'audio' | 'video' | 'code';
export type ModelProvider =
  | 'OpenAI'
  | 'Anthropic'
  | 'Google'
  | 'Meta'
  | 'Mistral AI'
  | 'Microsoft'
  | 'Alibaba'
  | 'Cohere'
  | 'xAI'
  | 'Amazon'
  | 'community';

export type ModelAccessType = 'api' | 'open-weights' | 'open-source' | 'proprietary';

export interface ModelCapabilities {
  contextWindow: number; // tokens
  maxOutput?: number;
  functionCalling?: boolean;
  codeExecution?: boolean;
  imageInput?: boolean;
  imageOutput?: boolean;
  audioInput?: boolean;
  audioOutput?: boolean;
  videoInput?: boolean;
  streaming?: boolean;
}

export interface ModelPricing {
  inputPer1M?: number; // USD
  outputPer1M?: number; // USD
  currency?: string;
  lastUpdated?: string;
}

export interface ModelParams {
  total?: string; // "405B", "72B"
  active?: string; // for MoE models
  architecture?: string; // "Transformer", "MoE", "SSM"
  trainingTokens?: string;
}

export interface BenchmarkResult {
  benchmarkId: string;
  benchmarkSlug: string;
  benchmarkName: string;
  score: number;
  normalizedScore: number;
  shots?: number;
  promptingStrategy?: string;
  scoredAt: string;
  source?: string;
  isOfficial?: boolean;
}

export interface Model {
  // Identity
  id: string;
  slug: string;
  name: string;
  family: string;
  version?: string;
  provider: ModelProvider;

  // Access
  accessType: ModelAccessType;
  releaseDate: string;
  knowledgeCutoff?: string;
  weightsUrl?: string;
  apiEndpoint?: string;
  huggingFaceId?: string;

  // Capabilities
  modalities: ModelModality[];
  capabilities: ModelCapabilities;
  params?: ModelParams;

  // Descriptions
  description: string;
  useCases: string[];

  // Pricing
  pricing?: ModelPricing;

  // Benchmark results
  benchmarkResults: BenchmarkResult[];

  // Meta
  tags: string[];
  paperUrl?: string;
  websiteUrl?: string;
  systemCard?: string;
  featured?: boolean;
}

export type ModelSummary = Pick<
  Model,
  | 'id'
  | 'slug'
  | 'name'
  | 'family'
  | 'provider'
  | 'accessType'
  | 'modalities'
  | 'releaseDate'
  | 'description'
  | 'featured'
  | 'tags'
>;

export interface ModelFilters {
  provider?: ModelProvider | 'all';
  accessType?: ModelAccessType | 'all';
  modality?: ModelModality | 'all';
  search?: string;
}

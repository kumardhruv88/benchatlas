// ─────────────────────────────────────────────────────────────────────────────
// BenchAtlas — Evaluation Type System
// ─────────────────────────────────────────────────────────────────────────────

export type EvaluationStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface EvaluationMetric {
  id: string;
  name: string;
  abbreviation?: string;
  description: string;
  range: [number, number]; // [min, max]
  higherIsBetter: boolean;
  formula?: string;
  references?: string[];
}

export interface EvaluationRun {
  id: string;
  benchmarkId: string;
  modelId: string;
  status: EvaluationStatus;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  metadata?: Record<string, unknown>;
  logs?: string[];
  errors?: string[];
}

export interface EvaluationConfig {
  shots: number;
  promptTemplate?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  seed?: number;
  chainOfThought?: boolean;
}

// ─── Category metadata ────────────────────────────────────────────────────────

export interface CategoryMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // CSS custom property reference
  benchmarkCount?: number;
}

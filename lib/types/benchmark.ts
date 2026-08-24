// ─────────────────────────────────────────────────────────────────────────────
// BenchAtlas — Benchmark Type System
// All benchmark-related TypeScript interfaces and enums.
// ─────────────────────────────────────────────────────────────────────────────

export type BenchmarkCategory =
  | 'knowledge'
  | 'reasoning'
  | 'mathematics'
  | 'coding'
  | 'instruction-following'
  | 'long-context'
  | 'multilingual'
  | 'multimodal'
  | 'safety'
  | 'safety-alignment'
  | 'agents'
  | 'agentic-tool-use'
  | 'factuality'
  | 'hallucination'
  | 'retrieval'
  | 'vision-language'
  | 'audio-speech'
  | 'robustness'
  | 'efficiency'
  | 'domain-specific';

export type BenchmarkDifficulty = 'introductory' | 'undergraduate' | 'graduate' | 'expert' | 'mixed';

export type SaturationStatus =
  | 'not-saturated'
  | 'approaching-saturation'
  | 'saturated'
  | 'retired';

export type ContaminationRisk = 'low' | 'medium' | 'high' | 'unknown';

export type TaskFormat =
  | 'multiple-choice'
  | 'free-form'
  | 'open-ended'
  | 'code-generation'
  | 'fill-in-the-blank'
  | 'ranking'
  | 'dialogue'
  | 'mixed'
  | 'structured-output'
  | 'structured-generation'
  | 'agentic';

export type EvaluationProtocol =
  | 'exact-match'
  | 'llm-judge'
  | 'model-judge'
  | 'human-eval'
  | 'execution-based'
  | 'rule-based'
  | 'embedding-similarity'
  | 'token-match'
  | 'symbolic-match'
  | 'ast-match'
  | 'task-completion'
  | 'tournament';

export type Modality = 'text' | 'image' | 'audio' | 'video' | 'code' | 'structured-data';

export type License =
  | 'MIT'
  | 'Apache-2.0'
  | 'Apache 2.0'
  | 'CC-BY-4.0'
  | 'CC BY 4.0'
  | 'CC-BY-NC-4.0'
  | 'CC-BY-SA-4.0'
  | 'CC BY-SA 4.0'
  | 'AFL-3.0'
  | 'Public'
  | 'custom'
  | 'proprietary'
  | 'unknown';

// ─── Score Entry ─────────────────────────────────────────────────────────────

export interface ModelScore {
  modelId: string;
  modelName: string;
  modelFamily: string;
  score: number;
  /** Normalized 0–100 for cross-benchmark display */
  normalizedScore: number;
  scoredAt: string; // ISO date
  evaluationContext?: string;
  shots?: number; // e.g. 5-shot, 0-shot
  promptingStrategy?: string;
  source?: string; // URL or reference
  isOfficial?: boolean;
}

// ─── Timeline Event ───────────────────────────────────────────────────────────

export interface BenchmarkTimelineEntry {
  date: string; // ISO date
  event: string;
  description?: string;
  modelId?: string;
  score?: number;
}

// ─── Paper Reference ─────────────────────────────────────────────────────────

export interface Paper {
  title: string;
  authors?: string[];
  venue?: string;
  year: number;
  url: string;
  arxivId?: string;
}

// ─── Benchmark Limitation ────────────────────────────────────────────────────

export interface BenchmarkLimitation {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// ─── Benchmark Relationships ───────────────────────────────────────────────────

export type BenchmarkRelationType = 
  | 'predecessor'
  | 'successor'
  | 'similar'
  | 'same-capability'
  | 'same-dataset-family'
  | 'alternative'
  | 'recommended-companion'
  | 'harder-version'
  | 'simpler-version'
  | 'easier-version'
  | 'complementary';

export interface BenchmarkRelation {
  slug: string;
  type: BenchmarkRelationType;
  note?: string;
  description?: string;
}

// ─── Main Benchmark Interface ─────────────────────────────────────────────────

export interface Benchmark {
  // Identity
  id: string;
  slug: string;
  name: string;
  abbreviation?: string;
  version?: string;

  // Classification
  category: BenchmarkCategory;
  subcategories: string[];
  difficulty?: BenchmarkDifficulty;
  modalities: Modality[];
  languages: string[];

  // Purpose
  purpose: string;
  capability: string;
  description: string;

  // Dataset
  datasetSize?: number;
  datasetSizeLabel?: string; // "14,042 questions"
  datasetSplit?: string; // "test: 14,042 | dev: 285"
  taskFormat: TaskFormat;

  // Evaluation
  evaluationMetric: string;
  scoringMethod: string;
  evaluationProtocol: EvaluationProtocol;
  shots?: string; // "0-shot, 5-shot"

  // Baselines
  humanBaseline?: number;
  randomBaseline?: number;
  chanceLevel?: number;

  // Status
  saturationStatus: SaturationStatus;
  saturationThreshold?: number;
  contaminationRisk: ContaminationRisk;
  dataLeakageNotes?: string;

  // Dates
  launchDate: string; // ISO date
  latestUpdate?: string; // ISO date

  // Provenance
  maintainer: string;
  maintainerUrl?: string;
  organization?: string;
  license: License;

  // Scores
  scores: ModelScore[];
  topScore?: number;
  topScoringModel?: string;

  // Methodology
  methodology: string;
  constructionMethod?: string;
  annotationProcess?: string;

  // Limitations
  limitations: BenchmarkLimitation[];
  criticisms?: string[];

  // History
  timeline: BenchmarkTimelineEntry[];

  // Relations
  relations?: BenchmarkRelation[];
  evaluationHarnesses: string[];

  // Use cases
  recommendedUseCases: string[];
  notRecommendedFor: string[];
  exampleQuestions?: ExampleQuestion[];

  // External links
  paper?: Paper;
  datasetUrl?: string;
  repositoryUrl?: string;
  leaderboardUrl?: string;
  websiteUrl?: string;

  // Meta
  featured?: boolean;
  tags: string[];
}

// ─── Example Question ─────────────────────────────────────────────────────────

export interface ExampleQuestion {
  question: string;
  choices?: string[];
  answer?: string;
  subject?: string;
  difficulty?: string;
}

// ─── Benchmark Summary (for lists/cards) ─────────────────────────────────────

export type BenchmarkSummary = Pick<
  Benchmark,
  | 'id'
  | 'slug'
  | 'name'
  | 'abbreviation'
  | 'category'
  | 'subcategories'
  | 'purpose'
  | 'saturationStatus'
  | 'contaminationRisk'
  | 'datasetSizeLabel'
  | 'taskFormat'
  | 'humanBaseline'
  | 'topScore'
  | 'topScoringModel'
  | 'launchDate'
  | 'modalities'
  | 'languages'
  | 'evaluationMetric'
  | 'featured'
  | 'tags'
>;

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface BenchmarkFilters {
  category?: BenchmarkCategory | 'all';
  saturationStatus?: SaturationStatus | 'all';
  taskFormat?: TaskFormat | 'all';
  modality?: Modality | 'all';
  language?: string;
  search?: string;
}

// ─── Sort Options ─────────────────────────────────────────────────────────────

export type BenchmarkSortKey =
  | 'name'
  | 'launchDate'
  | 'topScore'
  | 'datasetSize'
  | 'numModels';

export interface BenchmarkSortState {
  key: BenchmarkSortKey;
  direction: 'asc' | 'desc';
}

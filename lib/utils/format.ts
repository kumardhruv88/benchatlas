// ─────────────────────────────────────────────────────────────────────────────
// BenchAtlas — Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

import type {
  BenchmarkCategory,
  SaturationStatus,
  ContaminationRisk,
  TaskFormat,
} from '../types/benchmark';

// ─── Label formatters ─────────────────────────────────────────────────────────

export function formatCategory(cat: BenchmarkCategory): string {
  const labels: Record<BenchmarkCategory, string> = {
    knowledge: 'Knowledge',
    reasoning: 'Reasoning',
    mathematics: 'Mathematics',
    coding: 'Coding',
    'instruction-following': 'Instruction Following',
    'long-context': 'Long Context',
    multilingual: 'Multilingual',
    multimodal: 'Multimodal',
    safety: 'Safety',
    'safety-alignment': 'Safety & Alignment',
    agents: 'Agents',
    'agentic-tool-use': 'Agentic / Tool Use',
    factuality: 'Factuality',
    hallucination: 'Hallucination',
    retrieval: 'Retrieval',
    'vision-language': 'Vision-Language',
    'audio-speech': 'Audio & Speech',
    robustness: 'Robustness',
    efficiency: 'Efficiency',
    'domain-specific': 'Domain-Specific',
  };
  return labels[cat] ?? cat;
}

export function formatSaturationStatus(status: SaturationStatus): string {
  const labels: Record<SaturationStatus, string> = {
    'not-saturated': 'Not Saturated',
    'approaching-saturation': 'Approaching Saturation',
    saturated: 'Saturated',
    retired: 'Retired',
  };
  return labels[status];
}

export function formatContaminationRisk(risk: ContaminationRisk): string {
  const labels: Record<ContaminationRisk, string> = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    unknown: 'Unknown',
  };
  return labels[risk];
}

export function formatTaskFormat(format: TaskFormat): string {
  const labels: Record<TaskFormat, string> = {
    'multiple-choice': 'Multiple Choice',
    'free-form': 'Free Form',
    'open-ended': 'Open Ended',
    'code-generation': 'Code Generation',
    'fill-in-the-blank': 'Fill in the Blank',
    ranking: 'Ranking',
    dialogue: 'Dialogue',
    mixed: 'Mixed',
    'structured-output': 'Structured Output',
    'structured-generation': 'Structured Generation',
    agentic: 'Agentic',
  };
  return labels[format];
}

// ─── Numeric formatters ───────────────────────────────────────────────────────

export function formatScore(score: number, unit?: string): string {
  if (unit === '%' || !unit) {
    return `${score.toFixed(1)}%`;
  }
  return `${score.toFixed(2)} ${unit}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatYear(iso: string): string {
  return new Date(iso).getFullYear().toString();
}

// ─── Color lookups ────────────────────────────────────────────────────────────

export function getCategoryColor(cat: BenchmarkCategory): string {
  const colors: Partial<Record<BenchmarkCategory, string>> = {
    knowledge: 'var(--color-category-knowledge)',
    reasoning: 'var(--color-category-reasoning)',
    mathematics: 'var(--color-category-mathematics)',
    coding: 'var(--color-category-coding)',
    'instruction-following': 'var(--color-category-instruction)',
    multimodal: 'var(--color-category-multimodal)',
    'vision-language': 'var(--color-category-vision)',
    'safety-alignment': 'var(--color-category-safety)',
    factuality: 'var(--color-category-factuality)',
    'agentic-tool-use': 'var(--color-category-agentic)',
  };
  return colors[cat] ?? 'var(--color-category-default)';
}

export function getSaturationColor(status: SaturationStatus): string {
  const map: Record<SaturationStatus, string> = {
    'not-saturated': 'var(--color-status-healthy)',
    'approaching-saturation': 'var(--color-status-warning)',
    saturated: 'var(--color-status-danger)',
    retired: 'var(--color-status-neutral)',
  };
  return map[status];
}

export function getContaminationColor(risk: ContaminationRisk): string {
  const map: Record<ContaminationRisk, string> = {
    low: 'var(--color-status-healthy)',
    medium: 'var(--color-status-warning)',
    high: 'var(--color-status-danger)',
    unknown: 'var(--color-status-neutral)',
  };
  return map[risk];
}

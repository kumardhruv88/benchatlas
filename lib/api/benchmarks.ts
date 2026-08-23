// ─────────────────────────────────────────────────────────────────────────────
// BenchAtlas — Benchmark API Layer
// Typed data access functions. Swap these implementations for real DB calls
// without changing any calling code.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ALL_BENCHMARKS,
  ALL_BENCHMARK_SUMMARIES,
  BENCHMARK_MAP,
} from '../data/index';

import type {
  Benchmark,
  BenchmarkSummary,
  BenchmarkCategory,
  BenchmarkFilters,
  BenchmarkSortKey,
  SaturationStatus,
  TaskFormat,
} from '../types/benchmark';

// ─── Getters ──────────────────────────────────────────────────────────────────

export function getBenchmarks(): Benchmark[] {
  return ALL_BENCHMARKS;
}

export function getBenchmarkSummaries(): BenchmarkSummary[] {
  return ALL_BENCHMARK_SUMMARIES;
}

export function getBenchmarkBySlug(slug: string): Benchmark | undefined {
  return BENCHMARK_MAP.get(slug);
}

export function getBenchmarksByCategory(category: BenchmarkCategory): Benchmark[] {
  return ALL_BENCHMARKS.filter((b) => b.category === category);
}

export function getFeaturedBenchmarks(): Benchmark[] {
  return ALL_BENCHMARKS.filter((b) => b.featured);
}

// ─── Filtering ────────────────────────────────────────────────────────────────

export function filterBenchmarks(
  filters: BenchmarkFilters,
  benchmarks: BenchmarkSummary[] = ALL_BENCHMARK_SUMMARIES
): BenchmarkSummary[] {
  let result = [...benchmarks];

  if (filters.category && filters.category !== 'all') {
    result = result.filter((b) => b.category === filters.category);
  }

  if (filters.saturationStatus && filters.saturationStatus !== 'all') {
    result = result.filter((b) => b.saturationStatus === filters.saturationStatus);
  }

  if (filters.taskFormat && filters.taskFormat !== 'all') {
    result = result.filter((b) => b.taskFormat === filters.taskFormat);
  }

  if (filters.modality && filters.modality !== 'all') {
    const mod = filters.modality as Exclude<typeof filters.modality, 'all'>;
    result = result.filter((b) => b.modalities.includes(mod));
  }

  if (filters.language) {
    result = result.filter((b) =>
      b.languages.some((l) => l.toLowerCase() === filters.language!.toLowerCase())
    );
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.abbreviation?.toLowerCase().includes(q) ||
        b.purpose.toLowerCase().includes(q) ||
        b.tags.some((t) => t.includes(q))
    );
  }

  return result;
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

export function sortBenchmarks(
  benchmarks: BenchmarkSummary[],
  key: BenchmarkSortKey,
  direction: 'asc' | 'desc' = 'asc'
): BenchmarkSummary[] {
  const sorted = [...benchmarks].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (key) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'launchDate':
        aVal = a.launchDate;
        bVal = b.launchDate;
        break;
      case 'topScore':
        aVal = a.topScore ?? 0;
        bVal = b.topScore ?? 0;
        break;
      default:
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export function searchBenchmarks(query: string): BenchmarkSummary[] {
  return filterBenchmarks({ search: query });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getBenchmarkStats() {
  const total = ALL_BENCHMARKS.length;
  const saturated = ALL_BENCHMARKS.filter(
    (b) => b.saturationStatus === 'saturated'
  ).length;
  const categories = new Set(ALL_BENCHMARKS.map((b) => b.category)).size;
  const totalScores = ALL_BENCHMARKS.reduce((sum, b) => sum + b.scores.length, 0);

  return { total, saturated, categories, totalScores };
}

// ─── Category list ────────────────────────────────────────────────────────────

export function getDistinctCategories(): BenchmarkCategory[] {
  const cats = new Set(ALL_BENCHMARKS.map((b) => b.category));
  return Array.from(cats);
}

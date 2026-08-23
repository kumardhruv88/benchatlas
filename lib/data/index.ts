// ─────────────────────────────────────────────────────────────────────────────
// BenchAtlas — Seed Data Index
// Aggregates all benchmarks and models with typed exports.
// ─────────────────────────────────────────────────────────────────────────────

import { benchmarks, benchmarkSummaries, toBenchmarkSummary } from './benchmarks';
import type { Benchmark, BenchmarkSummary } from '../types/benchmark';

// ─── All Benchmarks ───────────────────────────────────────────────────────────

export const ALL_BENCHMARKS: Benchmark[] = benchmarks;

// ─── Benchmark map by slug ───────────────────────────────────────────────────

export const BENCHMARK_MAP = new Map<string, Benchmark>(
  ALL_BENCHMARKS.map((b) => [b.slug, b])
);

// ─── Summary projections ─────────────────────────────────────────────────────

export { toBenchmarkSummary };

export const ALL_BENCHMARK_SUMMARIES: BenchmarkSummary[] = benchmarkSummaries;

export * from './benchmarks';

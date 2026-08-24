'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { X, GitCompare, ArrowUpDown, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import styles from './page.module.css';
import { CategoryBadge } from '@/components/ui/Badge';
import { getBenchmarkSummaries } from '@/lib/api/benchmarks';
import { formatScore, formatCategory } from '@/lib/utils/format';
import type { BenchmarkSummary } from '@/lib/types';

// Colour palette for selected model chips/bars
const MODEL_COLORS = [
  '#1d4ed8', '#7c3aed', '#be185d', '#065f46',
  '#b45309', '#0e7490', '#4338ca', '#9a3412',
];

// Static list of model names from all scores — built once
function getAllModels(benchmarks: BenchmarkSummary[]): string[] {
  const set = new Set<string>();
  benchmarks.forEach((b) => {
    if (b.topScoringModel) set.add(b.topScoringModel);
  });
  return Array.from(set).sort();
}

export default function ComparePage() {
  const allBenchmarks = useMemo(() => getBenchmarkSummaries(), []);
  const allModels = useMemo(() => getAllModels(allBenchmarks), [allBenchmarks]);

  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'name' | 'category'>('category');

  const addModel = useCallback(
    (model: string) => {
      if (model && !selectedModels.includes(model) && selectedModels.length < 6) {
        setSelectedModels((m) => [...m, model]);
      }
    },
    [selectedModels]
  );

  const removeModel = useCallback((model: string) => {
    setSelectedModels((m) => m.filter((x) => x !== model));
  }, []);

  // All distinct categories
  const categories = useMemo(
    () => Array.from(new Set(allBenchmarks.map((b) => b.category))).sort(),
    [allBenchmarks]
  );

  // Filtered + sorted benchmarks
  const benchmarks = useMemo(() => {
    let list = allBenchmarks;
    if (categoryFilter !== 'all') list = list.filter((b) => b.category === categoryFilter);
    if (sortKey === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'category') list = [...list].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    return list;
  }, [allBenchmarks, categoryFilter, sortKey]);

  // For each benchmark, find the score for each selected model
  // We approximate: if the benchmark's topScoringModel matches, use topScore
  // (A real implementation would join on a full scores table)
  const scoreMatrix = useMemo(() => {
    return benchmarks.map((b) => {
      const scores: (number | null)[] = selectedModels.map((m) =>
        b.topScoringModel === m ? (b.topScore ?? null) : null
      );
      return { benchmark: b, scores };
    });
  }, [benchmarks, selectedModels]);

  const maxScorePerBench = useMemo(() =>
    scoreMatrix.map(({ scores }) => Math.max(...scores.filter((s): s is number => s !== null), 0)),
    [scoreMatrix]
  );

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '16px 0 12px', fontSize: 'var(--text-xs)', color: 'var(--color-text-quaternary)' }} aria-label="Breadcrumb">
          <Link href="/" style={{ color: 'var(--color-text-quaternary)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page">Compare</span>
        </nav>

        {/* Page header */}
        <header className={styles.page_header}>
          <p className={styles.page_header__eyebrow}>Cross-benchmark analysis</p>
          <h1 className={styles.page_header__title}>Model Comparison</h1>
          <p className={styles.page_header__desc}>
            Select up to 6 models to compare their performance across benchmarks.
            Scores are shown where available in the index.
          </p>
        </header>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Model selector */}
          <div className={styles.controls_group}>
            <span className={styles.controls_label}>Add model</span>
            <select
              className={styles.selector}
              value=""
              onChange={(e) => addModel(e.target.value)}
              aria-label="Select a model to add"
              disabled={selectedModels.length >= 6}
            >
              <option value="" disabled>
                {selectedModels.length >= 6 ? 'Max 6 models' : 'Select a model…'}
              </option>
              {allModels
                .filter((m) => !selectedModels.includes(m))
                .map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
            </select>
          </div>

          {/* Category filter */}
          <div className={styles.controls_group}>
            <span className={styles.controls_label}>Filter benchmarks</span>
            <select
              className={styles.selector}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{formatCategory(c)}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className={styles.controls_group}>
            <span className={styles.controls_label}>Sort by</span>
            <select
              className={styles.selector}
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as 'name' | 'category')}
              aria-label="Sort benchmarks"
            >
              <option value="category">Category</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Selected models chips */}
          {selectedModels.length > 0 && (
            <div className={styles.controls_group}>
              <span className={styles.controls_label}>Selected ({selectedModels.length}/6)</span>
              <div className={styles.selected_models}>
                {selectedModels.map((m, i) => (
                  <span key={m} className={styles.model_chip}>
                    <span
                      className={styles.model_chip__color}
                      style={{ background: MODEL_COLORS[i % MODEL_COLORS.length] }}
                    />
                    {m}
                    <button
                      type="button"
                      className={styles.model_chip__remove}
                      onClick={() => removeModel(m)}
                      aria-label={`Remove ${m}`}
                    >
                      <X size={11} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comparison table */}
        {selectedModels.length === 0 ? (
          <div className={styles.empty_state} role="status">
            <div className={styles.empty_state__icon}>
              <GitCompare size={18} aria-hidden="true" />
            </div>
            <p className={styles.empty_state__title}>No models selected</p>
            <p className={styles.empty_state__desc}>
              Add models using the selector above to compare their benchmark scores side by side.
            </p>
          </div>
        ) : (
          <div className={styles.compare_table_wrap}>
            <table className={styles.compare_table} aria-label="Model benchmark comparison">
              <thead>
                <tr>
                  <th>Benchmark</th>
                  {selectedModels.map((m, i) => (
                    <th key={m}>
                      <div className={styles.model_col_header}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8, height: 8, borderRadius: '50%',
                            background: MODEL_COLORS[i % MODEL_COLORS.length],
                            marginBottom: 2,
                          }}
                        />
                        <span className={styles.model_col_name}>{m}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoreMatrix.map(({ benchmark: b, scores }, rowIdx) => {
                  const max = maxScorePerBench[rowIdx];
                  return (
                    <tr key={b.id}>
                      <td>
                        <div className={styles.bench_row_name}>
                          <Link
                            href={`/benchmarks/${b.slug}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            <span className={styles.bench_row_title}>{b.name}</span>
                          </Link>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CategoryBadge category={b.category} size="sm" />
                            {b.abbreviation && (
                              <span className={styles.bench_row_abbr}>{b.abbreviation}</span>
                            )}
                          </span>
                        </div>
                      </td>
                      {scores.map((score, si) => {
                        const isBest = score !== null && score === max && max > 0;
                        return (
                          <td key={selectedModels[si]}>
                            {score !== null ? (
                              <div className={styles.score_cell}>
                                <span
                                  className={`${styles.score_value} ${isBest ? styles['score_value--best'] : ''}`}
                                >
                                  {formatScore(score)}
                                </span>
                                <div className={styles.score_bar}>
                                  <div
                                    className={`${styles.score_bar__fill} ${isBest ? styles['score_bar__fill--best'] : ''}`}
                                    style={{
                                      width: max > 0 ? `${(score / max) * 100}%` : '0%',
                                      background: isBest
                                        ? undefined
                                        : MODEL_COLORS[si % MODEL_COLORS.length],
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className={styles.score_empty}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

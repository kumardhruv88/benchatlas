'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { X, GitCompare, ChevronRight } from 'lucide-react';
import { ModelRadarChart } from '@/components/charts/ModelRadarChart';
import styles from './page.module.css';
import { CategoryBadge } from '@/components/ui/Badge';
import { getBenchmarks } from '@/lib/api/benchmarks';
import { formatScore, formatCategory } from '@/lib/utils/format';
import type { Benchmark } from '@/lib/types/benchmark';

// Colour palette for selected model chips/bars
const MODEL_COLORS = [
  '#1d4ed8', '#7c3aed', '#be185d', '#065f46',
  '#b45309', '#0e7490', '#4338ca', '#9a3412',
];

// Static list of model names from all scores — built once
function getAllModels(benchmarks: Benchmark[]): string[] {
  const set = new Set<string>();
  benchmarks.forEach((b) => {
    b.scores.forEach(s => set.add(s.modelName));
  });
  return Array.from(set).sort();
}

export default function ComparePage() {
  const allBenchmarks = useMemo(() => getBenchmarks(), []);
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
  const sortedBenchmarks = useMemo(() => {
    let list = allBenchmarks;
    if (categoryFilter !== 'all') list = list.filter((b) => b.category === categoryFilter);
    if (sortKey === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'category') list = [...list].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    return list;
  }, [allBenchmarks, categoryFilter, sortKey]);

  // For each benchmark, find the score for each selected model
  const scoreMatrix = useMemo(() => {
    return sortedBenchmarks.map((b) => {
      const scores = selectedModels.map((m) => {
        const entry = b.scores.find((s) => s.modelName === m);
        return entry ? entry.score : null;
      });
      return { benchmark: b, scores };
    });
  }, [sortedBenchmarks, selectedModels]);

  const maxScorePerBench = useMemo(() =>
    scoreMatrix.map(({ scores }) => {
      const valid = scores.filter((s): s is number => s !== null);
      return valid.length > 0 ? Math.max(...valid) : 0;
    }),
    [scoreMatrix]
  );

  // Calculate category averages for the radar chart if 2 models are selected
  const radarData = useMemo(() => {
    if (selectedModels.length !== 2) return [];
    const [model1, model2] = selectedModels;
    const catMap = new Map<string, { m1Sum: number, m1Count: number, m2Sum: number, m2Count: number }>();
    
    scoreMatrix.forEach(({ benchmark: b, scores }) => {
      const cat = formatCategory(b.category);
      if (!catMap.has(cat)) {
        catMap.set(cat, { m1Sum: 0, m1Count: 0, m2Sum: 0, m2Count: 0 });
      }
      const data = catMap.get(cat)!;
      if (scores[0] !== null) { data.m1Sum += scores[0]; data.m1Count += 1; }
      if (scores[1] !== null) { data.m2Sum += scores[1]; data.m2Count += 1; }
    });

    return Array.from(catMap.entries()).map(([cat, data]) => ({
      category: cat,
      [model1]: data.m1Count > 0 ? Math.round(data.m1Sum / data.m1Count) : 0,
      [model2]: data.m2Count > 0 ? Math.round(data.m2Sum / data.m2Count) : 0,
    }));
  }, [scoreMatrix, selectedModels]);

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
          <>
            {selectedModels.length === 2 && radarData.length > 0 && (
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <h2 className={styles.section_title} style={{ marginBottom: 'var(--space-4)' }}>
                  Head-to-Head Comparison
                </h2>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                  <ModelRadarChart 
                    modelA={{ id: selectedModels[0], name: selectedModels[0], color: MODEL_COLORS[0] }}
                    modelB={{ id: selectedModels[1], name: selectedModels[1], color: MODEL_COLORS[1] }}
                    data={radarData}
                  />
                </div>
              </div>
            )}
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
          </>
        )}
      </div>
    </div>
  );
}


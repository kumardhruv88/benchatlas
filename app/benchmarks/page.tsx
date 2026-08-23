'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { Search, LayoutGrid, List, Table2 } from 'lucide-react';
import styles from './page.module.css';
import { CategoryBadge, SaturationBadge, ContaminationBadge } from '@/components/ui/Badge';
import { getBenchmarkSummaries } from '@/lib/api/benchmarks';
import { formatCategory, formatScore, formatTaskFormat } from '@/lib/utils/format';
import { useUrlFilter } from '@/lib/hooks/useUrlFilter';
import type {
  BenchmarkCategory,
  BenchmarkSummary,
  SaturationStatus,
  ContaminationRisk,
} from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const CAPABILITY_ROWS: BenchmarkCategory[] = [
  'knowledge',
  'reasoning',
  'mathematics',
  'coding',
  'instruction-following',
  'long-context',
  'multilingual',
  'multimodal',
  'vision-language',
  'safety-alignment',
  'agentic-tool-use',
  'factuality',
  'hallucination',
  'retrieval',
  'robustness',
  'efficiency',
  'domain-specific',
];

const STATUS_COLUMNS: { key: SaturationStatus; label: string; chipClass: string; colClass: string }[] = [
  { key: 'not-saturated', label: 'Active', chipClass: styles.bench_chip_active, colClass: styles.col_active },
  { key: 'approaching-saturation', label: 'Nearing saturation', chipClass: styles.bench_chip_nearing, colClass: styles.col_nearing },
  { key: 'saturated', label: 'Saturated', chipClass: styles.bench_chip_saturated, colClass: styles.col_saturated },
  { key: 'retired', label: 'Deprecated', chipClass: styles.bench_chip_retired, colClass: styles.col_retired },
];

type ViewMode = 'matrix' | 'grid' | 'list';

// ─── Component ────────────────────────────────────────────────────────────────

function BenchmarksDirectory() {
  const all = getBenchmarkSummaries();

  const [search, setSearch] = useUrlFilter<string>('q', '');
  const [categoryFilter, setCategoryFilter] = useUrlFilter<BenchmarkCategory | 'all'>('category', 'all');
  const [contaminationFilter, setContaminationFilter] = useUrlFilter<ContaminationRisk | 'all'>('contamination', 'all');
  const [view, setView] = useUrlFilter<ViewMode>('view', 'matrix');

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = all;
    if (categoryFilter !== 'all') result = result.filter((b) => b.category === categoryFilter);
    if (contaminationFilter !== 'all') result = result.filter((b) => b.contaminationRisk === contaminationFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.abbreviation?.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q))
      );
    }
    return result;
  }, [all, categoryFilter, contaminationFilter, search]);

  // ── Matrix computation ────────────────────────────────────────────────────
  const matrixData = useMemo(() => {
    const map = new Map<BenchmarkCategory, Map<SaturationStatus, BenchmarkSummary[]>>();
    for (const b of filtered) {
      if (!map.has(b.category)) map.set(b.category, new Map());
      const catMap = map.get(b.category)!;
      if (!catMap.has(b.saturationStatus)) catMap.set(b.saturationStatus, []);
      catMap.get(b.saturationStatus)!.push(b);
    }
    return map;
  }, [filtered]);

  // Only show rows that have at least one benchmark
  const activeRows = CAPABILITY_ROWS.filter((cat) =>
    filtered.some((b) => b.category === cat)
  );

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className={styles.page_header}>
        <div className="container">
          <p className={styles.page_header__eyebrow}>Reference</p>
          <h1 className={styles.page_header__title}>LLM Benchmark Directory</h1>
          <p className={styles.page_header__desc}>
            A capability × status map of LLM benchmarks. Green is still discriminative;
            gray has saturated. Vendor-reported and independent scores are kept distinct.
          </p>
        </div>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="container">
        <div className={styles.toolbar} role="search" aria-label="Filter benchmarks">
          <div className={styles.toolbar__filters}>
            {/* Search */}
            <label className={styles.toolbar__search} htmlFor="bench-search">
              <Search size={14} aria-hidden="true" />
              <input
                id="bench-search"
                type="search"
                placeholder="Search benchmarks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search benchmarks"
              />
            </label>

            {/* Contamination filter */}
            <div className={styles.filter_group}>
              <label htmlFor="contamination-filter" className={styles.filter_label}>
                Contamination risk
              </label>
              <select
                id="contamination-filter"
                className={styles.filter_select}
                value={contaminationFilter}
                onChange={(e) => setContaminationFilter(e.target.value as ContaminationRisk | 'all')}
              >
                <option value="all">Any</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {/* Category filter */}
            <div className={styles.filter_group}>
              <label htmlFor="category-filter" className={styles.filter_label}>
                Capability
              </label>
              <select
                id="category-filter"
                className={styles.filter_select}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as BenchmarkCategory | 'all')}
              >
                <option value="all">All categories</option>
                {CAPABILITY_ROWS.map((c) => (
                  <option key={c} value={c}>
                    {formatCategory(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.toolbar__right}>
            <span className={styles.toolbar__count} aria-live="polite" aria-atomic="true">
              {filtered.length} / {all.length} shown
            </span>

            {/* View toggle */}
            <div className={styles.view_toggle} role="group" aria-label="View mode">
              {([
                { mode: 'matrix' as ViewMode, icon: Table2, label: 'Matrix view' },
                { mode: 'grid' as ViewMode, icon: LayoutGrid, label: 'Grid view' },
                { mode: 'list' as ViewMode, icon: List, label: 'List view' },
              ] as const).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  className={[
                    styles.view_toggle__btn,
                    view === mode && styles.view_toggle__btn_active,
                  ].filter(Boolean).join(' ')}
                  onClick={() => setView(mode)}
                  aria-label={label}
                  aria-pressed={view === mode}
                  type="button"
                >
                  <Icon size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        {view === 'matrix' && (
          <div className={styles.legend} aria-label="Status legend">
            {STATUS_COLUMNS.map(({ key, label, colClass }) => (
              <div key={key} className={styles.legend__item}>
                <span
                  className={styles.legend__dot}
                  style={{
                    backgroundColor:
                      key === 'not-saturated' ? 'var(--color-status-healthy)' :
                      key === 'approaching-saturation' ? 'var(--color-status-warning)' :
                      key === 'saturated' ? 'var(--color-text-quaternary)' :
                      'var(--color-border)',
                  }}
                  aria-hidden="true"
                />
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Matrix View ─────────────────────────────────────────────── */}
      {view === 'matrix' && (
        <section className={styles.matrix_section}>
          <div className="container">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className={styles.matrix} role="region" aria-label="Benchmark capability matrix">
                <table className={styles.matrix_table}>
                  <thead className={styles.matrix_thead}>
                    <tr>
                      <th scope="col">
                        capability ↕ / status →
                      </th>
                      {STATUS_COLUMNS.map(({ key, label, colClass }) => (
                        <th key={key} scope="col" className={colClass}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRows.map((cat) => {
                      const catMap = matrixData.get(cat);
                      const count = filtered.filter((b) => b.category === cat).length;
                      if (!catMap) return null;
                      return (
                        <tr key={cat} className={styles.matrix_row}>
                          <th scope="row" className={styles.matrix_cat_cell}>
                            <div className={styles.matrix_cat_label}>{formatCategory(cat)}</div>
                            <div className={styles.matrix_cat_sub}>{count} benchmark{count !== 1 ? 's' : ''}</div>
                          </th>
                          {STATUS_COLUMNS.map(({ key, chipClass }) => {
                            const benchmarks = catMap.get(key) ?? [];
                            return (
                              <td key={key} className={styles.matrix_cell}>
                                <div className={styles.matrix_chips}>
                                  {benchmarks.map((b) => (
                                    <Link
                                      key={b.id}
                                      href={`/benchmarks/${b.slug}`}
                                      className={`${styles.bench_chip} ${chipClass}`}
                                      title={b.purpose}
                                    >
                                      <span className={styles.bench_chip__dot} aria-hidden="true" />
                                      {b.abbreviation ?? b.name}
                                    </Link>
                                  ))}
                                </div>
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
        </section>
      )}

      {/* ── Grid View ─────────────────────────────────────────────────── */}
      {view === 'grid' && (
        <section className={styles.grid_section}>
          <div className="container">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className={styles.bench_grid} role="list">
                {filtered.map((b) => (
                  <article key={b.id} role="listitem">
                    <Link href={`/benchmarks/${b.slug}`} className={styles.bench_card_link ?? ''}>
                      <div className={`${styles.bench_list_item}`} style={{ flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <CategoryBadge category={b.category} size="sm" />
                          {b.abbreviation && (
                            <span className={styles.bench_list_abbr}>{b.abbreviation}</span>
                          )}
                        </div>
                        <div>
                          <div className={styles.bench_list_name}>{b.name}</div>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)', lineHeight: 'var(--leading-relaxed)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
                            {b.purpose}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
                          <SaturationBadge status={b.saturationStatus} />
                          <ContaminationBadge risk={b.contaminationRisk} />
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── List View ─────────────────────────────────────────────────── */}
      {view === 'list' && (
        <section className={styles.grid_section}>
          <div className="container">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className={styles.bench_list} role="list">
                {filtered.map((b) => (
                  <article key={b.id} role="listitem">
                    <Link href={`/benchmarks/${b.slug}`} className={styles.bench_list_item}>
                      <div>
                        <div className={styles.bench_list_name}>{b.name}</div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                          <CategoryBadge category={b.category} size="sm" />
                        </div>
                      </div>
                      <ContaminationBadge risk={b.contaminationRisk} />
                      <SaturationBadge status={b.saturationStatus} />
                      {b.topScore != null && (
                        <span className={styles.bench_list_score}>
                          {formatScore(b.topScore)} top
                        </span>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty} role="status">
      <div className={styles.empty__icon} aria-hidden="true">
        <Search size={20} />
      </div>
      <p className={styles.empty__title}>No benchmarks found</p>
      <p className={styles.empty__desc}>Try adjusting your search or filters</p>
    </div>
  );
}

export default function BenchmarksPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 'var(--space-8) 0', textAlign: 'center' }}>Loading benchmarks...</div>}>
      <BenchmarksDirectory />
    </Suspense>
  );
}

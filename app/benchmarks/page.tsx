'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import styles from './page.module.css';
import { CategoryBadge, SaturationBadge, ContaminationBadge } from '@/components/ui/Badge';
import { getBenchmarkSummaries } from '@/lib/api/benchmarks';
import { formatCategory, formatScore } from '@/lib/utils/format';
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

const SATURATION_OPTIONS: { value: SaturationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'not-saturated', label: 'Active' },
  { value: 'approaching-saturation', label: 'Approaching saturation' },
  { value: 'saturated', label: 'Saturated' },
  { value: 'retired', label: 'Deprecated' },
];

const CONTAMINATION_OPTIONS: { value: ContaminationRisk | 'all'; label: string }[] = [
  { value: 'all', label: 'All risk levels' },
  { value: 'low', label: 'Low risk' },
  { value: 'medium', label: 'Medium risk' },
  { value: 'high', label: 'High risk' },
  { value: 'unknown', label: 'Unknown' },
];

type SortKey = 'name' | 'topScore' | 'year' | 'category';
type ViewMode = 'grid' | 'list';

// ─── Sidebar Filter Group ─────────────────────────────────────────────────────

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.filter_group_section}>
      <button
        className={styles.filter_group_header}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        type="button"
      >
        <span className={styles.filter_group_title}>{title}</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && <div className={styles.filter_group_body}>{children}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function BenchmarksDirectory() {
  const all = getBenchmarkSummaries();

  const [search, setSearch] = useUrlFilter<string>('q', '');
  const [categoryFilter, setCategoryFilter] = useUrlFilter<BenchmarkCategory | 'all'>('category', 'all');
  const [contaminationFilter, setContaminationFilter] = useUrlFilter<ContaminationRisk | 'all'>('contamination', 'all');
  const [saturationFilter, setSaturationFilter] = useUrlFilter<SaturationStatus | 'all'>('status', 'all');
  const [sortKey, setSortKey] = useUrlFilter<SortKey>('sort', 'name');
  const [view, setView] = useUrlFilter<ViewMode>('view', 'grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = all;
    if (categoryFilter !== 'all') result = result.filter((b) => b.category === categoryFilter);
    if (contaminationFilter !== 'all') result = result.filter((b) => b.contaminationRisk === contaminationFilter);
    if (saturationFilter !== 'all') result = result.filter((b) => b.saturationStatus === saturationFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.abbreviation?.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q))
      );
    }
    // Sort
    result = [...result].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'topScore') return (b.topScore ?? 0) - (a.topScore ?? 0);
      if (sortKey === 'year') return (b.year ?? 0) - (a.year ?? 0);
      if (sortKey === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
    return result;
  }, [all, categoryFilter, contaminationFilter, saturationFilter, search, sortKey]);

  const activeFilters = [
    categoryFilter !== 'all' ? `Category: ${formatCategory(categoryFilter as BenchmarkCategory)}` : null,
    contaminationFilter !== 'all' ? `Contamination: ${contaminationFilter}` : null,
    saturationFilter !== 'all' ? `Status: ${saturationFilter}` : null,
  ].filter(Boolean) as string[];

  const clearAll = () => {
    setCategoryFilter('all');
    setContaminationFilter('all');
    setSaturationFilter('all');
    setSearch('');
  };

  return (
    <div className={styles.explorer_root}>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className={styles.page_header}>
        <div className="container">
          <p className={styles.page_header__eyebrow}>Benchmark Explorer</p>
          <h1 className={styles.page_header__title}>LLM Benchmark Directory</h1>
          <p className={styles.page_header__desc}>
            A structured capability × saturation map of {all.length} LLM benchmarks.
            Understand methodology, contamination risk, and when to trust a result.
          </p>
        </div>
      </div>

      {/* ── Body: Sidebar + Main ─────────────────────────────────────── */}
      <div className="container">
        <div className={styles.explorer_body}>
          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <aside
            className={[styles.sidebar, !sidebarOpen && styles.sidebar_hidden].filter(Boolean).join(' ')}
            aria-label="Benchmark filters"
          >
            <div className={styles.sidebar_inner}>
              <div className={styles.sidebar_header}>
                <span className={styles.sidebar_title}>
                  <SlidersHorizontal size={13} />
                  Filters
                </span>
                {activeFilters.length > 0 && (
                  <button className={styles.sidebar_clear} onClick={clearAll} type="button">
                    Clear all
                  </button>
                )}
              </div>

              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <div className={styles.active_filters}>
                  {activeFilters.map((f) => (
                    <span key={f} className={styles.active_filter_chip}>{f}</span>
                  ))}
                </div>
              )}

              <FilterGroup title="Capability">
                <div className={styles.filter_options}>
                  <button
                    className={[styles.filter_opt, categoryFilter === 'all' && styles.filter_opt_active].filter(Boolean).join(' ')}
                    onClick={() => setCategoryFilter('all')}
                    type="button"
                  >
                    All categories
                  </button>
                  {CAPABILITY_ROWS.filter((c) => all.some((b) => b.category === c)).map((c) => {
                    const count = all.filter((b) => b.category === c).length;
                    return (
                      <button
                        key={c}
                        className={[styles.filter_opt, categoryFilter === c && styles.filter_opt_active].filter(Boolean).join(' ')}
                        onClick={() => setCategoryFilter(c)}
                        type="button"
                      >
                        <span>{formatCategory(c)}</span>
                        <span className={styles.filter_opt_count}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </FilterGroup>

              <FilterGroup title="Saturation Status">
                <div className={styles.filter_options}>
                  {SATURATION_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      className={[styles.filter_opt, saturationFilter === value && styles.filter_opt_active].filter(Boolean).join(' ')}
                      onClick={() => setSaturationFilter(value as SaturationStatus | 'all')}
                      type="button"
                    >
                      {value !== 'all' && (
                        <span
                          className={styles.filter_dot}
                          style={{
                            background:
                              value === 'not-saturated' ? 'var(--color-status-healthy)' :
                              value === 'approaching-saturation' ? 'var(--color-status-warning)' :
                              value === 'saturated' ? 'var(--color-text-quaternary)' :
                              'var(--color-border)',
                          }}
                        />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Contamination Risk" defaultOpen={false}>
                <div className={styles.filter_options}>
                  {CONTAMINATION_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      className={[styles.filter_opt, contaminationFilter === value && styles.filter_opt_active].filter(Boolean).join(' ')}
                      onClick={() => setContaminationFilter(value as ContaminationRisk | 'all')}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </div>
          </aside>

          {/* ── Main Content ─────────────────────────────────────────── */}
          <main className={styles.main_content}>
            {/* Toolbar */}
            <div className={styles.toolbar} role="search" aria-label="Search and sort benchmarks">
              <button
                className={[styles.sidebar_toggle, !sidebarOpen && styles.sidebar_toggle_closed].filter(Boolean).join(' ')}
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label={sidebarOpen ? 'Hide filters' : 'Show filters'}
                type="button"
              >
                <SlidersHorizontal size={14} />
                {sidebarOpen ? 'Hide filters' : 'Filters'}
              </button>

              <label className={styles.search_input} htmlFor="bench-search">
                <Search size={14} aria-hidden="true" />
                <input
                  id="bench-search"
                  type="search"
                  placeholder="Search benchmarks…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search benchmarks"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                    <X size={12} />
                  </button>
                )}
              </label>

              <div className={styles.sort_select_wrap}>
                <ArrowUpDown size={13} />
                <select
                  className={styles.sort_select}
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  aria-label="Sort benchmarks"
                >
                  <option value="name">Name A–Z</option>
                  <option value="topScore">Top score ↓</option>
                  <option value="year">Newest first</option>
                  <option value="category">Category</option>
                </select>
              </div>

              <span className={styles.result_count} aria-live="polite" aria-atomic="true">
                {filtered.length} of {all.length}
              </span>

              <div className={styles.view_toggle} role="group" aria-label="View mode">
                {([
                  { mode: 'grid' as ViewMode, icon: LayoutGrid, label: 'Grid view' },
                  { mode: 'list' as ViewMode, icon: List, label: 'List view' },
                ] as const).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    className={[styles.view_btn, view === mode && styles.view_btn_active].filter(Boolean).join(' ')}
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

            {/* Content */}
            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : view === 'grid' ? (
              <div className={styles.bench_grid} role="list">
                {filtered.map((b) => (
                  <BenchmarkCard key={b.id} benchmark={b} />
                ))}
              </div>
            ) : (
              <div className={styles.bench_list_view} role="list">
                {filtered.map((b) => (
                  <BenchmarkListRow key={b.id} benchmark={b} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Benchmark Card (Grid) ────────────────────────────────────────────────────

function BenchmarkCard({ benchmark: b }: { benchmark: BenchmarkSummary }) {
  return (
    <article role="listitem" className={styles.bench_card}>
      <Link href={`/benchmarks/${b.slug}`} className={styles.bench_card_link}>
        <div className={styles.bench_card_header}>
          <CategoryBadge category={b.category} size="sm" />
          {b.abbreviation && <span className={styles.bench_card_abbr}>{b.abbreviation}</span>}
        </div>

        <div className={styles.bench_card_body}>
          <h3 className={styles.bench_card_name}>{b.name}</h3>
          <p className={styles.bench_card_purpose}>{b.purpose}</p>
        </div>

        {b.topScore != null && (
          <div className={styles.bench_card_score_bar}>
            <div className={styles.bench_card_score_meta}>
              <span className={styles.bench_card_score_label}>Top score</span>
              <span className={styles.bench_card_score_value}>{formatScore(b.topScore)}</span>
            </div>
            <div className={styles.bench_card_bar_track}>
              <div
                className={styles.bench_card_bar_fill}
                style={{ width: `${Math.min(100, b.topScore)}%` }}
              />
            </div>
          </div>
        )}

        <div className={styles.bench_card_footer}>
          <SaturationBadge status={b.saturationStatus} />
          <ContaminationBadge risk={b.contaminationRisk} />
        </div>
      </Link>
    </article>
  );
}

// ─── Benchmark List Row ───────────────────────────────────────────────────────

function BenchmarkListRow({ benchmark: b }: { benchmark: BenchmarkSummary }) {
  return (
    <article role="listitem">
      <Link href={`/benchmarks/${b.slug}`} className={styles.bench_list_row}>
        <div className={styles.bench_list_row_name}>
          <span className={styles.bench_list_row_title}>{b.name}</span>
          {b.abbreviation && <span className={styles.bench_list_row_abbr}>{b.abbreviation}</span>}
        </div>
        <div className={styles.bench_list_row_meta}>
          <CategoryBadge category={b.category} size="sm" />
        </div>
        <div className={styles.bench_list_row_badges}>
          <SaturationBadge status={b.saturationStatus} />
          <ContaminationBadge risk={b.contaminationRisk} />
        </div>
        {b.topScore != null && (
          <span className={styles.bench_list_row_score}>{formatScore(b.topScore)}</span>
        )}
        <ExternalLink size={13} className={styles.bench_list_row_arrow} aria-hidden="true" />
      </Link>
    </article>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className={styles.empty} role="status">
      <div className={styles.empty__icon} aria-hidden="true">
        <Search size={24} />
      </div>
      <p className={styles.empty__title}>No benchmarks found</p>
      <p className={styles.empty__desc}>Try adjusting your search or filters</p>
      <button className={styles.empty__clear} onClick={onClear} type="button">
        Clear all filters
      </button>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function BenchmarksPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: 'var(--space-8) 0', textAlign: 'center' }}>
          Loading benchmarks…
        </div>
      }
    >
      <BenchmarksDirectory />
    </Suspense>
  );
}

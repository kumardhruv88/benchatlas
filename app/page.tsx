import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BarChart2,
  BookOpen,
  ArrowRight,
  Cpu,
  Search,
  GitCompare,
  ShieldCheck,
  TrendingUp,
  FlaskConical,
  Globe,
  Code,
  Brain,
  Calculator,
  Eye,
} from 'lucide-react';
import styles from './page.module.css';
import { CategoryBadge, SaturationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getFeaturedBenchmarks, getBenchmarkStats, getDistinctCategories } from '@/lib/api/benchmarks';
import { formatCategory, formatScore } from '@/lib/utils/format';
import type { BenchmarkCategory } from '@/lib/types';

export const metadata: Metadata = {
  title: 'BenchAtlas — LLM Benchmark Intelligence Platform',
  description:
    'Research-grade platform for discovering, comparing, and understanding LLM evaluation benchmarks across all capability domains.',
};

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICONS: Partial<Record<BenchmarkCategory, React.ElementType>> = {
  knowledge: BookOpen,
  reasoning: Brain,
  mathematics: Calculator,
  coding: Code,
  'instruction-following': BarChart2,
  multimodal: Eye,
  'vision-language': Eye,
  multilingual: Globe,
  'safety-alignment': ShieldCheck,
  factuality: ShieldCheck,
  'agentic-tool-use': Cpu,
};

const CATEGORY_ORDER: BenchmarkCategory[] = [
  'knowledge', 'reasoning', 'mathematics', 'coding',
  'instruction-following', 'multimodal', 'vision-language',
  'multilingual', 'safety-alignment', 'factuality', 'agentic-tool-use',
];

// ─── Mini score visualization data ───────────────────────────────────────────
const VISUAL_SCORES = [
  { model: 'Claude 3.5 Sonnet', score: 88.3, color: 'var(--chart-2)' },
  { model: 'GPT-4o', score: 87.0, color: 'var(--chart-1)' },
  { model: 'Llama 3.1 405B', score: 86.4, color: 'var(--chart-4)' },
  { model: 'Gemini 1.5 Pro', score: 84.1, color: 'var(--chart-3)' },
  { model: 'Mistral Large 2', score: 81.2, color: 'var(--chart-5)' },
];

export default function HomePage() {
  const featured = getFeaturedBenchmarks();
  const stats = getBenchmarkStats();
  const categories = getDistinctCategories();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={`container ${styles.hero__inner}`}>
          <div className={styles.hero__eyebrow}>
            <FlaskConical size={12} aria-hidden="true" />
            Research Intelligence Platform
          </div>

          <h1 id="hero-heading" className={styles.hero__title}>
            Which benchmark should you <em>trust</em> for what?
          </h1>

          <p className={styles.hero__subtitle}>
            A structured intelligence platform covering every major LLM evaluation benchmark.
            Understand methodology, saturation, contamination risk, score history, and when
            to trust — or distrust — a result.
          </p>

          <div className={styles.hero__actions}>
            <Button variant="primary" size="lg" as="a" href="/benchmarks">
              Explore Benchmarks
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="lg" as="a" href="/leaderboards">
              View Leaderboards
            </Button>
            <Button variant="ghost" size="lg" as="a" href="/compare">
              <GitCompare size={16} aria-hidden="true" />
              Compare Models
            </Button>
          </div>

          {/* Stats bar */}
          <div className={styles.hero__stats} role="list" aria-label="Platform statistics">
            <div className={styles.hero__stat} role="listitem">
              <span className={styles.hero__stat_value}>{stats.total}</span>
              <span className={styles.hero__stat_label}>Benchmarks tracked</span>
            </div>
            <div className={styles.hero__stat} role="listitem">
              <span className={styles.hero__stat_value}>{stats.categories}</span>
              <span className={styles.hero__stat_label}>Capability categories</span>
            </div>
            <div className={styles.hero__stat} role="listitem">
              <span className={styles.hero__stat_value}>{stats.totalScores}</span>
              <span className={styles.hero__stat_label}>Model evaluations indexed</span>
            </div>
            <div className={styles.hero__stat} role="listitem">
              <span className={styles.hero__stat_value}>{stats.saturated}</span>
              <span className={styles.hero__stat_label}>Saturated benchmarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Explorer ──────────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="categories-heading">
        <div className="container">
          <div className={styles.section__header}>
            <div>
              <h2 id="categories-heading" className={styles.section__heading}>
                Browse by capability
              </h2>
              <p className={styles.section__subheading}>
                {categories.length} capability domains covered
              </p>
            </div>
            <Link href="/benchmarks" className={styles.section__link} aria-label="View all benchmarks">
              All benchmarks <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <nav className={styles.categories__grid} aria-label="Benchmark categories">
            {CATEGORY_ORDER.filter((c) => categories.includes(c)).map((cat) => {
              const Icon = CATEGORY_ICONS[cat] ?? BarChart2;
              return (
                <Link
                  key={cat}
                  href={`/benchmarks?category=${cat}`}
                  className={styles.category_card}
                  aria-label={`Browse ${formatCategory(cat)} benchmarks`}
                >
                  <span className={styles.category_card__icon} aria-hidden="true">
                    <Icon size={16} />
                  </span>
                  <div>
                    <div className={styles.category_card__name}>{formatCategory(cat)}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* ── Featured Benchmarks ────────────────────────────────────────── */}
      <section
        className={`${styles.section} ${styles['section--shaded']}`}
        aria-labelledby="featured-heading"
      >
        <div className="container">
          <div className={styles.section__header}>
            <div>
              <h2 id="featured-heading" className={styles.section__heading}>
                Landmark benchmarks
              </h2>
              <p className={styles.section__subheading}>
                The most widely cited evaluations in the field
              </p>
            </div>
            <Link href="/benchmarks" className={styles.section__link}>
              All {stats.total} benchmarks <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.featured__grid} role="list">
            {featured.map((benchmark) => (
              <article key={benchmark.id} role="listitem">
                <Link href={`/benchmarks/${benchmark.slug}`} className={styles.bench_card}>
                  {/* Header */}
                  <div className={styles.bench_card__header}>
                    <CategoryBadge category={benchmark.category} />
                    {benchmark.abbreviation && (
                      <span className={styles.bench_card__abbr}>{benchmark.abbreviation}</span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className={styles.bench_card__name}>{benchmark.name}</h3>
                    <p className={styles.bench_card__purpose}>{benchmark.purpose}</p>
                  </div>

                  {/* Meta grid */}
                  <div className={styles.bench_card__meta}>
                    {benchmark.topScore != null && (
                      <div className={styles.bench_card__meta_item}>
                        <span className={styles.bench_card__meta_label}>Top score</span>
                        <span className={styles.bench_card__meta_value}>
                          {formatScore(benchmark.topScore)}
                        </span>
                      </div>
                    )}
                    {benchmark.humanBaseline != null && (
                      <div className={styles.bench_card__meta_item}>
                        <span className={styles.bench_card__meta_label}>Human baseline</span>
                        <span className={styles.bench_card__meta_value}>
                          {formatScore(benchmark.humanBaseline)}
                        </span>
                      </div>
                    )}
                    {benchmark.datasetSizeLabel && (
                      <div className={styles.bench_card__meta_item}>
                        <span className={styles.bench_card__meta_label}>Dataset</span>
                        <span className={styles.bench_card__meta_value}>
                          {benchmark.datasetSizeLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer badges */}
                  <div className={styles.bench_card__footer}>
                    <SaturationBadge status={benchmark.saturationStatus} />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is BenchAtlas ─────────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="about-heading">
        <div className="container">
          <div className={styles.explainer}>
            {/* Text */}
            <div>
              <h2 id="about-heading" className={styles.explainer__title}>
                Not just a leaderboard.
                <br />A research instrument.
              </h2>
              <p className={styles.explainer__body}>
                Most benchmark leaderboards show you a number. BenchAtlas shows you
                what the number <em>means</em> — its methodology, its limitations,
                its contamination risk, and whether it still discriminates between models.
              </p>
              <p className={styles.explainer__body}>
                Every benchmark profile documents saturation status, data leakage risks,
                known criticisms, methodology details, and which evaluation tasks it is —
                and is not — suited for.
              </p>

              <div className={styles.explainer__features}>
                {[
                  {
                    icon: Search,
                    title: 'Methodology transparency',
                    desc: 'Understand exactly how each benchmark was constructed and scored.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Score history & trends',
                    desc: 'Track performance evolution over time across model releases.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Saturation & contamination flags',
                    desc: 'Know when a benchmark is no longer discriminative or trustworthy.',
                  },
                  {
                    icon: GitCompare,
                    title: 'Cross-benchmark comparison',
                    desc: 'Choose the right benchmark for your specific evaluation task.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className={styles.explainer__feature}>
                    <span className={styles.explainer__feature_icon} aria-hidden="true">
                      <Icon size={16} />
                    </span>
                    <div>
                      <h4 className={styles.explainer__feature_title}>{title}</h4>
                      <p className={styles.explainer__feature_desc}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual panel — mini score display */}
            <div
              className={styles.visual_panel}
              role="img"
              aria-label="Example model scores on MMLU benchmark"
            >
              <p className={styles.visual_panel__title}>MMLU — 5-shot accuracy</p>

              {VISUAL_SCORES.map(({ model, score, color }) => (
                <div key={model} className={styles.score_row}>
                  <div className={styles.score_row__header}>
                    <span className={styles.score_row__model}>{model}</span>
                    <span className={styles.score_row__score}>{score.toFixed(1)}%</span>
                  </div>
                  <div className={styles.score_row__bar}>
                    <div
                      className={styles.score_row__fill}
                      style={{
                        width: `${score}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              ))}

              <p className={styles.visual_caption}>
                Illustrative — hover any benchmark for full score history
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

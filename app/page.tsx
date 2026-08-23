import type { Metadata } from 'next';
import Link from 'next/link';
import type { ElementType } from 'react';
import {
  BarChart2, BookOpen, ArrowRight, Cpu,
  GitCompare, ShieldCheck,
  Globe, Code, Brain, Calculator, Eye,
} from 'lucide-react';
import styles from './page.module.css';
import { CategoryBadge, SaturationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getFeaturedBenchmarks, getBenchmarkStats, getDistinctCategories } from '@/lib/api/benchmarks';
import { formatCategory, formatScore } from '@/lib/utils/format';
import type { BenchmarkCategory } from '@/lib/types';

import { NeuralNetCanvasClient } from '@/components/ui/NeuralNetCanvas/NeuralNetCanvasClient';

export const metadata: Metadata = {
  title: 'BenchAtlas — LLM Benchmark Intelligence Platform',
  description: 'Research-grade platform for discovering, comparing, and understanding LLM evaluation benchmarks across all capability domains.',
};

const CATEGORY_ICONS: Partial<Record<BenchmarkCategory, ElementType>> = {
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

const VISUAL_SCORES = [
  { model: 'Claude 3.5 Sonnet', score: 88.3 },
  { model: 'GPT-4o',            score: 87.0 },
  { model: 'Llama 3.1 405B',    score: 86.4 },
  { model: 'Gemini 1.5 Pro',    score: 84.1 },
  { model: 'Mistral Large 2',   score: 81.2 },
];

export default function HomePage() {
  const featured   = getFeaturedBenchmarks();
  const stats      = getBenchmarkStats();
  const categories = getDistinctCategories();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <NeuralNetCanvasClient />
        <div className={`container ${styles.hero__inner}`}>
          <div className={styles.hero__content}>
            <p className={styles.hero__label}>
              Research Intelligence Platform
            </p>

            <h1 id="hero-heading" className={styles.hero__title}>
              Which benchmark should you <em>trust</em> for what?
            </h1>

            <p className={styles.hero__subtitle}>
              Structured intelligence covering every major LLM evaluation benchmark.
              Understand methodology, saturation, contamination risk, and score history.
            </p>

            <div className={styles.hero__actions}>
              <Button variant="primary" size="lg" as="a" href="/benchmarks">
                Explore Benchmarks
                <ArrowRight size={14} aria-hidden="true" />
              </Button>
              <Button variant="secondary" size="lg" as="a" href="/compare">
                <GitCompare size={14} aria-hidden="true" />
                Compare Models
              </Button>
            </div>

            <div className={styles.hero__stats} role="list" aria-label="Platform statistics">
              <div className={styles.hero__stat} role="listitem">
                <span className={styles.hero__stat_value}>{stats.total}</span>
                <span className={styles.hero__stat_label}>Benchmarks</span>
              </div>
              <div className={styles.hero__stat} role="listitem">
                <span className={styles.hero__stat_value}>{stats.categories}</span>
                <span className={styles.hero__stat_label}>Capabilities</span>
              </div>
              <div className={styles.hero__stat} role="listitem">
                <span className={styles.hero__stat_value}>{stats.totalScores}</span>
                <span className={styles.hero__stat_label}>Evaluations</span>
              </div>
              <div className={styles.hero__stat} role="listitem">
                <span className={styles.hero__stat_value}>{stats.saturated}</span>
                <span className={styles.hero__stat_label}>Saturated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="categories-heading">
        <div className="container">
          <div className={styles.section__header}>
            <div>
              <p className={styles.section__label}>Explore by domain</p>
              <h2 id="categories-heading" className={styles.section__heading}>
                Capability categories
              </h2>
            </div>
            <Link href="/benchmarks" className={styles.section__link}>
              All {stats.total} benchmarks <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>

          <nav className={styles.categories__list} aria-label="Benchmark categories">
            {CATEGORY_ORDER.filter((c) => categories.includes(c)).map((cat) => {
              const Icon = CATEGORY_ICONS[cat] ?? BarChart2;
              return (
                <Link
                  key={cat}
                  href={`/benchmarks?category=${cat}`}
                  className={styles.category_tag}
                  aria-label={`Browse ${formatCategory(cat)} benchmarks`}
                >
                  <span className={styles.category_tag__icon} aria-hidden="true">
                    <Icon size={13} />
                  </span>
                  {formatCategory(cat)}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* ── Featured Benchmarks ─────────────────────────────────── */}
      <section
        className={`${styles.section} ${styles['section--shaded']}`}
        aria-labelledby="featured-heading"
      >
        <div className="container">
          <div className={styles.section__header}>
            <div>
              <p className={styles.section__label}>Landmark evaluations</p>
              <h2 id="featured-heading" className={styles.section__heading}>
                Most cited benchmarks
              </h2>
            </div>
            <Link href="/benchmarks" className={styles.section__link}>
              Browse all <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.bench_table} role="table" aria-label="Featured benchmarks">
            <div className={styles.bench_table_head} role="row" aria-hidden="true">
              <span className={styles.bench_table_head_cell}>Benchmark</span>
              <span className={styles.bench_table_head_cell}>Category</span>
              <span className={styles.bench_table_head_cell}>Top score</span>
              <span className={styles.bench_table_head_cell}>Human baseline</span>
              <span className={styles.bench_table_head_cell}>Status</span>
            </div>
            {featured.map((b) => (
              <Link
                key={b.id}
                href={`/benchmarks/${b.slug}`}
                className={styles.bench_table_row}
                role="row"
              >
                <div className={styles.bench_row__name}>
                  <span className={styles.bench_row__title}>{b.name}</span>
                  {b.abbreviation && (
                    <span className={styles.bench_row__abbr}>{b.abbreviation}</span>
                  )}
                </div>
                <div>
                  <CategoryBadge category={b.category} size="sm" />
                </div>
                <div>
                  {b.topScore != null ? (
                    <span className={styles.bench_row__score}>{formatScore(b.topScore)}</span>
                  ) : (
                    <span className={styles.bench_row__score_empty}>—</span>
                  )}
                </div>
                <div>
                  {b.humanBaseline != null ? (
                    <span className={styles.bench_row__score}>{formatScore(b.humanBaseline)}</span>
                  ) : (
                    <span className={styles.bench_row__score_empty}>—</span>
                  )}
                </div>
                <div>
                  <SaturationBadge status={b.saturationStatus} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / Explainer ──────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="about-heading">
        <div className="container">
          <div className={styles.explainer}>
            {/* Text column */}
            <div>
              <p className={styles.explainer__label}>Why BenchAtlas</p>
              <h2 id="about-heading" className={styles.explainer__title}>
                Not just a leaderboard.{' '}
                <br />A research instrument.
              </h2>
              <p className={styles.explainer__body}>
                Most benchmark leaderboards show you a number. BenchAtlas shows you
                what the number <em>means</em> — its methodology, its limitations,
                its contamination risk, and whether it still discriminates between models.
              </p>

              <div className={styles.explainer__feature_list}>
                {[
                  {
                    title: 'Methodology transparency',
                    desc: 'Understand exactly how each benchmark was constructed and scored.',
                  },
                  {
                    title: 'Score history & trends',
                    desc: 'Track performance evolution across model releases.',
                  },
                  {
                    title: 'Saturation & contamination flags',
                    desc: 'Know when a benchmark is no longer discriminative or trustworthy.',
                  },
                  {
                    title: 'Cross-benchmark comparison',
                    desc: 'Choose the right benchmark for your evaluation task.',
                  },
                ].map(({ title, desc }, i) => (
                  <div key={title} className={styles.explainer__feature}>
                    <span className={styles.explainer__feature_num}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className={styles.explainer__feature_title}>{title}</h4>
                      <p className={styles.explainer__feature_desc}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual panel */}
            <div
              className={styles.visual_panel}
              role="img"
              aria-label="Example model scores on MMLU benchmark"
            >
              <div className={styles.visual_panel__header}>
                <p className={styles.visual_panel__title}>MMLU — 5-shot accuracy</p>
              </div>
              <div className={styles.visual_panel__body}>
                {VISUAL_SCORES.map(({ model, score }) => (
                  <div key={model} className={styles.score_row}>
                    <div className={styles.score_row__left}>
                      <span className={styles.score_row__model}>{model}</span>
                      <div className={styles.score_row__bar}>
                        <div
                          className={styles.score_row__fill}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                    <span className={styles.score_row__score}>{score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
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

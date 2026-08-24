import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Database,
  Trophy,
  Zap,
} from 'lucide-react';
import { ScoreBarChart } from '@/components/charts/ScoreBarChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { DatasetExplorer } from '@/components/ui/DatasetExplorer';
import styles from './page.module.css';
import {
  CategoryBadge,
  SaturationBadge,
  ContaminationBadge,
  Badge,
} from '@/components/ui/Badge';
import { getBenchmarkBySlug, getBenchmarks } from '@/lib/api/benchmarks';
import {
  formatScore,
  formatDate,
  formatTaskFormat,
  formatSaturationStatus,
  formatContaminationRisk,
} from '@/lib/utils/format';
import type { Benchmark, BenchmarkLimitation } from '@/lib/types';

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getBenchmarks().map((b) => ({ slug: b.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const benchmark = getBenchmarkBySlug(slug);
  if (!benchmark) return { title: 'Benchmark not found' };

  return {
    title: `${benchmark.name} (${benchmark.abbreviation ?? benchmark.id}) — BenchAtlas`,
    description: benchmark.purpose,
    openGraph: {
      title: `${benchmark.name} — BenchAtlas`,
      description: benchmark.purpose,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BenchmarkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const benchmark = getBenchmarkBySlug(slug);
  if (!benchmark) notFound();

  const topScores = [...benchmark.scores].sort((a, b) => b.score - a.score).slice(0, 8);
  const maxScore = topScores[0]?.score ?? 100;

  const isSaturated = benchmark.saturationStatus === 'saturated';
  const isHighContamination = benchmark.contaminationRisk === 'high';

  return (
    <div className={styles.page}>
      <div className="container">
        {/* ── Breadcrumb ────────────────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.breadcrumb__sep} aria-hidden="true">
            <ChevronRight size={12} />
          </span>
          <Link href="/benchmarks">Benchmarks</Link>
          <span className={styles.breadcrumb__sep} aria-hidden="true">
            <ChevronRight size={12} />
          </span>
          <span aria-current="page">{benchmark.abbreviation ?? benchmark.name}</span>
        </nav>

        <div className={styles.layout}>
          {/* ═══════════════════════════════════════════════════════════
              MAIN CONTENT
          ═══════════════════════════════════════════════════════════ */}
          <article>
            {/* ── Header ───────────────────────────────────────────── */}
            <header className={styles.article_header}>
              <p className={styles.article_category}>
                {benchmark.category.toUpperCase()}
              </p>

              <h1 className={styles.article_title}>{benchmark.name}</h1>

              <div className={styles.article_status_row}>
                <CategoryBadge category={benchmark.category} />
                <SaturationBadge status={benchmark.saturationStatus} />
                <ContaminationBadge risk={benchmark.contaminationRisk} />
                {benchmark.paper?.venue && (
                  <Badge variant="default" size="sm">
                    {benchmark.paper.venue}
                  </Badge>
                )}
              </div>

              <p className={styles.article_tagline}>{benchmark.purpose}</p>

              {benchmark.latestUpdate && (
                <p className={styles.article_updated}>
                  last updated {benchmark.latestUpdate}
                </p>
              )}
            </header>

            {/* ── Score summary bar ────────────────────────────────── */}
            <div className={styles.score_summary} role="region" aria-label="Key statistics">
              {benchmark.topScore != null && (
                <div className={styles.score_summary__item}>
                  <span className={styles.score_summary__label}>Top score</span>
                  <span className={styles.score_summary__value}>
                    {formatScore(benchmark.topScore)}
                  </span>
                  {benchmark.topScoringModel && (
                    <span className={styles.score_summary__sub}>{benchmark.topScoringModel}</span>
                  )}
                </div>
              )}
              {benchmark.humanBaseline != null && (
                <div className={styles.score_summary__item}>
                  <span className={styles.score_summary__label}>Human baseline</span>
                  <span className={styles.score_summary__value}>
                    {formatScore(benchmark.humanBaseline)}
                  </span>
                  <span className={styles.score_summary__sub}>expert level</span>
                </div>
              )}
              {benchmark.randomBaseline != null && (
                <div className={styles.score_summary__item}>
                  <span className={styles.score_summary__label}>Chance level</span>
                  <span className={styles.score_summary__value}>
                    {formatScore(benchmark.randomBaseline)}
                  </span>
                  <span className={styles.score_summary__sub}>random</span>
                </div>
              )}
              <div className={styles.score_summary__item}>
                <span className={styles.score_summary__label}>Models evaluated</span>
                <span className={styles.score_summary__value}>{benchmark.scores.length}</span>
                <span className={styles.score_summary__sub}>indexed</span>
              </div>
              {benchmark.datasetSizeLabel && (
                <div className={styles.score_summary__item}>
                  <span className={styles.score_summary__label}>Dataset</span>
                  <span className={styles.score_summary__value} style={{ fontSize: 'var(--text-xl)' }}>
                    {benchmark.datasetSizeLabel.split(' ')[0]}
                  </span>
                  <span className={styles.score_summary__sub}>{benchmark.datasetSizeLabel.split(' ').slice(1).join(' ')}</span>
                </div>
              )}
            </div>

            {/* ── Saturation / contamination warnings ──────────────── */}
            {isSaturated && (
              <div
                className={`${styles.warning_box} ${styles.warning_box_danger}`}
                role="alert"
                aria-label="Saturation warning"
              >
                <p className={styles.warning_box__title}>
                  <AlertTriangle size={14} aria-hidden="true" />
                  Benchmark saturated
                </p>
                <p className={styles.warning_box__desc}>
                  Frontier models consistently score above {benchmark.saturationThreshold ?? 90}%,
                  approaching or exceeding human performance. This benchmark no longer reliably
                  differentiates between strong models. Consider using a harder alternative.
                </p>
              </div>
            )}

            {isHighContamination && !isSaturated && (
              <div className={styles.warning_box} role="alert" aria-label="Contamination warning">
                <p className={styles.warning_box__title}>
                  <ShieldAlert size={14} aria-hidden="true" />
                  High contamination risk
                </p>
                <p className={styles.warning_box__desc}>
                  {benchmark.dataLeakageNotes ?? 'This benchmark has a high risk of training data contamination. Scores may be inflated.'}
                </p>
              </div>
            )}

            {/* ── Overview ─────────────────────────────────────────── */}
            <section
              className={styles.detail_section}
              aria-labelledby="overview-heading"
            >
              <h2 id="overview-heading" className={styles.section_title}>
                Overview
              </h2>
              <div className={styles.prose}>
                <p>{benchmark.description}</p>
              </div>

              {benchmark.exampleQuestions && benchmark.exampleQuestions.length > 0 && (
                <div style={{ marginTop: 'var(--space-12)' }}>
                  <DatasetExplorer 
                    questions={benchmark.exampleQuestions} 
                    benchmarkName={benchmark.name} 
                  />
                </div>
              )}
            </section>

            {/* ── Timeline ─────────────────────────────────────────── */}
            {topScores.length > 0 && (
              <section
                className={styles.detail_section}
                aria-labelledby="timeline-heading"
              >
                <h2 id="timeline-heading" className={styles.section_title}>
                  Performance timeline
                </h2>
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <TimelineChart 
                    data={topScores.map(s => ({
                      date: s.scoredAt,
                      event: s.modelName,
                      description: s.isOfficial ? 'Official report' : 'Independent evaluation',
                      score: s.score,
                      modelId: s.modelId
                    }))} 
                    height={300} 
                  />
                </div>
              </section>
            )}

            {/* ── Model Scores ──────────────────────────────────────── */}
            {topScores.length > 0 && (
              <section
                className={styles.detail_section}
                aria-labelledby="scores-heading"
              >
                <h2 id="scores-heading" className={styles.section_title}>
                  Model performance
                </h2>
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <ScoreBarChart data={topScores} height={350} />
                </div>
                <div style={{ overflow: 'auto', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                  <table className={styles.score_table}>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Model</th>
                        <th scope="col">Score</th>
                        <th scope="col" className={styles.score_bar_cell}>Bar</th>
                        <th scope="col">Shots</th>
                        <th scope="col">Date</th>
                        <th scope="col">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topScores.map((score, i) => (
                        <tr key={`${score.modelId}-${score.scoredAt}`}>
                          <td className={styles.score_rank}>{i + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              {score.modelName}
                              {score.isOfficial && (
                                <span className={styles.score_official} title="Officially reported score">
                                  <CheckCircle2 size={10} aria-hidden="true" />
                                  official
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-quaternary)' }}>
                              {score.modelFamily}
                            </div>
                          </td>
                          <td className={styles.score_value}>
                            {formatScore(score.score)}
                          </td>
                          <td className={styles.score_bar_cell}>
                            <div className={styles.score_bar}>
                              <div
                                className={styles.score_bar__fill}
                                style={{ width: `${(score.score / maxScore) * 100}%` }}
                              />
                            </div>
                          </td>
                          <td className={styles.score_source}>
                            {score.shots != null ? `${score.shots}-shot` : '—'}
                          </td>
                          <td className={styles.score_source}>{score.scoredAt}</td>
                          <td className={styles.score_source}>
                            {score.source ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Human baseline reference */}
                {benchmark.humanBaseline != null && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-quaternary)', marginTop: 'var(--space-3)' }}>
                    Human expert baseline: {formatScore(benchmark.humanBaseline)}
                    {benchmark.randomBaseline != null && ` · Random chance: ${formatScore(benchmark.randomBaseline)}`}
                  </p>
                )}
              </section>
            )}

            {/* ── Methodology ───────────────────────────────────────── */}
            <section
              className={styles.detail_section}
              aria-labelledby="methodology-heading"
            >
              <h2 id="methodology-heading" className={styles.section_title}>
                Methodology
              </h2>
              <div className={styles.prose}>
                <p>{benchmark.methodology}</p>
                {benchmark.constructionMethod && (
                  <p><strong>Construction:</strong> {benchmark.constructionMethod}</p>
                )}
                {benchmark.annotationProcess && (
                  <p><strong>Annotation:</strong> {benchmark.annotationProcess}</p>
                )}
              </div>
            </section>

            {/* ── Limitations ───────────────────────────────────────── */}
            {benchmark.limitations.length > 0 && (
              <section
                className={styles.detail_section}
                aria-labelledby="limitations-heading"
              >
                <h2 id="limitations-heading" className={styles.section_title}>
                  Known limitations
                </h2>
                <div className={styles.limitations_list}>
                  {benchmark.limitations.map((lim) => (
                    <LimitationItem key={lim.title} limitation={lim} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Known criticisms ──────────────────────────────────── */}
            {benchmark.criticisms && benchmark.criticisms.length > 0 && (
              <section
                className={styles.detail_section}
                aria-labelledby="criticisms-heading"
              >
                <h2 id="criticisms-heading" className={styles.section_title}>
                  Known criticisms
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 'var(--space-4)', listStyleType: 'disc' }}>
                  {benchmark.criticisms.map((c, i) => (
                    <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{c}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── Use cases ─────────────────────────────────────────── */}
            <section
              className={styles.detail_section}
              aria-labelledby="usecases-heading"
            >
              <h2 id="usecases-heading" className={styles.section_title}>
                Use cases
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--color-status-healthy)', marginBottom: 'var(--space-3)' }}>
                    ✓ Recommended for
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {benchmark.recommendedUseCases.map((u, i) => (
                      <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', lineHeight: 'var(--leading-relaxed)' }}>
                        <span style={{ color: 'var(--color-status-healthy)', flexShrink: 0, marginTop: '2px' }}>·</span>
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--color-status-danger)', marginBottom: 'var(--space-3)' }}>
                    ✗ Not recommended for
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {benchmark.notRecommendedFor.map((u, i) => (
                      <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', lineHeight: 'var(--leading-relaxed)' }}>
                        <span style={{ color: 'var(--color-status-danger)', flexShrink: 0, marginTop: '2px' }}>·</span>
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ── Example questions ─────────────────────────────────── */}
            {benchmark.exampleQuestions && benchmark.exampleQuestions.length > 0 && (
              <section
                className={styles.detail_section}
                aria-labelledby="examples-heading"
              >
                <h2 id="examples-heading" className={styles.section_title}>
                  Example questions
                </h2>
                {benchmark.exampleQuestions.map((q, i) => (
                  <div key={i} className={styles.example_question}>
                    {q.subject && (
                      <p className={styles.example_meta}>Subject: {q.subject}</p>
                    )}
                    <pre className={styles.example_q}>{q.question}</pre>
                    {q.choices && (
                      <div className={styles.example_choices}>
                        {q.choices.map((choice, ci) => (
                          <div
                            key={ci}
                            className={[
                              styles.example_choice,
                              q.answer && choice.startsWith(q.answer)
                                ? styles['example_choice--correct']
                                : '',
                            ].filter(Boolean).join(' ')}
                          >
                            {choice}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* ── Related benchmarks ────────────────────────────────── */}
            {benchmark.relations && benchmark.relations.length > 0 && (
              <section
                className={styles.detail_section}
                aria-labelledby="related-heading"
              >
                <h2 id="related-heading" className={styles.section_title}>
                  Related benchmarks
                </h2>
                <div className={styles.related_list}>
                  {benchmark.relations.map((relation) => (
                    <Link
                      key={relation.slug}
                      href={`/benchmarks/${relation.slug}`}
                      className={styles.related_chip}
                    >
                      <span className={styles.related_chip_type}>{relation.type.replace(/-/g, ' ')}</span>
                      <span>{relation.slug}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── External links ────────────────────────────────────── */}
            <section
              className={styles.detail_section}
              aria-labelledby="links-heading"
            >
              <h2 id="links-heading" className={styles.section_title}>
                External resources
              </h2>
              <div className={styles.links_list}>
                {benchmark.paper && (
                  <a
                    href={benchmark.paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ext_link}
                  >
                    <span className={styles.ext_link__label}>
                      <BookOpen size={10} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Paper
                    </span>
                    <span className={styles.ext_link__url}>{benchmark.paper.venue ?? 'arXiv'} {benchmark.paper.year}</span>
                  </a>
                )}
                {benchmark.datasetUrl && (
                  <a
                    href={benchmark.datasetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ext_link}
                  >
                    <span className={styles.ext_link__label}>
                      <Database size={10} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Dataset
                    </span>
                    <span className={styles.ext_link__url}>HuggingFace Hub</span>
                  </a>
                )}
                {benchmark.repositoryUrl && (
                  <a
                    href={benchmark.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ext_link}
                  >
                    <span className={styles.ext_link__label}>
                      <ExternalLink size={10} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Repository
                    </span>
                    <span className={styles.ext_link__url}>GitHub</span>
                  </a>
                )}
                {benchmark.leaderboardUrl && (
                  <a
                    href={benchmark.leaderboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ext_link}
                  >
                    <span className={styles.ext_link__label}>
                      <Trophy size={10} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Leaderboard
                    </span>
                    <span className={styles.ext_link__url}>Official leaderboard</span>
                  </a>
                )}
                {benchmark.evaluationHarnesses.map((harness) => (
                  <div key={harness} className={styles.ext_link}>
                    <span className={styles.ext_link__label}>
                      <Zap size={10} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Eval harness
                    </span>
                    <span className={styles.ext_link__url}>{harness}</span>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* ═══════════════════════════════════════════════════════════
              SIDEBAR — IDENTITY + METRIC panels (BenchWiki-style)
          ═══════════════════════════════════════════════════════════ */}
          <aside className={styles.sidebar} aria-label="Benchmark metadata">

            {/* IDENTITY panel */}
            <div className={styles.sidebar_panel}>
              <div className={styles.sidebar_panel__header}>
                <h2 className={styles.sidebar_panel__title}>Identity</h2>
              </div>
              <div className={styles.sidebar_rows}>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Launch</span>
                  <span className={styles.sidebar_row__value}>{benchmark.launchDate}</span>
                </div>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Capability</span>
                  <span className={styles.sidebar_row__value} style={{ color: 'var(--color-accent)' }}>
                    {benchmark.category}
                  </span>
                </div>
                {benchmark.subcategories.length > 0 && (
                  <div className={styles.sidebar_row}>
                    <span className={styles.sidebar_row__label}>Also covers</span>
                    <span className={styles.sidebar_row__value} style={{ color: 'var(--color-accent)' }}>
                      {benchmark.subcategories.slice(0, 2).join(', ')}
                    </span>
                  </div>
                )}
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Maintainer</span>
                  <span className={styles.sidebar_row__value}>
                    {benchmark.maintainerUrl ? (
                      <a href={benchmark.maintainerUrl} target="_blank" rel="noopener noreferrer">
                        {benchmark.maintainer}
                      </a>
                    ) : benchmark.maintainer}
                  </span>
                </div>
                {benchmark.organization && benchmark.organization !== benchmark.maintainer && (
                  <div className={styles.sidebar_row}>
                    <span className={styles.sidebar_row__label}>Organization</span>
                    <span className={styles.sidebar_row__value}>{benchmark.organization}</span>
                  </div>
                )}
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>License</span>
                  <span className={styles.sidebar_row__value}>{benchmark.license}</span>
                </div>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Languages</span>
                  <span className={styles.sidebar_row__value}>{benchmark.languages.join(', ')}</span>
                </div>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Modalities</span>
                  <span className={styles.sidebar_row__value}>{benchmark.modalities.join(', ')}</span>
                </div>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Task format</span>
                  <span className={styles.sidebar_row__value}>{formatTaskFormat(benchmark.taskFormat)}</span>
                </div>
                {benchmark.shots && (
                  <div className={styles.sidebar_row}>
                    <span className={styles.sidebar_row__label}>Shots</span>
                    <span className={styles.sidebar_row__value}>{benchmark.shots}</span>
                  </div>
                )}
              </div>
            </div>

            {/* METRIC panel */}
            <div className={styles.sidebar_panel}>
              <div className={styles.sidebar_panel__header}>
                <h2 className={styles.sidebar_panel__title}>Metric</h2>
              </div>
              <div className={styles.sidebar_rows}>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Primary</span>
                  <span className={styles.sidebar_row__value}>{benchmark.evaluationMetric}</span>
                </div>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Scoring</span>
                  <span className={styles.sidebar_row__value}>{benchmark.evaluationProtocol}</span>
                </div>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Method</span>
                  <span className={styles.sidebar_row__value}>{benchmark.scoringMethod}</span>
                </div>
                {benchmark.humanBaseline != null && (
                  <div className={styles.sidebar_row}>
                    <span className={styles.sidebar_row__label}>Human</span>
                    <span className={styles.sidebar_row__value}>{formatScore(benchmark.humanBaseline)}</span>
                  </div>
                )}
                {benchmark.randomBaseline != null && (
                  <div className={styles.sidebar_row}>
                    <span className={styles.sidebar_row__label}>Chance</span>
                    <span className={styles.sidebar_row__value}>{formatScore(benchmark.randomBaseline)}</span>
                  </div>
                )}
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Dataset</span>
                  <span className={styles.sidebar_row__value}>{benchmark.datasetSizeLabel ?? '—'}</span>
                </div>
                {benchmark.datasetSplit && (
                  <div className={styles.sidebar_row}>
                    <span className={styles.sidebar_row__label}>Split</span>
                    <span className={styles.sidebar_row__value} style={{ fontSize: 'var(--text-xs)' }}>
                      {benchmark.datasetSplit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS panel */}
            <div className={styles.sidebar_panel}>
              <div className={styles.sidebar_panel__header}>
                <h2 className={styles.sidebar_panel__title}>Status</h2>
              </div>
              <div className={styles.sidebar_rows}>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Saturation</span>
                  <span className={styles.sidebar_row__value}>
                    <SaturationBadge status={benchmark.saturationStatus} />
                  </span>
                </div>
                <div className={styles.sidebar_row}>
                  <span className={styles.sidebar_row__label}>Contamination</span>
                  <span className={styles.sidebar_row__value}>
                    <ContaminationBadge risk={benchmark.contaminationRisk} />
                  </span>
                </div>
                {benchmark.saturationThreshold && (
                  <div className={styles.sidebar_row}>
                    <span className={styles.sidebar_row__label}>Threshold</span>
                    <span className={styles.sidebar_row__value}>{formatScore(benchmark.saturationThreshold)}</span>
                  </div>
                )}
                {benchmark.dataLeakageNotes && (
                  <div className={styles.sidebar_row} style={{ gridTemplateColumns: '1fr' }}>
                    <span className={styles.sidebar_row__label}>Leakage notes</span>
                    <span className={styles.sidebar_row__value} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'left', marginTop: 'var(--space-1)' }}>
                      {benchmark.dataLeakageNotes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Paper panel */}
            {benchmark.paper && (
              <div className={styles.sidebar_panel}>
                <div className={styles.sidebar_panel__header}>
                  <h2 className={styles.sidebar_panel__title}>Paper</h2>
                </div>
                <div className={styles.sidebar_rows}>
                  <div className={styles.sidebar_row} style={{ gridTemplateColumns: '1fr' }}>
                    <a
                      href={benchmark.paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 'var(--weight-medium)', lineHeight: 'var(--leading-snug)' }}
                    >
                      {benchmark.paper.title} ↗
                    </a>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-quaternary)', marginTop: 'var(--space-1)' }}>
                      {benchmark.paper.authors && benchmark.paper.authors.length > 0 && (
                        <>
                          {benchmark.paper.authors.slice(0, 3).join(', ')}
                          {benchmark.paper.authors.length > 3 ? ' et al.' : ''}
                          {' · '}
                        </>
                      )}
                      {benchmark.paper.venue && `${benchmark.paper.venue} · `}
                      {benchmark.paper.year}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Limitation item ──────────────────────────────────────────────────────────

function LimitationItem({ limitation }: { limitation: BenchmarkLimitation }) {
  return (
    <div className={`${styles.limitation_item} ${styles['limitation_item_' + limitation.severity]}`}>
      <span
        className={`${styles.limitation__severity} ${styles['limitation__severity_' + limitation.severity]}`}
        aria-hidden="true"
      />
      <div>
        <p className={styles.limitation__title}>{limitation.title}</p>
        <p className={styles.limitation__desc}>{limitation.description}</p>
      </div>
    </div>
  );
}

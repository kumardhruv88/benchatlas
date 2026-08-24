import { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Research — BenchAtlas',
  description: 'Deep dives and analysis on AI evaluation, benchmark saturation, and data contamination.',
};

export default function ResearchPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Research & Analysis</h1>
          <p className={styles.subtitle}>
            In-depth analysis of benchmark saturation, data contamination, and the shifting paradigms of AI evaluation methodology.
          </p>
        </header>

        <section className={styles.featured_article}>
          <div className={styles.featured_image_wrapper}>
            <div className={styles.featured_image_placeholder} />
          </div>
          <div className={styles.featured_content}>
            <div className={styles.article_meta}>
              <span>Analysis</span>
              <span>•</span>
              <span>Aug 24, 2026</span>
            </div>
            <Link href="/research/saturation-crisis" className={styles.featured_title}>
              The Benchmark Saturation Crisis
            </Link>
            <p className={styles.featured_excerpt}>
              With o3 and Claude 3.5 Sonnet effectively maximizing scores on traditional benchmarks like MMLU, HumanEval, and GSM8K, the industry faces an evaluation crisis. We examine the shift towards contamination-free continuous evaluation and expert-level olympic reasoning.
            </p>
            <Link href="/research/saturation-crisis" className={styles.read_more}>
              Read full report <span>&rarr;</span>
            </Link>
          </div>
        </section>

        <section className={styles.articles_grid}>
          <article className={styles.article_card}>
            <div className={styles.article_meta}>
              <span>Methodology</span>
              <span>•</span>
              <span>Jul 12, 2026</span>
            </div>
            <Link href="/research/agentic-evaluation" className={styles.article_card_title}>
              Why SWE-Bench and WebArena Matter
            </Link>
            <p className={styles.article_card_excerpt}>
              Moving beyond static multiple-choice questions, agentic benchmarks test real-world software engineering and web navigation. We break down the heavy compute requirements and scaffold-dependency that make these evaluations uniquely challenging.
            </p>
          </article>

          <article className={styles.article_card}>
            <div className={styles.article_meta}>
              <span>Data Contamination</span>
              <span>•</span>
              <span>Jun 05, 2026</span>
            </div>
            <Link href="/research/memorization-vs-reasoning" className={styles.article_card_title}>
              Memorization vs. Reasoning
            </Link>
            <p className={styles.article_card_excerpt}>
              Are frontier models actually reasoning, or simply interpolating memorized training data? Our analysis of LiveCodeBench and adversarial AIME sets reveals the fragile line between true capability and data leakage.
            </p>
          </article>

          <article className={styles.article_card}>
            <div className={styles.article_meta}>
              <span>Opinion</span>
              <span>•</span>
              <span>May 18, 2026</span>
            </div>
            <Link href="/research/end-of-mmlu" className={styles.article_card_title}>
              The End of MMLU
            </Link>
            <p className={styles.article_card_excerpt}>
              For three years, MMLU was the gold standard for comparing general capabilities. With scores clustered at 88-90%, it now serves only to measure the quality of a model's pre-training data mixture, not its reasoning capability.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}

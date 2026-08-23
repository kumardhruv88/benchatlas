import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About — BenchAtlas',
  description: 'Learn about BenchAtlas and our methodology for tracking AI performance.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>About BenchAtlas</h1>
          <p className={styles.subtitle}>
            A professional research database tracking the frontier of artificial intelligence through rigorous benchmark analysis.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              BenchAtlas was created to provide a clear, objective, and comprehensive view of AI capability progress. As models become more capable, the evaluation landscape becomes increasingly fragmented and complex. We aim to cut through the noise with structured data, clear methodologies, and rigorous analysis.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Methodology</h2>
            <p>
              We track both official self-reported scores and independent evaluations. All data points are linked to their source material. We apply strict criteria to identify benchmark saturation and highlight potential data contamination risks, ensuring that researchers can trust the signals they observe.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

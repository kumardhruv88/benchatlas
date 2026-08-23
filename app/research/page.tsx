import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Research — BenchAtlas',
  description: 'Deep dives and analysis on AI evaluation and benchmarking.',
};

export default function ResearchPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Research & Analysis</h1>
          <p className={styles.subtitle}>
            In-depth analysis of benchmark saturation, data contamination, and evaluation methodologies.
          </p>
        </header>
        
        <div className={styles.content}>
          <div className={styles.placeholder_box}>
            <p>Research publications and reports will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

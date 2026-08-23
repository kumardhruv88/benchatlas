import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Timeline — BenchAtlas',
  description: 'Chronological timeline of major benchmark releases and AI milestones.',
};

export default function TimelinePage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Evolution of Benchmarks</h1>
          <p className={styles.subtitle}>
            A chronological view of major evaluation milestones and the pace of AI progress.
          </p>
        </header>
        
        <div className={styles.content}>
          <div className={styles.placeholder_box}>
            <p>Interactive timeline visualization coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

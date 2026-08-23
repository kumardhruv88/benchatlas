import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Compare Models — BenchAtlas',
  description: 'Compare AI models across multiple benchmarks.',
};

export default function ComparePage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Model Comparison</h1>
          <p className={styles.subtitle}>
            Select multiple models to compare their performance across the benchmark database.
          </p>
        </header>
        
        <div className={styles.content}>
          <div className={styles.placeholder_box}>
            <p>Comparison tools are currently in development.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

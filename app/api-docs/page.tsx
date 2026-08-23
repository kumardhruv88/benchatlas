import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'API Documentation — BenchAtlas',
  description: 'Documentation for the BenchAtlas API.',
};

export default function ApiDocsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>API Documentation</h1>
          <p className={styles.subtitle}>
            Access the BenchAtlas database programmatically for research and analysis.
          </p>
        </header>
        
        <div className={styles.content}>
          <div className={styles.placeholder_box}>
            <p>API access is currently in closed beta. Documentation will be published soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

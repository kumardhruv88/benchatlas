import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, Info } from 'lucide-react';
import styles from './page.module.css';
import { getBenchmarks } from '@/lib/api/benchmarks';
import type { ContaminationRisk } from '@/lib/types/benchmark';

export const metadata: Metadata = {
  title: 'Data Contamination Matrix — BenchAtlas',
  description: 'Heatmap visualization of data contamination risks across major AI models and benchmarks.',
};

export default function ContaminationPage() {
  const benchmarks = getBenchmarks().filter(b => b.category !== 'safety'); // Filter out safety for this view or keep all
  
  // Extract all unique models
  const modelSet = new Set<string>();
  benchmarks.forEach(b => b.scores.forEach(s => modelSet.add(s.modelName)));
  const allModels = Array.from(modelSet).sort();

  // Helper to get class name based on risk
  const getCellClass = (risk: ContaminationRisk) => {
    switch (risk) {
      case 'low': return styles.cell_low;
      case 'medium': return styles.cell_medium;
      case 'high': return styles.cell_high;
      default: return styles.cell_unknown;
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-status-danger)', marginBottom: 'var(--space-4)' }}>
            <ShieldAlert size={24} />
            <span style={{ fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', fontSize: 'var(--text-sm)' }}>
              Evaluation Integrity
            </span>
          </div>
          <h1 className={styles.title}>The Contamination Matrix</h1>
          <p className={styles.subtitle}>
            A visual heat-map of training data contamination risk. Red indicates a high likelihood that a model was trained on the benchmark's test set, invalidating its score.
          </p>
        </header>
        
        <div className={styles.matrix_container}>
          <table className={styles.matrix_table}>
            <thead>
              <tr>
                <th aria-hidden="true"></th>
                {benchmarks.map(b => (
                  <th key={b.id} className={styles.matrix_th} title={b.name}>
                    <Link href={`/benchmarks/${b.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {b.abbreviation || b.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allModels.map(model => (
                <tr key={model}>
                  <td className={styles.matrix_td_model}>{model}</td>
                  {benchmarks.map(b => {
                    const hasScore = b.scores.some(s => s.modelName === model);
                    // For the sake of the visualization, we apply the benchmark's general contamination risk 
                    // to models that have been evaluated on it. (In a real advanced system, this would be per-model per-benchmark).
                    const risk = hasScore ? b.contaminationRisk : 'unknown';
                    
                    return (
                      <td key={`${model}-${b.id}`}>
                        <div 
                          className={`${styles.matrix_cell} ${getCellClass(risk)}`} 
                          title={`${model} on ${b.name}: ${risk} risk\n${b.dataLeakageNotes || ''}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className={styles.legend}>
            <div className={styles.legend_item}>
              <div className={`${styles.legend_color} ${styles.cell_low}`}></div>
              <span>Low Risk (Clean)</span>
            </div>
            <div className={styles.legend_item}>
              <div className={`${styles.legend_color} ${styles.cell_medium}`}></div>
              <span>Medium Risk (Suspected)</span>
            </div>
            <div className={styles.legend_item}>
              <div className={`${styles.legend_color} ${styles.cell_high}`}></div>
              <span>High Risk (Proven Leakage)</span>
            </div>
            <div className={styles.legend_item}>
              <div className={`${styles.legend_color} ${styles.cell_unknown}`}></div>
              <span>Not Evaluated / Unknown</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-12)', padding: 'var(--space-6)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
          <Info size={24} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
            <strong>Methodology Note:</strong> Contamination risk is currently assessed at the benchmark level based on the prominence of the dataset in open pre-training corpora (e.g., CommonCrawl, GitHub) and published decontamination efforts by model providers. As closed models do not disclose their training mixtures, these are best-effort estimates backed by independent research and n-gram overlap analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

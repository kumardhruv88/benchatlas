import { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import { ALL_BENCHMARKS } from '@/lib/data';
import { formatDate } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Timeline — BenchAtlas',
  description: 'Chronological timeline of major benchmark releases and AI milestones.',
};

interface TimelineItem {
  date: string;
  event: string;
  description?: string;
  benchmarkName: string;
  benchmarkSlug: string;
}

export default function TimelinePage() {
  // Extract all timeline events from all benchmarks and sort chronologically (newest first)
  const allEvents: TimelineItem[] = [];
  
  ALL_BENCHMARKS.forEach(benchmark => {
    if (benchmark.timeline && benchmark.timeline.length > 0) {
      benchmark.timeline.forEach(event => {
        allEvents.push({
          ...event,
          benchmarkName: benchmark.name,
          benchmarkSlug: benchmark.slug,
        });
      });
    }
  });
  
  allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Evolution of Benchmarks</h1>
          <p className={styles.subtitle}>
            A chronological view of major evaluation milestones, benchmark releases, and the pace of frontier AI progress.
          </p>
        </header>
        
        <div className={styles.content}>
          <div className={styles.timeline}>
            {allEvents.map((item, index) => (
              <div key={`${item.benchmarkSlug}-${index}`} className={styles.timeline_item}>
                <div className={styles.timeline_date}>
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className={styles.timeline_node} />
                <div className={styles.timeline_content}>
                  <h3 className={styles.timeline_event}>{item.event}</h3>
                  {item.description && (
                    <p className={styles.timeline_description}>{item.description}</p>
                  )}
                  <Link 
                    href={`/benchmarks/${item.benchmarkSlug}`}
                    className={styles.timeline_benchmark}
                  >
                    {item.benchmarkName} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

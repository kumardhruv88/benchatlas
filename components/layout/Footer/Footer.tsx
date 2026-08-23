import Link from 'next/link';
import { Zap } from 'lucide-react';
import styles from './Footer.module.css';

const PLATFORM_LINKS = [
  { label: 'All Benchmarks', href: '/benchmarks' },
  { label: 'Model Directory', href: '/models' },
  { label: 'Leaderboards', href: '/leaderboards' },
  { label: 'Compare Models', href: '/compare' },
];

const REFERENCE_LINKS = [
  { label: 'Metrics Glossary', href: '/metrics' },
  { label: 'Evaluation Methods', href: '/evaluation-methods' },
  { label: 'Research Insights', href: '/research' },
  { label: 'Timeline', href: '/timeline' },
];

const META_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'API Docs', href: '/api-docs' },
  { label: 'GitHub', href: 'https://github.com/benchtlas' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.footer__inner}`}>
        <div className={styles.footer__grid}>
          {/* Brand */}
          <div className={styles.footer__brand}>
            <Link href="/" className={styles.footer__logo}>
              <span className={styles.footer__logo_mark} aria-hidden="true">
                <Zap size={14} strokeWidth={2.5} />
              </span>
              <span className={styles.footer__wordmark}>
                Bench<span>Atlas</span>
              </span>
            </Link>
            <p className={styles.footer__tagline}>
              A research-grade intelligence platform for LLM benchmark discovery,
              comparison, and evaluation methodology.
            </p>
            <span className={styles.footer__badge}>
              <span className={styles.footer__badge_dot} aria-hidden="true" />
              Open data · No paywalls
            </span>
          </div>

          {/* Platform */}
          <div>
            <p className={styles.footer__section_title}>Platform</p>
            <nav className={styles.footer__links} aria-label="Platform links">
              {PLATFORM_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} className={styles.footer__link}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Reference */}
          <div>
            <p className={styles.footer__section_title}>Reference</p>
            <nav className={styles.footer__links} aria-label="Reference links">
              {REFERENCE_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} className={styles.footer__link}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Meta */}
          <div>
            <p className={styles.footer__section_title}>Meta</p>
            <nav className={styles.footer__links} aria-label="Meta links">
              {META_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} className={styles.footer__link}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.footer__bottom}>
          <p className={styles.footer__copy}>
            © {currentYear} BenchAtlas. Built for the research community.
          </p>
          <div className={styles.footer__bottom_links}>
            <Link href="/about#data-sources" className={styles.footer__bottom_link}>
              Data Sources
            </Link>
            <Link href="/about#methodology" className={styles.footer__bottom_link}>
              Methodology
            </Link>
            <Link href="/about#disclaimer" className={styles.footer__bottom_link}>
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

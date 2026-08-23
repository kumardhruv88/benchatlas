'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2,
  BookOpen,
  Cpu,
  Trophy,
  GitCompare,
  Ruler,
  FlaskConical,
  Clock,
  Search,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import styles from './Navigation.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Benchmarks', href: '/benchmarks', icon: BarChart2 },
  { label: 'Models', href: '/models', icon: Cpu },
  { label: 'Leaderboards', href: '/leaderboards', icon: Trophy },
  { label: 'Compare', href: '/compare', icon: GitCompare },
  { label: 'Metrics', href: '/metrics', icon: Ruler },
  { label: 'Research', href: '/research', icon: FlaskConical },
  { label: 'Timeline', href: '/timeline', icon: Clock },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={[styles.nav, scrolled && styles['nav--scrolled']].filter(Boolean).join(' ')}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className={`container ${styles.nav__inner}`}>
          {/* Brand */}
          <Link href="/" className={styles.nav__brand} aria-label="BenchAtlas home">
            <span className={styles.nav__logo} aria-hidden="true">
              <Zap size={16} strokeWidth={2.5} />
            </span>
            <span className={styles.nav__wordmark}>
              Bench<span>Atlas</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className={styles.nav__links} role="list">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  role="listitem"
                  className={[
                    styles.nav__link,
                    isActive && styles['nav__link--active'],
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className={styles.nav__actions}>
            {/* Search trigger */}
            <button
              className={styles.nav__search_trigger}
              aria-label="Search benchmarks"
              type="button"
            >
              <Search size={14} aria-hidden="true" />
              <span>Search benchmarks…</span>
              <kbd className={styles.nav__search_hint}>⌘K</kbd>
            </button>

            {/* Mobile toggle */}
            <button
              className={styles.nav__mobile_toggle}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              type="button"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={[
          styles.nav__mobile_menu,
          mobileOpen && styles['nav__mobile_menu--open'],
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={[
                styles.nav__mobile_link,
                isActive && styles['nav__mobile_link--active'],
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
        <div className={styles.nav__mobile_divider} />
        <Link href="/about" className={styles.nav__mobile_link}>
          <BookOpen size={18} aria-hidden="true" />
          About
        </Link>
        <Link href="/api-docs" className={styles.nav__mobile_link}>
          <Zap size={18} aria-hidden="true" />
          API
        </Link>
      </div>
    </>
  );
}

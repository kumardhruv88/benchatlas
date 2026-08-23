import React from 'react';
import styles from './Badge.module.css';
import type { BenchmarkCategory, SaturationStatus, ContaminationRisk } from '@/lib/types';
import { formatCategory, formatSaturationStatus, formatContaminationRisk, getCategoryColor } from '@/lib/utils/format';

type BadgeVariant = 'default' | 'accent' | 'healthy' | 'warning' | 'danger' | 'neutral' | 'category';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  style,
}: BadgeProps) {
  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    size !== 'md' && styles[`badge--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} style={style}>
      {dot && <span className={styles.badge__dot} aria-hidden="true" />}
      {children}
    </span>
  );
}

// ─── Semantic Badge helpers ────────────────────────────────────────────────────

export function CategoryBadge({ category, size }: { category: BenchmarkCategory; size?: BadgeSize }) {
  return (
    <Badge
      variant="category"
      size={size}
      style={{ color: getCategoryColor(category) }}
    >
      {formatCategory(category)}
    </Badge>
  );
}

export function SaturationBadge({ status }: { status: SaturationStatus }) {
  const variantMap: Record<SaturationStatus, BadgeVariant> = {
    'not-saturated': 'healthy',
    'approaching-saturation': 'warning',
    saturated: 'danger',
    retired: 'neutral',
  };
  return (
    <Badge variant={variantMap[status]} dot>
      {formatSaturationStatus(status)}
    </Badge>
  );
}

export function ContaminationBadge({ risk }: { risk: ContaminationRisk }) {
  const variantMap: Record<ContaminationRisk, BadgeVariant> = {
    low: 'healthy',
    medium: 'warning',
    high: 'danger',
    unknown: 'neutral',
  };
  return (
    <Badge variant={variantMap[risk]}>
      {formatContaminationRisk(risk)}
    </Badge>
  );
}

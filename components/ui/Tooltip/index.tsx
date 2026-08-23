import React from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  return (
    <div className={styles.tooltip_wrapper}>
      {children}
      <div className={`${styles.tooltip_content} ${styles[position]}`}>
        {content}
        <div className={styles.arrow} />
      </div>
    </div>
  );
}

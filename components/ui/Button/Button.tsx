import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconOnly?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  iconOnly = false,
  className = '',
  disabled,
  as: Tag = 'button',
  href,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    iconOnly && styles['button--icon'],
    loading && styles['button--loading'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (Tag === 'a' && href) {
    return (
      <a className={classes} href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {children}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}

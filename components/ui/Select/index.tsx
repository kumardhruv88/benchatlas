import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className={`${styles.select_wrapper} ${className}`}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className={styles.select_container}>
          <select
            ref={ref}
            className={`${styles.select} ${error ? styles.has_error : ''}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles.icon_wrapper}>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </div>
        {error && <span className={styles.error_message}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

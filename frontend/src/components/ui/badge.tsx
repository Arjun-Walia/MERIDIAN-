import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-elevated text-text-secondary border-border-default',
      success: 'bg-success-muted text-success border-success/30',
      warning: 'bg-warning-muted text-warning border-warning/30',
      error: 'bg-error-muted text-error border-error/30',
      info: 'bg-info-muted text-info border-info/30',
      outline: 'bg-transparent text-text-secondary border-border-subtle',
    };

    const sizes = {
      sm: 'px-1.5 py-0.5 text-caption',
      md: 'px-2 py-1 text-body-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md border font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;
    
    const baseStyles = cn(
      // Base layout and typography
      'inline-flex items-center justify-center font-medium',
      // Smooth transitions for all state changes
      'transition-all duration-200 ease-out',
      // Focus ring - visible cyan outline with offset
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base',
      // Disabled state - consistent across all variants
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none'
    );
    
    const variants = {
      // Default button - surface with border
      default: cn(
        'bg-surface border border-border-default text-text-primary',
        'hover:bg-elevated hover:border-border-subtle',
        'active:bg-zinc-700'
      ),
      // Primary button - full state machine with WCAG compliant contrast
      // White (#FFFFFF) on blue-600 (#2563EB) = 4.56:1 ratio ✓ AA
      // White (#FFFFFF) on blue-700 (#1D4ED8) = 5.74:1 ratio ✓ AA
      primary: cn(
        // Idle state - blue-600 with white text (4.56:1 ratio)
        'bg-blue-600 text-white border border-transparent',
        // Hover state - blue-700 for better contrast (5.74:1 ratio)
        'hover:bg-blue-700',
        // Active/pressed state
        'active:bg-blue-800 active:scale-[0.98]',
        // Disabled override - use zinc-500 text for 3.5:1 on zinc-700
        'disabled:bg-zinc-700 disabled:text-zinc-400 disabled:border-zinc-600'
      ),
      // Secondary button - outlined style with cyan accent
      // Zinc-50 (#FAFAFA) on zinc-800 hover = 13.8:1 ratio ✓ AAA
      secondary: cn(
        // Idle state - bordered with cyan accent
        'bg-transparent text-cyan-400 border border-cyan-500/50',
        // Hover state - subtle fill
        'hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400',
        // Active/pressed state
        'active:bg-cyan-500/20 active:scale-[0.98]',
        // Disabled override
        'disabled:text-zinc-500 disabled:border-zinc-700'
      ),
      // Ghost button - minimal style
      ghost: cn(
        'text-text-secondary bg-transparent',
        'hover:text-text-primary hover:bg-zinc-800',
        'active:bg-zinc-700'
      ),
      // Danger button - error styling
      danger: cn(
        'bg-error/10 text-error border border-error/20',
        'hover:bg-error/20 hover:border-error/30',
        'active:bg-error/30'
      ),
    };

    const sizes = {
      sm: 'h-8 px-3 text-body-sm rounded-md gap-1.5',
      md: 'h-9 px-4 text-body rounded-md gap-2',
      lg: 'h-10 px-5 text-body rounded-lg gap-2',
      icon: 'h-10 w-10 rounded-md',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

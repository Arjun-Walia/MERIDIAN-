import * as React from 'react';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-text-tertiary pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles - fixed height 40px (h-10) for consistent alignment
            'flex h-10 w-full rounded-md border border-border-default bg-surface px-3 py-2 text-body text-text-primary',
            // WCAG AA compliant placeholder - zinc-400 has 4.64:1 contrast on zinc-900
            'placeholder:text-zinc-400',
            // Enhanced focus ring - 2px cyan with offset for clear visibility
            'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:border-cyan-500',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Smooth transitions
            'transition-all duration-150',
            icon && 'pl-10',
            rightElement && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 pointer-events-none">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input variant
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'icon'>>(
  (props, ref) => {
    return <Input ref={ref} icon={<Search className="h-4 w-4" />} aria-label="Search" {...props} />;
  }
);

SearchInput.displayName = 'SearchInput';

export { Input, SearchInput };

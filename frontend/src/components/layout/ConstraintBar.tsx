import * as React from 'react';
import { X, Plus, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface Constraint {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ConstraintBarProps {
  constraints: Constraint[];
  onRemove: (id: string) => void;
  onAddClick: () => void;
}

export function ConstraintBar({ constraints, onRemove, onAddClick }: ConstraintBarProps) {
  return (
    <div className={cn(
      // Compact on mobile, normal on desktop
      'min-h-[44px] sm:min-h-[52px] px-2 sm:px-4 py-1.5 sm:py-2',
      // Row layout with wrap
      'flex flex-row flex-wrap items-center gap-1.5 sm:gap-2'
    )}>
      {/* Filters label - hide on mobile */}
      <div className="hidden sm:flex items-center gap-2 text-text-secondary flex-shrink-0 h-8 sm:h-10">
        <Filter className="w-4 h-4" />
        <span className="text-body-sm font-medium">Filters</span>
      </div>
      
      {/* Filters container with flex-wrap for proper wrapping */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        <AnimatePresence mode="popLayout">
          {constraints.length === 0 ? (
            <motion.span 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-body-sm text-zinc-400 italic h-8 sm:h-10 flex items-center"
              aria-live="polite"
            >
              No active filters
            </motion.span>
          ) : (
            constraints.map((constraint) => (
              <FilterChip 
                key={constraint.id}
                constraint={constraint}
                onRemove={() => onRemove(constraint.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Add Filter button - compact on mobile */}
      <Button 
        variant="default" 
        size="sm"
        onClick={onAddClick}
        className={cn(
          'h-8 sm:h-10 border-dashed hover:border-cyan-500/50 hover:text-cyan-400',
          'flex-shrink-0 px-2 sm:px-3'
        )}
      >
        <Plus className="w-4 h-4 sm:mr-1" />
        <span className="hidden sm:inline">Add Filter</span>
      </Button>
    </div>
  );
}

interface FilterChipProps {
  constraint: Constraint;
  onRemove: () => void;
}

function FilterChip({ constraint, onRemove }: FilterChipProps) {
  const chipRef = React.useRef<HTMLDivElement>(null);

  const formatOperator = (op: string) => {
    const operators: Record<string, string> = {
      'eq': '=',
      'neq': '≠',
      'gt': '>',
      'gte': '≥',
      'lt': '<',
      'lte': '≤',
      'contains': '∋',
      'in': '∈',
    };
    return operators[op] || op;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      onRemove();
    }
  };

  const filterLabel = `${constraint.field} ${formatOperator(constraint.operator)} ${constraint.value}`;

  return (
    <motion.div
      ref={chipRef}
      layout
      initial={{ opacity: 0, scale: 0.8, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -8 }}
      transition={{ 
        duration: 0.2, 
        ease: [0.4, 0, 0.2, 1],
        layout: { duration: 0.15 }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Filter: ${filterLabel}. Press Enter or Delete to remove.`}
      onKeyDown={handleKeyDown}
      className={cn(
        // Base styles - 32px height with 6px/12px padding (py-1.5 px-3)
        'group relative inline-flex items-center gap-2 h-8 py-1.5 pl-3 pr-1',
        'bg-zinc-900/60 backdrop-blur-sm',
        'border border-zinc-700/50 rounded-full',
        // Hover state - subtle highlight
        'hover:bg-zinc-800/80 hover:border-zinc-600',
        // Focus state - visible ring
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base',
        // Transition
        'transition-colors duration-150 cursor-default'
      )}
    >
      {/* Field name - cyan accent */}
      <span className="text-body-sm text-cyan-400 font-medium">
        {constraint.field}
      </span>
      
      {/* Operator - muted */}
      <span className="text-body-sm text-zinc-500">
        {formatOperator(constraint.operator)}
      </span>
      
      {/* Value - bright white */}
      <span className="text-body-sm text-zinc-100 font-medium">
        {constraint.value}
      </span>
      
      {/* Close button - enhanced clickable area */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Remove ${filterLabel} filter`}
        className={cn(
          // Size - 24x24px clickable area
          'relative w-6 h-6 ml-0.5',
          'flex items-center justify-center',
          'rounded-full',
          // Default state
          'text-zinc-500',
          // Hover state - visible background and scale
          'hover:bg-zinc-700 hover:text-zinc-200 hover:scale-110',
          // Focus state
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
          // Active state
          'active:scale-95',
          // Transition
          'transition-all duration-150'
        )}
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </motion.div>
  );
}

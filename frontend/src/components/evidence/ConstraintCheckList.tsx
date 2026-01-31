import * as React from 'react';
import { cn } from '../../lib/utils';
import { Check, X } from 'lucide-react';

export interface ConstraintCheck {
  id: string;
  label: string;
  passed: boolean;
  details?: string;
}

interface ConstraintCheckListProps {
  constraints: ConstraintCheck[];
}

export function ConstraintCheckList({ constraints }: ConstraintCheckListProps) {
  const passedCount = constraints.filter(c => c.passed).length;
  const totalCount = constraints.length;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-text-primary">
          Constraint Checks
        </span>
        <span className={cn(
          'text-caption font-medium',
          passedCount === totalCount ? 'text-success' : 'text-warning'
        )}>
          {passedCount}/{totalCount} passed
        </span>
      </div>
      
      <div className="space-y-1">
        {constraints.map((constraint) => (
          <div
            key={constraint.id}
            className={cn(
              'flex items-start gap-2 p-2 rounded-md',
              constraint.passed ? 'bg-success/5' : 'bg-error/5'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
              constraint.passed 
                ? 'bg-success/20 text-success' 
                : 'bg-error/20 text-error'
            )}>
              {constraint.passed 
                ? <Check className="w-3 h-3" /> 
                : <X className="w-3 h-3" />
              }
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-body-sm',
                constraint.passed ? 'text-text-primary' : 'text-error'
              )}>
                {constraint.label}
              </p>
              {constraint.details && (
                <p className="text-caption text-text-tertiary mt-0.5">
                  {constraint.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

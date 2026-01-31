import * as React from 'react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/tooltip';

export interface ScoreComponent {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface ConfidenceBreakdownProps {
  components: ScoreComponent[];
  totalScore: number;
}

export function ConfidenceBreakdown({ components, totalScore }: ConfidenceBreakdownProps) {
  const maxTotal = components.reduce((sum, c) => sum + c.value, 0);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-text-primary">
          Confidence Breakdown
        </span>
        <span className="text-body-sm font-semibold text-accent">
          {totalScore}%
        </span>
      </div>
      
      {/* Stacked Bar */}
      <div className="h-3 bg-surface-alt rounded-full overflow-hidden flex">
        {components.map((component, index) => {
          const widthPercent = (component.value / maxTotal) * 100;
          return (
            <Tooltip key={component.id} content={`${component.label}: ${component.value}%`}>
              <div
                className={cn(
                  'h-full transition-all',
                  index === 0 && 'rounded-l-full',
                  index === components.length - 1 && 'rounded-r-full'
                )}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: component.color,
                }}
              />
            </Tooltip>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {components.map((component) => (
          <div key={component.id} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: component.color }}
            />
            <span className="text-caption text-text-secondary">
              {component.label}
            </span>
            <span className="text-caption font-medium text-text-primary">
              {component.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

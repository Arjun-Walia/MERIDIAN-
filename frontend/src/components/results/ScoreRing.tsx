import * as React from 'react';
import { cn } from '../../lib/utils';

interface ScoreRingProps {
  score: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ScoreRing({ score, max = 100, size = 'md', showLabel = true }: ScoreRingProps) {
  const percentage = Math.min((score / max) * 100, 100);
  
  const sizes = {
    sm: { container: 'w-10 h-10', stroke: 3, fontSize: 'text-caption' },
    md: { container: 'w-14 h-14', stroke: 4, fontSize: 'text-body-sm' },
    lg: { container: 'w-20 h-20', stroke: 5, fontSize: 'text-body' },
  };

  const config = sizes[size];
  const radius = 50 - config.stroke;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className={cn('relative', config.container)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-border-default"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn('transition-all duration-500', getScoreColor(score))}
        />
      </svg>
      {showLabel && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center font-semibold',
          config.fontSize,
          getScoreColor(score)
        )}>
          {Math.round(score)}
        </div>
      )}
    </div>
  );
}

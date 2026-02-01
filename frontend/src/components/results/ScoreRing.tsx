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
    sm: { container: 'w-12 h-12', stroke: 3, fontSize: 'text-sm' },
    md: { container: 'w-14 h-14', stroke: 4, fontSize: 'text-base' },
    lg: { container: 'w-20 h-20', stroke: 5, fontSize: 'text-lg' },
  };

  const config = sizes[size];
  const radius = 50 - config.stroke;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return 'stroke-green-400';
    if (score >= 60) return 'stroke-yellow-400';
    return 'stroke-red-400';
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
          strokeWidth={config.stroke}
          className="stroke-zinc-700"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn('transition-all duration-500', getStrokeColor(score))}
        />
      </svg>
      {showLabel && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center font-bold',
          config.fontSize,
          getScoreColor(score)
        )}>
          {Math.round(score)}
        </div>
      )}
    </div>
  );
}

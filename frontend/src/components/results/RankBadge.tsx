import * as React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface RankBadgeProps {
  rank: number;
  movement?: 'up' | 'down' | 'new' | null;
  size?: 'sm' | 'md';
}

export function RankBadge({ rank, movement, size = 'md' }: RankBadgeProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-rank-1 text-base';
    if (rank === 2) return 'bg-rank-2 text-base';
    if (rank === 3) return 'bg-rank-3 text-white';
    return 'bg-rank-other text-text-secondary';
  };

  const sizes = {
    sm: 'w-6 h-6 text-caption',
    md: 'w-8 h-8 text-body-sm',
  };

  return (
    <div className="flex items-center gap-1">
      <div className={cn(
        'font-bold rounded-md flex items-center justify-center',
        getRankColor(rank),
        sizes[size]
      )}>
        #{rank}
      </div>
      {movement && (
        <div className={cn(
          'w-4 h-4 flex items-center justify-center',
          movement === 'up' && 'text-success',
          movement === 'down' && 'text-error',
          movement === 'new' && 'text-info'
        )}>
          {movement === 'up' && <ArrowUp className="w-3 h-3" />}
          {movement === 'down' && <ArrowDown className="w-3 h-3" />}
          {movement === 'new' && <span className="text-caption font-medium">NEW</span>}
        </div>
      )}
    </div>
  );
}

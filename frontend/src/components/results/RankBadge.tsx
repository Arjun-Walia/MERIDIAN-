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
    if (rank === 1) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
    if (rank === 2) return 'bg-zinc-400/20 border-zinc-400/50 text-zinc-300';
    if (rank === 3) return 'bg-amber-600/20 border-amber-600/50 text-amber-500';
    return 'bg-zinc-700/50 border-zinc-600/50 text-zinc-400';
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        'font-bold rounded-lg flex items-center justify-center border',
        getRankColor(rank),
        sizes[size]
      )}>
        #{rank}
      </div>
      {movement && (
        <div className={cn(
          'flex items-center justify-center',
          movement === 'up' && 'text-green-400',
          movement === 'down' && 'text-red-400',
          movement === 'new' && 'text-cyan-400'
        )}>
          {movement === 'up' && <ArrowUp className="w-3 h-3" />}
          {movement === 'down' && <ArrowDown className="w-3 h-3" />}
          {movement === 'new' && <span className="text-xs font-medium">NEW</span>}
        </div>
      )}
    </div>
  );
}

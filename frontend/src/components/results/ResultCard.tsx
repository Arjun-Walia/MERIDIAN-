import * as React from 'react';
import { cn } from '../../lib/utils';
import { RankBadge } from './RankBadge';
import { ScoreRing } from './ScoreRing';
import { AttributeList, type Attribute } from './AttributeChip';
import { ChevronRight } from 'lucide-react';

export interface RankedEntity {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  score: number;
  rank: number;
  movement?: 'up' | 'down' | 'new' | null;
  attributes: Attribute[];
  metadata?: Record<string, string>;
}

interface ResultCardProps {
  entity: RankedEntity;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ResultCard({ entity, isSelected = false, onClick }: ResultCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-200',
        'hover:border-zinc-600 hover:bg-zinc-800/50',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
        'min-h-[60px]', // Touch-friendly minimum height
        isSelected
          ? 'bg-cyan-500/10 border-cyan-500/50 border-l-4 border-l-cyan-500'
          : 'bg-zinc-800/60 border-zinc-700/50'
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Rank Badge - Fixed width */}
        <div className="flex-shrink-0">
          <RankBadge rank={entity.rank} movement={entity.movement} />
        </div>
        
        {/* Main Content - Flex grow */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-white truncate mb-1">
            {entity.name}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 truncate mb-2">
            {entity.title}
            {entity.subtitle && (
              <span className="text-zinc-500 hidden sm:inline"> · {entity.subtitle}</span>
            )}
          </p>
          
          {/* Attributes - hide on very small screens */}
          {entity.attributes.length > 0 && (
            <div className="mt-2 hidden xs:block">
              <AttributeList attributes={entity.attributes} />
            </div>
          )}
          
          {/* Metadata - hide on mobile */}
          {entity.metadata && Object.keys(entity.metadata).length > 0 && (
            <div className="mt-2 items-center gap-3 text-xs text-zinc-500 hidden sm:flex">
              {Object.entries(entity.metadata).map(([key, value]) => (
                <span key={key}>{value}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* Score and Chevron - Right aligned */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1 sm:gap-2">
          <ScoreRing score={entity.score} size="sm" />
          <ChevronRight className={cn(
            'w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 transition-all',
            isSelected && 'text-cyan-400 translate-x-0.5'
          )} />
        </div>
      </div>
    </button>
  );
}

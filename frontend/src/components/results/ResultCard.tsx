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
        'w-full text-left p-4 rounded-lg border transition-all',
        'hover:border-border-subtle',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base',
        isSelected
          ? 'bg-accent/10 border-accent/30 border-l-2 border-l-accent'
          : 'bg-surface border-border-default'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <RankBadge rank={entity.rank} movement={entity.movement} />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-heading-md text-text-primary truncate">
                {entity.name}
              </h3>
              <p className="text-body-sm text-text-secondary truncate">
                {entity.title}
                {entity.subtitle && (
                  <span className="text-text-tertiary"> · {entity.subtitle}</span>
                )}
              </p>
            </div>
            
            {/* Score */}
            <ScoreRing score={entity.score} size="sm" />
          </div>
          
          {/* Attributes */}
          {entity.attributes.length > 0 && (
            <div className="mt-3">
              <AttributeList attributes={entity.attributes} />
            </div>
          )}
          
          {/* Metadata */}
          {entity.metadata && Object.keys(entity.metadata).length > 0 && (
            <div className="mt-2 flex items-center gap-3 text-body-sm text-text-tertiary">
              {Object.entries(entity.metadata).map(([key, value]) => (
                <span key={key}>{value}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* Chevron */}
        <ChevronRight className={cn(
          'w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform',
          isSelected && 'text-accent transform translate-x-0.5'
        )} />
      </div>
    </button>
  );
}

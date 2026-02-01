import * as React from 'react';
import { ResultCard, type RankedEntity } from './ResultCard';
import { Loader2 } from 'lucide-react';

interface ResultsListProps {
  results: RankedEntity[];
  selectedId?: string | null;
  onSelect: (entity: RankedEntity) => void;
  isLoading?: boolean;
}

export function ResultsList({ 
  results, 
  selectedId, 
  onSelect,
  isLoading 
}: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Loading results...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-base text-zinc-400">No results to display</p>
          <p className="text-sm text-zinc-500 mt-1">
            Ask a question to see ranked recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-3">
        {/* Results count header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-700/50">
          <span className="text-sm font-medium text-zinc-300 whitespace-nowrap">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Results cards */}
        <div className="space-y-3">
          {results.map((entity) => (
            <ResultCard
              key={entity.id}
              entity={entity}
              isSelected={selectedId === entity.id}
              onClick={() => onSelect(entity)}
            />
          ))}
        </div>
        
        {/* Bottom padding to prevent overlap with input */}
        <div className="h-4" />
      </div>
    </div>
  );
}

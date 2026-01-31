import * as React from 'react';
import { ScrollArea } from '../ui/scroll-area';
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
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-body-sm">Loading results...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-body text-text-secondary">No results to display</p>
          <p className="text-body-sm text-text-tertiary mt-1">
            Ask a question to see ranked recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm text-text-secondary">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {results.map((entity) => (
          <ResultCard
            key={entity.id}
            entity={entity}
            isSelected={selectedId === entity.id}
            onClick={() => onSelect(entity)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

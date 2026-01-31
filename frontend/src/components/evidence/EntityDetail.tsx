import * as React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { EvidenceSection } from './EvidenceSection';
import { ConstraintCheckList, type ConstraintCheck } from './ConstraintCheckList';
import { ConfidenceBreakdown, type ScoreComponent } from './ConfidenceBreakdown';
import type { RankedEntity } from '../results/ResultCard';
import { sourceIcons } from '../../lib/icons';

interface EvidenceSource {
  source: keyof typeof sourceIcons;
  label: string;
  items: Array<{
    id: string;
    content: string;
    timestamp?: string;
    author?: string;
    link?: string;
  }>;
}

interface EntityDetailProps {
  entity: RankedEntity;
  evidenceSources?: EvidenceSource[];
  constraints?: ConstraintCheck[];
  scoreComponents?: ScoreComponent[];
}

export function EntityDetail({ 
  entity, 
  evidenceSources = [],
  constraints = [],
  scoreComponents = []
}: EntityDetailProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-heading-lg text-text-primary">{entity.name}</h2>
          <p className="text-body text-text-secondary mt-1">
            {entity.title}
            {entity.subtitle && (
              <span className="text-text-tertiary"> · {entity.subtitle}</span>
            )}
          </p>
        </div>
        
        <Separator />
        
        {/* Score Breakdown */}
        {scoreComponents.length > 0 && (
          <>
            <ConfidenceBreakdown 
              components={scoreComponents} 
              totalScore={entity.score} 
            />
            <Separator />
          </>
        )}
        
        {/* Constraint Checks */}
        {constraints.length > 0 && (
          <>
            <ConstraintCheckList constraints={constraints} />
            <Separator />
          </>
        )}
        
        {/* Evidence Sources */}
        {evidenceSources.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-body-sm font-medium text-text-primary">
              Supporting Evidence
            </h3>
            
            {evidenceSources.map((source, index) => (
              <EvidenceSection
                key={source.source + index}
                source={source.source}
                label={source.label}
                items={source.items}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

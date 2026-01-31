import * as React from 'react';
import { Badge } from '../ui/badge';

export interface Attribute {
  label: string;
  value: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface AttributeChipProps {
  attribute: Attribute;
}

export function AttributeChip({ attribute }: AttributeChipProps) {
  const sentimentVariant = {
    positive: 'success' as const,
    neutral: 'default' as const,
    negative: 'error' as const,
  };

  const variant = attribute.sentiment 
    ? sentimentVariant[attribute.sentiment] 
    : 'default';

  return (
    <Badge variant={variant} size="sm">
      {attribute.label} {attribute.value && `· ${attribute.value}`}
    </Badge>
  );
}

interface AttributeListProps {
  attributes: Attribute[];
  max?: number;
}

export function AttributeList({ attributes, max = 4 }: AttributeListProps) {
  const visibleAttributes = attributes.slice(0, max);
  const remainingCount = attributes.length - max;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleAttributes.map((attr, index) => (
        <AttributeChip key={index} attribute={attr} />
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" size="sm">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

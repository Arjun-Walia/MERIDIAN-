import * as React from 'react';
import { cn } from '../../lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { sourceIcons } from '../../lib/icons';

interface EvidenceItem {
  id: string;
  content: string;
  timestamp?: string;
  author?: string;
  link?: string;
}

interface EvidenceSectionProps {
  source: keyof typeof sourceIcons;
  label: string;
  items: EvidenceItem[];
  defaultOpen?: boolean;
}

export function EvidenceSection({ 
  source, 
  label, 
  items, 
  defaultOpen = false 
}: EvidenceSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const SourceIcon = sourceIcons[source] || sourceIcons.mongodb;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className={cn(
          'w-full flex items-center justify-between p-3 rounded-lg',
          'bg-surface-alt hover:bg-surface-alt/80 transition-colors',
          'text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base'
        )}>
          <div className="flex items-center gap-3">
            <SourceIcon className="w-4 h-4 text-text-secondary" />
            <span className="text-body-sm font-medium text-text-primary">
              {label}
            </span>
            <span className="text-caption text-text-tertiary">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ChevronDown className={cn(
            'w-4 h-4 text-text-tertiary transition-transform',
            isOpen && 'transform rotate-180'
          )} />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="mt-2 space-y-2 pl-7">
          {items.map((item) => (
            <EvidenceRow key={item.id} item={item} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface EvidenceRowProps {
  item: EvidenceItem;
}

function EvidenceRow({ item }: EvidenceRowProps) {
  return (
    <div className={cn(
      'p-3 rounded-md bg-surface border border-border-default',
      'text-body-sm text-text-secondary'
    )}>
      <p className="text-text-primary">{item.content}</p>
      
      {(item.author || item.timestamp || item.link) && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-caption text-text-tertiary">
            {item.author && <span>{item.author}</span>}
            {item.author && item.timestamp && <span>·</span>}
            {item.timestamp && <span>{item.timestamp}</span>}
          </div>
          
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-caption text-accent hover:text-accent-hover"
            >
              <span>View source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

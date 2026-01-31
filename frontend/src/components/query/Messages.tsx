import * as React from 'react';
import { cn } from '../../lib/utils';
import { formatRelativeTime } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { getSourceIcon } from '../../lib/icons';
import { CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export interface SourceSummary {
  id: string;
  name: string;
  recordCount: number;
  status: 'success' | 'partial' | 'failed' | 'loading';
}

interface QueryMessageProps {
  content: string;
  timestamp: Date;
}

export function QueryMessage({ content, timestamp }: QueryMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-accent/15 border border-accent/20 rounded-lg px-4 py-3">
        <p className="text-body text-text-primary">{content}</p>
        <span className="text-caption text-text-tertiary mt-1 block">
          {formatRelativeTime(timestamp)}
        </span>
      </div>
    </div>
  );
}

interface ResponseMessageProps {
  summary: string;
  sources: SourceSummary[];
  resultCount: number;
  timestamp: Date;
  isLoading?: boolean;
}

export function ResponseMessage({ 
  summary, 
  sources, 
  resultCount, 
  timestamp,
  isLoading 
}: ResponseMessageProps) {
  if (isLoading) {
    return (
      <div className="flex justify-start" role="status" aria-live="polite">
        <div className="max-w-[80%] bg-surface border border-border-default rounded-lg px-4 py-4">
          {/* Animated loading header */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 
                className="w-5 h-5 text-cyan-400 animate-spin" 
                style={{ 
                  animationDuration: '1s',
                  animationTimingFunction: 'linear'
                }}
              />
              {/* Glow effect */}
              <div className="absolute inset-0 w-5 h-5 bg-cyan-400/20 rounded-full blur-sm animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-body font-medium text-text-primary">Analyzing your query</span>
              <span className="text-body-sm text-text-tertiary">This may take a few seconds...</span>
            </div>
          </div>
          
          {/* Animated typing indicator */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          
          {/* Source pills with loading state */}
          {sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border-default">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-text-tertiary" />
                <span className="text-caption text-text-tertiary">Checking sources</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.map((source) => (
                  <SourcePill key={source.id} source={source} />
                ))}
              </div>
            </div>
          )}
          
          {/* Screen reader announcement */}
          <span className="sr-only">Processing your query. Checking data sources. Please wait.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] bg-surface border border-border-default rounded-lg px-4 py-3">
        <p className="text-body text-text-primary">{summary}</p>
        
        {resultCount > 0 && (
          <p className="text-body-sm text-text-secondary mt-2">
            Found <span className="font-medium text-text-primary">{resultCount}</span> results
          </p>
        )}
        
        {sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {sources.map((source) => (
              <SourcePill key={source.id} source={source} />
            ))}
          </div>
        )}
        
        <span className="text-caption text-text-tertiary mt-2 block">
          {formatRelativeTime(timestamp)}
        </span>
      </div>
    </div>
  );
}

interface SourcePillProps {
  source: SourceSummary;
}

function SourcePill({ source }: SourcePillProps) {
  const Icon = getSourceIcon(source.id);
  
  const statusConfig = {
    success: { icon: CheckCircle, color: 'text-success' },
    partial: { icon: AlertCircle, color: 'text-warning' },
    failed: { icon: AlertCircle, color: 'text-error' },
    loading: { icon: Loader2, color: 'text-text-secondary' },
  };

  const config = statusConfig[source.status];
  const StatusIcon = config.icon;

  return (
    <Badge variant="outline" className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-text-tertiary" />
      <span>{source.name}</span>
      {source.recordCount > 0 && (
        <span className="text-text-tertiary">({source.recordCount})</span>
      )}
      <StatusIcon className={cn('w-3 h-3', config.color, source.status === 'loading' && 'animate-spin')} />
    </Badge>
  );
}

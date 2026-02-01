import * as React from 'react';
import { cn } from '../../lib/utils';
import { formatRelativeTime } from '../../lib/utils';
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
    <div className="flex justify-end mb-4">
      <div className="max-w-[85%] sm:max-w-[70%] bg-gradient-to-r from-blue-900/80 to-blue-800/80 border border-blue-700/50 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-sm sm:text-base text-white leading-relaxed">{content}</p>
        <span className="text-xs text-blue-300/70 mt-2 block text-right">
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
    <div className="flex justify-start mb-4">
      <div className="max-w-[90%] sm:max-w-[80%] bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-4 shadow-lg">
        {/* Summary text */}
        <p className="text-sm sm:text-base text-zinc-100 leading-relaxed mb-4">{summary}</p>
        
        {/* Source badges - larger and more prominent */}
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {sources.map((source) => (
              <SourcePill key={source.id} source={source} />
            ))}
          </div>
        )}
        
        {/* Results count and timestamp - more prominent */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
          {resultCount > 0 && (
            <p className="text-sm text-zinc-400 whitespace-nowrap">
              Found <span className="font-semibold text-cyan-400">{resultCount}</span> results
            </p>
          )}
          <span className="text-xs text-zinc-500">
            {formatRelativeTime(timestamp)}
          </span>
        </div>
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
    success: { icon: CheckCircle, color: 'text-green-400' },
    partial: { icon: AlertCircle, color: 'text-yellow-400' },
    failed: { icon: AlertCircle, color: 'text-red-400' },
    loading: { icon: Loader2, color: 'text-zinc-400' },
  };

  const config = statusConfig[source.status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-2 bg-zinc-700/80 border border-zinc-600/50 px-3 py-1.5 rounded-lg">
      <Icon className="w-4 h-4 text-zinc-300" />
      <span className="text-sm font-medium text-white">{source.name}</span>
      {source.recordCount > 0 && (
        <span className="text-xs text-zinc-400">({source.recordCount})</span>
      )}
      <StatusIcon className={cn('w-4 h-4', config.color, source.status === 'loading' && 'animate-spin')} />
    </div>
  );
}

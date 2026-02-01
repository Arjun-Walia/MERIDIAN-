import * as React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { QueryMessage, ResponseMessage, type SourceSummary } from './Messages';
import TextType from '../TextType';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: SourceSummary[];
  resultCount?: number;
}

interface ConversationThreadProps {
  messages: Message[];
  isLoading?: boolean;
  loadingSources?: SourceSummary[];
  onExampleClick?: (query: string) => void;
}

export function ConversationThread({ 
  messages, 
  isLoading, 
  loadingSources = [],
  onExampleClick
}: ConversationThreadProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return <EmptyState onExampleClick={onExampleClick} />;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          message.role === 'user' ? (
            <QueryMessage 
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
            />
          ) : (
            <ResponseMessage
              key={message.id}
              summary={message.content}
              sources={message.sources || []}
              resultCount={message.resultCount || 0}
              timestamp={message.timestamp}
            />
          )
        ))}
        
        {isLoading && (
          <ResponseMessage
            summary=""
            sources={loadingSources}
            resultCount={0}
            timestamp={new Date()}
            isLoading
          />
        )}
      </div>
    </ScrollArea>
  );
}

function EmptyState({ onExampleClick }: { onExampleClick?: (query: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center">
      {/* Logo - responsive sizing */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-xl bg-surface border border-border-default flex items-center justify-center">
        <img src="/logo.png" alt="" className="w-8 h-8 sm:w-10 sm:h-10 opacity-60" />
      </div>
      
      {/* Welcome heading - responsive text size */}
      <h2 className="text-heading-md sm:text-heading-lg text-text-primary mb-2">
        Welcome to MERIDIAN
      </h2>
      
      {/* Typing animation description */}
      <div className="text-body-sm sm:text-body text-text-secondary max-w-sm sm:max-w-md mb-4 sm:mb-6 min-h-[3rem]">
        <TextType
          text={[
            "Ask complex questions that span multiple data sources.",
            "Get ranked recommendations with full evidence trails.",
            "Discover insights from GitHub, Jira, and Slack.",
            "Make data-driven decisions with confidence."
          ]}
          typingSpeed={40}
          deletingSpeed={25}
          pauseDuration={2500}
          loop={true}
          showCursor={true}
          cursorCharacter="|"
          cursorClassName="text-blue-500"
          className="inline"
        />
      </div>
      
      {/* Example queries container - responsive grid */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Label */}
        <p className="text-body-sm text-zinc-400 uppercase tracking-wide font-medium mb-3 text-left">
          Try asking
        </p>
        
        {/* 
          Responsive grid:
          - Mobile (<640px): 1 column, stacked
          - Tablet (640px-1024px): 1 column with larger buttons  
          - Desktop (1024px+): Can be 2 columns if desired
        */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          <ExampleQuery onClick={onExampleClick}>
            Who is the best engineer to lead the authentication project?
          </ExampleQuery>
          <ExampleQuery onClick={onExampleClick}>
            Show candidates with 3+ years experience and no P1 bugs
          </ExampleQuery>
          <ExampleQuery onClick={onExampleClick}>
            Compare top 5 vendors by cost and reliability metrics
          </ExampleQuery>
        </div>
      </div>
    </div>
  );
}

function ExampleQuery({ children, onClick }: { children: React.ReactNode; onClick?: (query: string) => void }) {
  const handleClick = () => {
    if (onClick && typeof children === 'string') {
      onClick(children);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={[
        // Base styles - responsive padding
        'w-full text-left py-2.5 px-3 sm:py-3 sm:px-4 rounded-lg',
        'bg-surface border border-border-default',
        // Using zinc-300 for 10.2:1 contrast ratio (WCAG AAA)
        'text-body-sm sm:text-body text-zinc-300 leading-normal',
        // Hover state - lift effect with shadow and scale
        'hover:text-zinc-50 hover:border-cyan-500/50 hover:bg-zinc-800',
        'hover:shadow-lg hover:shadow-cyan-500/5 sm:hover:scale-[1.02]',
        // Focus state - visible ring
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
        // Active state
        'active:scale-[0.99] active:bg-zinc-700',
        // Smooth transitions
        'transition-all duration-200 ease-out cursor-pointer',
        // Touch-friendly sizing on mobile
        'min-h-[44px] sm:min-h-0',
      ].join(' ')}
    >
      {/* Quotation marks use cyan accent for visibility - 8.5:1 ratio */}
      <span className="text-cyan-400" aria-hidden="true">"</span>
      {children}
      <span className="text-cyan-400" aria-hidden="true">"</span>
    </button>
  );
}

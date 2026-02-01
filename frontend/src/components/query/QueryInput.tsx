import * as React from 'react';
import { cn } from '../../lib/utils';
import { Send, Loader2, Database, Search, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';

const MAX_CHARACTERS = 256;

// Loading stages with messages
const LOADING_STAGES = [
  { icon: Database, message: 'Connecting to data sources...' },
  { icon: Search, message: 'Analyzing query context...' },
  { icon: BarChart3, message: 'Ranking results...' },
];

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  loadingStage?: number; // 0, 1, 2 for different stages
  value?: string;
  onChange?: (value: string) => void;
}

export function QueryInput({ 
  onSubmit, 
  isLoading = false, 
  placeholder,
  loadingStage = 0,
  value: controlledValue,
  onChange: controlledOnChange
}: QueryInputProps) {
  const [internalValue, setInternalValue] = React.useState('');
  const [internalStage, setInternalStage] = React.useState(0);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const inputId = React.useId();
  const hintId = React.useId();
  const statusId = React.useId();

  // Support both controlled and uncontrolled modes
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const setValue = (newValue: string) => {
    if (isControlled && controlledOnChange) {
      controlledOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const characterCount = value.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  // Cycle through loading stages automatically if not externally controlled
  React.useEffect(() => {
    if (!isLoading) {
      setInternalStage(0);
      return;
    }

    const interval = setInterval(() => {
      setInternalStage((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const currentStage = LOADING_STAGES[loadingStage ?? internalStage] || LOADING_STAGES[0];
  const StageIcon = currentStage.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading && !isOverLimit) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Main input container - responsive layout */}
      <div 
        className={cn(
          'relative bg-transparent',
          // Flex layout - stack on very small screens, row on larger
          'flex flex-col xs:flex-row items-stretch xs:items-center gap-2'
        )}
        aria-busy={isLoading}
      >
        <textarea
          ref={inputRef}
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask anything..."}
          disabled={isLoading}
          rows={1}
          aria-label="Query input"
          aria-describedby={`${hintId} ${statusId}`}
          aria-busy={isLoading}
          style={{ color: '#ffffff', caretColor: '#ffffff' }}
          className={cn(
            // Base styles - transparent background with border, white text
            'flex-1 bg-transparent resize-none rounded-lg overflow-hidden',
            '!text-white',
            'border border-zinc-700',
            'min-h-[44px] sm:min-h-[40px]',
            // Responsive padding
            'py-3 px-3 sm:py-2.5 sm:px-4',
            // Placeholder styling
            'placeholder:!text-zinc-400',
            'placeholder:text-xs sm:placeholder:text-sm',
            // Focus styles - ring and border change
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50',
            // Disabled state
            'disabled:opacity-50 disabled:cursor-wait'
          )}
        />
        
        {/* Right side controls - responsive layout */}
        <div className={cn(
          'flex items-center gap-2 flex-shrink-0',
          // Padding adjustments for responsive layout
          'px-2 pb-2 xs:pb-0 xs:pr-2 xs:px-0'
        )}>
          {/* Loading spinner inside input area */}
          {isLoading && (
            <div className="flex items-center gap-2 text-cyan-400">
              <Loader2 
                className="w-5 h-5 animate-spin" 
                style={{ 
                  animationDuration: '1s',
                  animationTimingFunction: 'linear'
                }}
              />
            </div>
          )}
          
          {/* Character count indicator - hide when loading, hide on very small screens */}
          {!isLoading && (
            <span 
              id={hintId}
              className={cn(
                'text-xs tabular-nums transition-colors',
                // Hide on very small screens to save space
                'hidden xs:inline',
                isOverLimit ? 'text-red-400 font-medium' : 'text-zinc-400'
              )}
              aria-live="polite"
            >
              {characterCount}/{MAX_CHARACTERS}
            </span>
          )}
          
          {/* Submit button - touch-friendly sizing */}
          <Button 
            type="submit" 
            variant="primary" 
            size="icon"
            disabled={!value.trim() || isLoading || isOverLimit}
            aria-label={isLoading ? 'Processing query' : 'Submit query'}
            className={cn(
              'flex-shrink-0',
              // Larger touch target on mobile
              'h-11 w-11 sm:h-10 sm:w-10'
            )}
          >
            {isLoading ? (
              <Loader2 
                className="w-5 h-5 animate-spin" 
                style={{ 
                  animationDuration: '1s',
                  animationTimingFunction: 'linear'
                }}
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Loading status message below input - responsive */}
      {isLoading && (
        <div 
          id={statusId}
          className="mt-2 sm:mt-3 flex items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <div className={cn(
            'flex items-center gap-2 sm:gap-3',
            'px-3 sm:px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full',
            // Responsive text sizing
            'text-xs sm:text-sm'
          )}>
            <StageIcon className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
            {/* Hide message on very small screens, show abbreviated on mobile */}
            <span className="text-zinc-300 hidden xs:inline truncate max-w-[200px] sm:max-w-none">
              {currentStage.message}
            </span>
            {/* Progress dots */}
            <div className="flex items-center gap-1 ml-1">
              {LOADING_STAGES.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-colors duration-300',
                    index <= (loadingStage ?? internalStage)
                      ? 'bg-cyan-400'
                      : 'bg-zinc-600'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Screen reader status announcement */}
      <div className="sr-only" aria-live="assertive" role="status">
        {isLoading && `Query processing. ${currentStage.message}`}
      </div>
    </form>
  );
}

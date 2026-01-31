import * as React from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';

interface DetailPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}

export function DetailPanel({ title, subtitle, children, onClose, footer }: DetailPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border-default">
        <div className="min-w-0 flex-1">
          <h2 className="text-heading-md text-text-primary truncate">{title}</h2>
          {subtitle && (
            <p className="text-body-sm text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="flex-shrink-0 ml-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>
      
      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-border-default">
          {footer}
        </div>
      )}
    </div>
  );
}

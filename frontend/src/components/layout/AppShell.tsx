import * as React from 'react';
import { cn } from '../../lib/utils';
import { NavRail, type NavItem } from './NavRail';
import { MobileNav } from './MobileNav';
import { TooltipProvider } from '../ui/tooltip';

interface AppShellProps {
  children: React.ReactNode;
  detailPanel?: React.ReactNode;
  isDetailOpen?: boolean;
  constraintBar?: React.ReactNode;
  activeNavId?: string;
  onNavigate?: (id: string) => void;
  navItems?: NavItem[];
  loadingNavId?: string | null;
}

export function AppShell({ 
  children, 
  detailPanel, 
  isDetailOpen = false,
  constraintBar,
  activeNavId = 'dashboard',
  onNavigate,
  navItems,
  loadingNavId = null
}: AppShellProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col lg:flex-row h-screen bg-transparent text-text-primary overflow-hidden relative z-10">
        {/* Mobile Navigation - visible only on screens < lg (1024px) */}
        <MobileNav
          activeId={activeNavId}
          onNavigate={onNavigate}
          items={navItems}
          loadingId={loadingNavId}
        />

        {/* Desktop Navigation Rail - hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex h-screen flex-shrink-0">
          <NavRail 
            activeId={activeNavId}
            onNavigate={onNavigate}
            items={navItems}
            loadingId={loadingNavId}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-base/80 backdrop-blur-sm">
          {/* Main content */}
          <main id="main-content" className="flex-1 flex overflow-hidden" tabIndex={-1}>
            {/* Center content area - full width with minimal padding */}
            <div className={cn(
              'flex-1 flex flex-col min-w-0 transition-all duration-200',
              // Reduced padding for wider content
              'px-2 sm:px-4 lg:px-6',
              isDetailOpen && 'lg:mr-0'
            )}>
              {children}
            </div>
            
            {/* Detail Panel - hidden on mobile, slide-in on desktop */}
            {isDetailOpen && detailPanel && (
              <aside className={cn(
                'border-l border-border-default bg-surface flex-shrink-0 animate-slide-in-right',
                // Full width on mobile/tablet, fixed on desktop
                'fixed inset-0 z-30 lg:relative lg:inset-auto',
                'w-full lg:w-[380px]'
              )}>
                {detailPanel}
              </aside>
            )}
          </main>
          
          {/* Constraint Bar - responsive, compact on mobile */}
          {constraintBar && (
            <div className="border-t border-border-default bg-surface flex-shrink-0">
              {constraintBar}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

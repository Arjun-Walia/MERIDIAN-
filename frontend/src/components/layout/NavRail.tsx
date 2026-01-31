import * as React from 'react';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { LayoutDashboard, Database, History, Settings, Loader2, type LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const defaultNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sources', label: 'Data Sources', icon: Database },
  { id: 'history', label: 'Decision History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface NavRailProps {
  activeId?: string;
  onNavigate?: (id: string) => void;
  items?: NavItem[];
  loadingId?: string | null;
}

export function NavRail({ 
  activeId = 'dashboard', 
  onNavigate,
  items = defaultNavItems,
  loadingId = null
}: NavRailProps) {
  const navRef = React.useRef<HTMLElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent, index: number) => {
    const itemCount = items.length;
    let newIndex = index;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (index + 1) % itemCount;
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (index - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const item = items[index];
        if (!item.disabled && !item.isLoading && loadingId !== item.id) {
          onNavigate?.(item.id);
        }
        return;
      default:
        return;
    }

    setFocusedIndex(newIndex);
    // Focus the new button
    const buttons = navRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    buttons?.[newIndex]?.focus();
  }, [items, onNavigate, loadingId]);

  return (
    <nav 
      ref={navRef}
      className="w-14 h-screen bg-surface border-r border-border-default flex flex-col items-center py-4 pl-2 flex-shrink-0"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo - 40x40 with consistent bottom margin */}
      <div className="w-10 h-10 mb-4 flex items-center justify-center flex-shrink-0">
        <img 
          src="/logo.png" 
          alt="MERIDIAN" 
          className="w-8 h-8 object-contain rounded-md"
        />
      </div>
      
      {/* Navigation Items - flex column with consistent 8px gap */}
      <div 
        className="flex flex-col gap-2 flex-1"
        role="menu"
        aria-orientation="vertical"
      >
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          const isLoading = loadingId === item.id || item.isLoading;
          const isDisabled = item.disabled || isLoading;
          
          return (
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  role="menuitem"
                  tabIndex={focusedIndex === -1 ? (index === 0 ? 0 : -1) : (focusedIndex === index ? 0 : -1)}
                  onClick={() => {
                    if (!isDisabled) {
                      onNavigate?.(item.id);
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  disabled={isDisabled}
                  aria-current={isActive ? 'page' : undefined}
                  aria-busy={isLoading}
                  aria-disabled={isDisabled}
                  aria-label={item.label}
                  className={cn(
                    // Base styles - consistent 40x40px clickable area
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    'transition-all duration-150',
                    // Focus ring for keyboard navigation
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                    // Active state - cyan accent with background
                    isActive && !isLoading && [
                      'bg-cyan-500/15 text-cyan-400',
                      'border-l-2 border-l-cyan-400 -ml-[1px]',
                    ],
                    // Default state with hover
                    !isActive && !isLoading && !isDisabled && [
                      'text-text-secondary',
                      // Hover state - semi-transparent white background
                      'hover:text-text-primary hover:bg-white/[0.08]',
                    ],
                    // Loading state
                    isLoading && 'text-cyan-400 cursor-wait',
                    // Disabled state
                    isDisabled && !isLoading && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                sideOffset={8}
                className="font-medium"
              >
                <span>{item.label}</span>
                {isLoading && <span className="ml-1 text-text-secondary">(Loading...)</span>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}

export type { NavItem };

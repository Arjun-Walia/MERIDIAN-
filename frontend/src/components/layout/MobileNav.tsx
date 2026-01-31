import * as React from 'react';
import { cn } from '../../lib/utils';
import { Menu, X, LayoutDashboard, Database, History, Settings, Loader2, type LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

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

interface MobileNavProps {
  activeId?: string;
  onNavigate?: (id: string) => void;
  items?: NavItem[];
  loadingId?: string | null;
}

export function MobileNav({
  activeId = 'dashboard',
  onNavigate,
  items = defaultNavItems,
  loadingId = null
}: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavigate = (id: string) => {
    onNavigate?.(id);
    setIsOpen(false);
  };

  // Close drawer on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header - visible only on small screens */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-surface border-b border-border-default">
        {/* Hamburger menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="h-10 w-10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Logo and title */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-6 h-6 object-contain" />
          <span className="text-heading-sm text-text-primary font-semibold">MERIDIAN</span>
        </div>

        {/* Spacer for centering */}
        <div className="w-10" />
      </header>

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out drawer */}
      <nav
        className={cn(
          'lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-surface border-r border-border-default',
          'flex flex-col transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border-default">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MERIDIAN" className="w-8 h-8 object-contain" />
            <span className="text-heading-sm text-text-primary font-semibold">MERIDIAN</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="h-10 w-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-2 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            const isLoading = loadingId === item.id || item.isLoading;
            const isDisabled = item.disabled || isLoading;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && handleNavigate(item.id)}
                disabled={isDisabled}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1',
                  'text-left transition-all duration-150',
                  // Focus ring
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                  // Active state
                  isActive && !isLoading && [
                    'bg-cyan-500/15 text-cyan-400',
                    'border-l-2 border-l-cyan-400',
                  ],
                  // Default state
                  !isActive && !isLoading && !isDisabled && [
                    'text-text-secondary',
                    'hover:text-text-primary hover:bg-white/[0.08]',
                  ],
                  // Loading state
                  isLoading && 'text-cyan-400 cursor-wait',
                  // Disabled state
                  isDisabled && !isLoading && 'opacity-50 cursor-not-allowed',
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                ) : (
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                )}
                <span className="text-body font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default">
          <p className="text-caption text-text-muted">
            Multi-Source AI Decision Assistant
          </p>
        </div>
      </nav>
    </>
  );
}

export type { NavItem };

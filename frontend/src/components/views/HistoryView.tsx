import * as React from 'react';
import { History, Search, Calendar, ChevronRight, Clock, CheckCircle2, TrendingUp, TrendingDown, Minus, Filter, Download, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface DecisionHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  topResult: {
    name: string;
    score: number;
  };
  resultCount: number;
  sources: string[];
  outcome?: 'positive' | 'negative' | 'neutral' | 'pending';
  category?: string;
}

const defaultHistory: DecisionHistoryItem[] = [
  {
    id: '1',
    query: 'Who should be the tech lead for the payments team?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    topResult: { name: 'Sarah Chen', score: 94 },
    resultCount: 5,
    sources: ['Jira', 'GitHub', 'Slack'],
    outcome: 'positive',
    category: 'Team Decisions',
  },
  {
    id: '2',
    query: 'Best framework for the new microservices architecture?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    topResult: { name: 'Go with Fiber', score: 89 },
    resultCount: 8,
    sources: ['GitHub', 'Confluence'],
    outcome: 'pending',
    category: 'Technical',
  },
  {
    id: '3',
    query: 'Which vendor should we use for cloud infrastructure?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    topResult: { name: 'AWS', score: 87 },
    resultCount: 3,
    sources: ['Jira', 'Slack', 'Notion'],
    outcome: 'positive',
    category: 'Vendor Selection',
  },
  {
    id: '4',
    query: 'Who are the top performers in Q4?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    topResult: { name: 'Engineering Team Alpha', score: 92 },
    resultCount: 12,
    sources: ['Jira', 'GitHub'],
    outcome: 'positive',
    category: 'Performance Review',
  },
  {
    id: '5',
    query: 'Which project should we prioritize next sprint?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    topResult: { name: 'User Authentication V2', score: 78 },
    resultCount: 6,
    sources: ['Jira', 'Slack'],
    outcome: 'negative',
    category: 'Sprint Planning',
  },
  {
    id: '6',
    query: 'Best candidate for senior backend role?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    topResult: { name: 'Marcus Johnson', score: 91 },
    resultCount: 4,
    sources: ['MongoDB', 'Slack'],
    outcome: 'positive',
    category: 'Hiring',
  },
];

interface HistoryViewProps {
  history?: DecisionHistoryItem[];
  onSelect?: (item: DecisionHistoryItem) => void;
  onDelete?: (id: string) => void;
  onExport?: () => void;
}

export function HistoryView({
  history = defaultHistory,
  onSelect,
  onDelete,
  onExport,
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(history.map(h => h.category).filter(Boolean)));

  // Filter history
  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchQuery || 
      item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topResult.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by date
  const groupedHistory = React.useMemo(() => {
    const groups: { label: string; items: DecisionHistoryItem[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const todayItems: DecisionHistoryItem[] = [];
    const yesterdayItems: DecisionHistoryItem[] = [];
    const lastWeekItems: DecisionHistoryItem[] = [];
    const olderItems: DecisionHistoryItem[] = [];

    filteredHistory.forEach(item => {
      const itemDate = new Date(item.timestamp);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === today.getTime()) {
        todayItems.push(item);
      } else if (itemDate.getTime() === yesterday.getTime()) {
        yesterdayItems.push(item);
      } else if (itemDate > lastWeek) {
        lastWeekItems.push(item);
      } else {
        olderItems.push(item);
      }
    });

    if (todayItems.length) groups.push({ label: 'Today', items: todayItems });
    if (yesterdayItems.length) groups.push({ label: 'Yesterday', items: yesterdayItems });
    if (lastWeekItems.length) groups.push({ label: 'Last 7 Days', items: lastWeekItems });
    if (olderItems.length) groups.push({ label: 'Older', items: olderItems });

    return groups;
  }, [filteredHistory]);

  const stats = {
    total: history.length,
    positive: history.filter(h => h.outcome === 'positive').length,
    pending: history.filter(h => h.outcome === 'pending').length,
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header - Responsive */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-6 border-b border-zinc-800">
        {/* Title row - stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
              <History className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-400" />
              Decision History
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-1">
              Track and review past decisions
            </p>
          </div>
          <Button
            onClick={onExport}
            variant="ghost"
            className="text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 h-10 w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats - Responsive grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3">
            <div className="text-lg sm:text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs sm:text-sm text-zinc-400">Decisions</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3">
            <div className="text-lg sm:text-2xl font-bold text-green-400">{stats.positive}</div>
            <div className="text-xs sm:text-sm text-zinc-400">Positive</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3">
            <div className="text-lg sm:text-2xl font-bold text-amber-400">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-zinc-400">Pending</div>
          </div>
        </div>

        {/* Search and Filters - Responsive stack */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search decisions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-lg h-10 sm:h-auto',
                'bg-zinc-900 border border-zinc-800',
                'text-white placeholder:text-zinc-500 text-sm sm:text-base',
                'focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20',
                'transition-colors'
              )}
            />
          </div>
          
          {/* Category Filter - Horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'h-10 px-3 border whitespace-nowrap flex-shrink-0',
                selectedCategory === null
                  ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                  : 'border-zinc-700 text-zinc-400 hover:text-white'
              )}
            >
              All
            </Button>
            {categories.slice(0, 3).map(cat => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat!)}
                className={cn(
                  'h-10 px-3 border whitespace-nowrap flex-shrink-0',
                  selectedCategory === cat
                    ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                    : 'border-zinc-700 text-zinc-400 hover:text-white'
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {groupedHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <History className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">No decisions found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedHistory.map(group => (
              <div key={group.label}>
                <h3 className="text-sm font-medium text-zinc-500 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {group.label}
                </h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {group.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <HistoryCard
                          item={item}
                          onClick={() => onSelect?.(item)}
                          onDelete={() => onDelete?.(item.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface HistoryCardProps {
  item: DecisionHistoryItem;
  onClick?: () => void;
  onDelete?: () => void;
}

function HistoryCard({ item, onClick, onDelete }: HistoryCardProps) {
  const outcomeConfig = {
    positive: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    negative: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10' },
    neutral: { icon: Minus, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  };

  const outcome = item.outcome ? outcomeConfig[item.outcome] : null;
  const OutcomeIcon = outcome?.icon;

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const mins = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = mins.toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 sm:p-4',
        'hover:border-zinc-700 hover:bg-zinc-900/80',
        'transition-all duration-200 cursor-pointer',
        'group min-h-[44px]'
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          {/* Query */}
          <p className="text-sm sm:text-base text-white font-medium line-clamp-2 sm:line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {item.query}
          </p>
          
          {/* Meta info - Wrap on mobile */}
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 mt-2 text-xs sm:text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {formatTime(item.timestamp)}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{item.resultCount} results</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1">
              {item.sources.slice(0, 2).join(', ')}
              {item.sources.length > 2 && ` +${item.sources.length - 2}`}
            </span>
          </div>

          {/* Top Result */}
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-zinc-300">
              Top: <span className="text-white font-medium">{item.topResult.name}</span>
            </span>
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded',
              item.topResult.score >= 90 ? 'bg-green-400/10 text-green-400' :
              item.topResult.score >= 80 ? 'bg-cyan-400/10 text-cyan-400' :
              'bg-zinc-700 text-zinc-300'
            )}>
              {item.topResult.score}%
            </span>
          </div>
        </div>

        {/* Right side - Simplified on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Category - Hide on mobile */}
          {item.category && (
            <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
              {item.category}
            </span>
          )}

          {/* Outcome */}
          {outcome && OutcomeIcon && (
            <div className={cn(
              'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center',
              outcome.bg
            )}>
              <OutcomeIcon className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', outcome.color)} />
            </div>
          )}

          {/* Arrow */}
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}

export default HistoryView;

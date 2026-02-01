import * as React from 'react';
import { Database, CheckCircle2, XCircle, RefreshCw, Plus, Settings, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface DataSource {
  id: string;
  name: string;
  type: 'jira' | 'github' | 'slack' | 'mongodb' | 'confluence' | 'notion' | 'custom';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync?: Date;
  recordCount?: number;
  description?: string;
  icon?: string;
}

const defaultDataSources: DataSource[] = [
  {
    id: '1',
    name: 'Jira Cloud',
    type: 'jira',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    recordCount: 1247,
    description: 'Project tracking and issue management',
  },
  {
    id: '2',
    name: 'GitHub Enterprise',
    type: 'github',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    recordCount: 3892,
    description: 'Code repositories and pull requests',
  },
  {
    id: '3',
    name: 'Slack Workspace',
    type: 'slack',
    status: 'syncing',
    lastSync: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    recordCount: 15420,
    description: 'Team communications and channels',
  },
  {
    id: '4',
    name: 'MongoDB Atlas',
    type: 'mongodb',
    status: 'connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
    recordCount: 89421,
    description: 'Primary database cluster',
  },
  {
    id: '5',
    name: 'Confluence',
    type: 'confluence',
    status: 'disconnected',
    description: 'Documentation and knowledge base',
  },
  {
    id: '6',
    name: 'Notion',
    type: 'notion',
    status: 'error',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    recordCount: 234,
    description: 'Team wiki and notes',
  },
];

interface DataSourcesViewProps {
  dataSources?: DataSource[];
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onSync?: (id: string) => void;
  onConfigure?: (id: string) => void;
  onAddSource?: () => void;
}

const typeIcons: Record<DataSource['type'], string> = {
  jira: '🔷',
  github: '🐙',
  slack: '💬',
  mongodb: '🍃',
  confluence: '📘',
  notion: '📝',
  custom: '⚙️',
};

const typeColors: Record<DataSource['type'], string> = {
  jira: 'from-blue-500 to-blue-600',
  github: 'from-gray-600 to-gray-700',
  slack: 'from-purple-500 to-pink-500',
  mongodb: 'from-green-500 to-green-600',
  confluence: 'from-blue-400 to-blue-500',
  notion: 'from-zinc-600 to-zinc-700',
  custom: 'from-cyan-500 to-cyan-600',
};

export function DataSourcesView({
  dataSources = defaultDataSources,
  onConnect,
  onDisconnect,
  onSync,
  onConfigure,
  onAddSource,
}: DataSourcesViewProps) {
  const connectedCount = dataSources.filter(ds => ds.status === 'connected' || ds.status === 'syncing').length;
  const totalRecords = dataSources.reduce((acc, ds) => acc + (ds.recordCount || 0), 0);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header - Responsive */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-6 border-b border-zinc-800">
        {/* Title row - stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
              <Database className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-400" />
              Data Sources
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-1">
              Manage your connected data sources
            </p>
          </div>
          <Button
            onClick={onAddSource}
            className="bg-cyan-600 hover:bg-cyan-500 text-white h-10 sm:h-auto w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Source
          </Button>
        </div>

        {/* Stats - Responsive grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3">
            <div className="text-lg sm:text-2xl font-bold text-cyan-400">{connectedCount}</div>
            <div className="text-xs sm:text-sm text-zinc-400">Connected</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3">
            <div className="text-lg sm:text-2xl font-bold text-white">{dataSources.length}</div>
            <div className="text-xs sm:text-sm text-zinc-400">Total</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 sm:py-3">
            <div className="text-lg sm:text-2xl font-bold text-green-400">{totalRecords.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-zinc-400 truncate">Records</div>
          </div>
        </div>
      </div>

      {/* Data Sources Grid - Responsive */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {dataSources.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DataSourceCard
                  source={source}
                  onConnect={() => onConnect?.(source.id)}
                  onDisconnect={() => onDisconnect?.(source.id)}
                  onSync={() => onSync?.(source.id)}
                  onConfigure={() => onConfigure?.(source.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface DataSourceCardProps {
  source: DataSource;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
  onConfigure?: () => void;
}

function DataSourceCard({ source, onConnect, onDisconnect, onSync, onConfigure }: DataSourceCardProps) {
  const statusConfig = {
    connected: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Connected' },
    disconnected: { icon: XCircle, color: 'text-zinc-500', bg: 'bg-zinc-500/10', label: 'Disconnected' },
    syncing: { icon: RefreshCw, color: 'text-cyan-400', bg: 'bg-cyan-400/10', label: 'Syncing...' },
    error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Error' },
  };

  const status = statusConfig[source.status];
  const StatusIcon = status.icon;

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={cn(
      'bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 sm:p-4',
      'hover:border-zinc-700 transition-all duration-200',
      'group'
    )}>
      {/* Header - Responsive */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={cn(
            'w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-xl flex-shrink-0',
            'bg-gradient-to-br',
            typeColors[source.type]
          )}>
            {typeIcons[source.type]}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-white text-sm sm:text-base truncate">{source.name}</h3>
            <p className="text-xs text-zinc-500 capitalize">{source.type}</p>
          </div>
        </div>
        
        {/* Status Badge - Smaller on mobile */}
        <div className={cn(
          'flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0',
          status.bg, status.color
        )}>
          <StatusIcon className={cn(
            'w-3 h-3',
            source.status === 'syncing' && 'animate-spin'
          )} />
          <span className="hidden sm:inline">{status.label}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-zinc-400 mb-3 sm:mb-4 line-clamp-2">
        {source.description}
      </p>

      {/* Stats - Responsive */}
      {(source.status === 'connected' || source.status === 'syncing') && (
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 mb-3 sm:mb-4 text-xs sm:text-sm">
          <div>
            <span className="text-zinc-500">Records: </span>
            <span className="text-white font-medium">{source.recordCount?.toLocaleString() || 0}</span>
          </div>
          <div>
            <span className="text-zinc-500">Sync: </span>
            <span className="text-white">{formatLastSync(source.lastSync)}</span>
          </div>
        </div>
      )}

      {/* Actions - Touch-friendly */}
      <div className="flex gap-2 pt-2 sm:pt-3 border-t border-zinc-800">
        {source.status === 'disconnected' || source.status === 'error' ? (
          <Button
            size="sm"
            onClick={onConnect}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white h-10"
          >
            Connect
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSync}
              disabled={source.status === 'syncing'}
              className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800 h-10"
            >
              <RefreshCw className={cn(
                'w-4 h-4 mr-1',
                source.status === 'syncing' && 'animate-spin'
              )} />
              Sync
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onConfigure}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-10 w-10 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default DataSourcesView;

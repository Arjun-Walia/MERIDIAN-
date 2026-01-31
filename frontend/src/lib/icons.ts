import {
  Database,
  Ticket,
  MessageSquare,
  GitBranch,
  Globe,
  Table,
  Box,
  LayoutDashboard,
  History,
  Settings,
  Search,
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Filter,
  Trash2,
  Pencil,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Copy,
  MoreVertical,
  Command,
  type LucideIcon,
} from 'lucide-react';

// Source type to icon mapping
export const sourceIcons: Record<string, LucideIcon> = {
  jira: Ticket,
  mongodb: Database,
  slack: MessageSquare,
  github: GitBranch,
  rest: Globe,
  airtable: Table,
  default: Box,
};

// Navigation icons
export const navIcons = {
  dashboard: LayoutDashboard,
  sources: Database,
  history: History,
  settings: Settings,
};

// Action icons
export const actionIcons = {
  search: Search,
  add: Plus,
  remove: X,
  check: Check,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  filter: Filter,
  delete: Trash2,
  edit: Pencil,
  externalLink: ExternalLink,
  copy: Copy,
  more: MoreVertical,
  command: Command,
};

// Status icons
export const statusIcons = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle,
  failed: XCircle,
  loading: Loader2,
};

// Movement icons
export const movementIcons = {
  up: ArrowUp,
  down: ArrowDown,
};

export function getSourceIcon(sourceType: string): LucideIcon {
  return sourceIcons[sourceType.toLowerCase()] || sourceIcons.default;
}

import * as React from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Key, 
  Globe, 
  Moon, 
  Sun,
  Check,
  ChevronRight,
  ChevronLeft,
  Mail,
  Smartphone,
  Monitor,
  Menu
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const settingsSections: SettingsSection[] = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Manage your account details' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure alerts and notifications' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize the look and feel' },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield, description: 'Manage security settings' },
  { id: 'integrations', label: 'API & Integrations', icon: Key, description: 'Manage API keys and webhooks' },
  { id: 'data', label: 'Data Management', icon: Database, description: 'Export, import, and manage data' },
];

interface SettingsViewProps {
  onSave?: () => void;
}

export function SettingsView({ onSave }: SettingsViewProps) {
  const [activeSection, setActiveSection] = React.useState('profile');
  const [showMobileNav, setShowMobileNav] = React.useState(true);
  const [theme, setTheme] = React.useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    desktop: false,
    weeklyDigest: true,
    mentionsOnly: false,
  });

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setShowMobileNav(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
        {!showMobileNav ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileNav(true)}
            className="h-10 px-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        ) : null}
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          {showMobileNav ? 'Settings' : settingsSections.find(s => s.id === activeSection)?.label}
        </h1>
      </div>

      {/* Settings Sidebar - Hidden on mobile when viewing content */}
      <div className={cn(
        'md:w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-950/50',
        'md:block',
        showMobileNav ? 'block' : 'hidden'
      )}>
        {/* Desktop header */}
        <div className="hidden md:block p-6">
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Settings
          </h1>
        </div>
        <nav className="px-3 py-2 md:py-0">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg mb-1',
                  'text-left transition-all duration-150 min-h-[44px]',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                )}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
                <div className="flex-1">
                  <span className="text-sm font-medium">{section.label}</span>
                  <p className="text-xs text-zinc-500 md:hidden">{section.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 md:hidden" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content - Full screen on mobile */}
      <div className={cn(
        'flex-1 overflow-y-auto',
        'md:block',
        showMobileNav ? 'hidden md:block' : 'block'
      )}>
        <div className="max-w-2xl p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeSection === 'profile' && (
              <ProfileSettings key="profile" />
            )}
            {activeSection === 'notifications' && (
              <NotificationSettings 
                key="notifications"
                notifications={notifications} 
                onChange={setNotifications} 
              />
            )}
            {activeSection === 'appearance' && (
              <AppearanceSettings key="appearance" theme={theme} onThemeChange={setTheme} />
            )}
            {activeSection === 'privacy' && (
              <PrivacySettings key="privacy" />
            )}
            {activeSection === 'integrations' && (
              <IntegrationSettings key="integrations" />
            )}
            {activeSection === 'data' && (
              <DataSettings key="data" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
          JD
        </div>
        <div>
          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 h-10">
            Change Avatar
          </Button>
        </div>
      </div>

      {/* Form Fields - Stack on mobile */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">First Name</label>
            <input
              type="text"
              defaultValue="John"
              className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 h-10 sm:h-auto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name</label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 h-10 sm:h-auto"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
          <input
            type="email"
            defaultValue="john.doe@company.com"
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 h-10 sm:h-auto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Role</label>
          <input
            type="text"
            defaultValue="Engineering Manager"
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 h-10 sm:h-auto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Timezone</label>
          <select className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none h-10 sm:h-auto">
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
            <option>UTC</option>
            <option>India Standard Time (IST)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white h-10 w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
}

interface NotificationSettingsProps {
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    weeklyDigest: boolean;
    mentionsOnly: boolean;
  };
  onChange: (notifications: any) => void;
}

function NotificationSettings({ notifications, onChange }: NotificationSettingsProps) {
  const toggleSetting = (key: keyof typeof notifications) => {
    onChange({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Notification Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">Choose how you want to be notified</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-sm font-medium text-zinc-300">Notification Channels</h3>
        
        <ToggleOption
          icon={Mail}
          label="Email Notifications"
          description="Receive updates via email"
          enabled={notifications.email}
          onToggle={() => toggleSetting('email')}
        />
        
        <ToggleOption
          icon={Smartphone}
          label="Push Notifications"
          description="Mobile push notifications"
          enabled={notifications.push}
          onToggle={() => toggleSetting('push')}
        />
        
        <ToggleOption
          icon={Monitor}
          label="Desktop Notifications"
          description="Browser desktop alerts"
          enabled={notifications.desktop}
          onToggle={() => toggleSetting('desktop')}
        />
      </div>

      <div className="space-y-3 sm:space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">Preferences</h3>
        
        <ToggleOption
          icon={Bell}
          label="Weekly Digest"
          description="Summary of decisions and activity"
          enabled={notifications.weeklyDigest}
          onToggle={() => toggleSetting('weeklyDigest')}
        />
        
        <ToggleOption
          icon={User}
          label="Mentions Only"
          description="Only notify when mentioned"
          enabled={notifications.mentionsOnly}
          onToggle={() => toggleSetting('mentionsOnly')}
        />
      </div>
    </motion.div>
  );
}

interface AppearanceSettingsProps {
  theme: 'dark' | 'light' | 'system';
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

function AppearanceSettings({ theme, onThemeChange }: AppearanceSettingsProps) {
  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for low-light environments' },
    { id: 'light', label: 'Light', icon: Sun, description: 'Light theme for bright environments' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Follow system preferences' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Appearance</h2>
        <p className="text-sm text-zinc-400 mt-1">Customize the look and feel</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-300">Theme</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {themes.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => onThemeChange(id)}
              className={cn(
                'p-3 sm:p-4 rounded-xl border text-left transition-all flex sm:block items-center gap-3',
                theme === id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 sm:w-6 sm:h-6 sm:mb-2 flex-shrink-0',
                theme === id ? 'text-cyan-400' : 'text-zinc-400'
              )} />
              <div className="flex-1 sm:block">
                <div className={cn(
                  'font-medium text-sm sm:text-base',
                  theme === id ? 'text-white' : 'text-zinc-300'
                )}>
                  {label}
                </div>
                <div className="text-xs text-zinc-500 sm:mt-1">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">Display</h3>
        
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Font Size</label>
          <select className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none h-10 sm:h-auto">
            <option>Small</option>
            <option>Medium (Default)</option>
            <option>Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Density</label>
          <select className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none h-10 sm:h-auto">
            <option>Compact</option>
            <option>Comfortable (Default)</option>
            <option>Spacious</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

function PrivacySettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Privacy & Security</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your security settings</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-sm font-medium text-zinc-300">Authentication</h3>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 sm:p-4">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0">
                <div className="text-white font-medium text-sm sm:text-base">Two-Factor Authentication</div>
                <div className="text-xs sm:text-sm text-zinc-500">Add an extra layer of security</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-400/10 text-green-400 flex-shrink-0">Enabled</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 sm:p-4">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <Key className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0">
                <div className="text-white font-medium text-sm sm:text-base">Password</div>
                <div className="text-xs sm:text-sm text-zinc-500">Last changed 30 days ago</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 h-10 flex-shrink-0">
              Change
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">Sessions</h3>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 sm:p-4">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <Monitor className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="min-w-0">
                <div className="text-white font-medium text-sm sm:text-base">Current Session</div>
                <div className="text-xs sm:text-sm text-zinc-500">Windows • Chrome • Active now</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-400 flex-shrink-0">This device</span>
          </div>
        </div>

        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-10 w-full sm:w-auto">
          Sign out all other sessions
        </Button>
      </div>
    </motion.div>
  );
}

function IntegrationSettings() {
  const apiKeys = [
    { id: '1', name: 'Production API Key', key: 'sk-prod-xxxx...xxxx', created: '2 weeks ago', lastUsed: 'Today' },
    { id: '2', name: 'Development Key', key: 'sk-dev-xxxx...xxxx', created: '1 month ago', lastUsed: '3 days ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">API & Integrations</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage API keys and external integrations</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <h3 className="text-sm font-medium text-zinc-300">API Keys</h3>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white h-10 w-full sm:w-auto">
            Generate New Key
          </Button>
        </div>
        
        {apiKeys.map(key => (
          <div key={key.id} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="text-white font-medium text-sm sm:text-base truncate">{key.name}</div>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 text-xs h-8 flex-shrink-0">
                Revoke
              </Button>
            </div>
            <div className="font-mono text-xs sm:text-sm text-zinc-500 bg-zinc-950 px-2 py-1.5 rounded mb-2 overflow-x-auto">
              {key.key}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-zinc-500">
              <span>Created: {key.created}</span>
              <span>Last used: {key.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">Webhooks</h3>
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-lg p-4 sm:p-6 text-center">
          <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600 mx-auto mb-2" />
          <div className="text-zinc-400 text-sm sm:text-base">No webhooks configured</div>
          <Button variant="ghost" size="sm" className="mt-2 text-cyan-400 hover:text-cyan-300 h-10">
            Add Webhook
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function DataSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Data Management</h2>
        <p className="text-sm text-zinc-400 mt-1">Export, import, and manage your data</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-sm font-medium text-zinc-300">Export Data</h3>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-white font-medium text-sm sm:text-base">Export All Decisions</div>
              <div className="text-xs sm:text-sm text-zinc-500">Download your decision history as CSV or JSON</div>
            </div>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 border border-zinc-700 h-10 w-full sm:w-auto flex-shrink-0">
              Export
            </Button>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-white font-medium text-sm sm:text-base">Export Analytics</div>
              <div className="text-xs sm:text-sm text-zinc-500">Download usage and performance metrics</div>
            </div>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 border border-zinc-700 h-10 w-full sm:w-auto flex-shrink-0">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">Data Retention</h3>
        
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Keep decision history for</label>
          <select className="w-full px-3 py-2.5 sm:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500/50 focus:outline-none h-10 sm:h-auto">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
            <option>Forever</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-sm font-medium text-red-400">Danger Zone</h3>
        
        <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-white font-medium text-sm sm:text-base">Delete All Data</div>
              <div className="text-xs sm:text-sm text-zinc-500">Permanently delete all your data and decisions</div>
            </div>
            <Button variant="ghost" className="text-red-400 hover:text-red-300 border border-red-900/50 hover:bg-red-900/20 h-10 w-full sm:w-auto flex-shrink-0">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ToggleOptionProps {
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleOption({ icon: Icon, label, description, enabled, onToggle }: ToggleOptionProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 gap-3 min-h-[60px]">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon className="w-5 h-5 text-zinc-400 flex-shrink-0" />
        <div className="min-w-0">
          <div className="text-white font-medium text-sm sm:text-base truncate">{label}</div>
          <div className="text-xs sm:text-sm text-zinc-500 truncate">{description}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'w-11 h-6 rounded-full relative transition-colors flex-shrink-0',
          enabled ? 'bg-cyan-600' : 'bg-zinc-700'
        )}
      >
        <div className={cn(
          'absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform',
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  );
}

export default SettingsView;

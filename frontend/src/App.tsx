import React, { useState, useCallback } from 'react';
import './styles/globals.css';

// Layout components
import { AppShell } from './components/layout/AppShell';
import { DetailPanel } from './components/layout/DetailPanel';
import { ConstraintBar, type Constraint, type FilterOption } from './components/layout/ConstraintBar';

// Query components
import { QueryInput } from './components/query/QueryInput';
import { ConversationThread, type Message } from './components/query/ConversationThread';
import type { SourceSummary } from './components/query/Messages';

// Results components
import { ResultsList, type RankedEntity } from './components/results';

// Evidence components
import { EntityDetail, type ConstraintCheck, type ScoreComponent } from './components/evidence';

// Views
import { DataSourcesView } from './components/views/DataSourcesView';
import { HistoryView } from './components/views/HistoryView';
import { SettingsView } from './components/views/SettingsView';

// Other components
import Aurora from './components/Aurora';

// Mock data for demonstration
const mockResults: RankedEntity[] = [
  {
    id: '1',
    name: 'React Framework',
    title: 'Frontend Library',
    subtitle: 'Meta',
    score: 92,
    rank: 1,
    movement: 'up',
    attributes: [
      { label: 'Performance', value: 'Excellent', sentiment: 'positive' },
      { label: 'Community', value: 'Large', sentiment: 'positive' },
      { label: 'Learning Curve', value: 'Moderate', sentiment: 'neutral' },
    ],
    metadata: { category: 'Frontend', updated: '2 days ago' },
  },
  {
    id: '2',
    name: 'Vue.js',
    title: 'Progressive Framework',
    subtitle: 'Evan You',
    score: 87,
    rank: 2,
    movement: null,
    attributes: [
      { label: 'Ease of Use', value: 'High', sentiment: 'positive' },
      { label: 'Bundle Size', value: 'Small', sentiment: 'positive' },
    ],
    metadata: { category: 'Frontend', updated: '5 days ago' },
  },
  {
    id: '3',
    name: 'Angular',
    title: 'Enterprise Framework',
    subtitle: 'Google',
    score: 78,
    rank: 3,
    movement: 'down',
    attributes: [
      { label: 'TypeScript', value: 'Built-in', sentiment: 'positive' },
      { label: 'Complexity', value: 'High', sentiment: 'negative' },
    ],
    metadata: { category: 'Frontend', updated: '1 week ago' },
  },
];

const mockConstraintChecks: ConstraintCheck[] = [
  { id: '1', label: 'Meets performance requirements', passed: true },
  { id: '2', label: 'Active community support', passed: true },
  { id: '3', label: 'TypeScript support available', passed: true },
  { id: '4', label: 'Enterprise adoption', passed: false, details: 'Limited enterprise case studies' },
];

const mockScoreComponents: ScoreComponent[] = [
  { id: '1', label: 'Relevance', value: 35, color: '#6366f1' },
  { id: '2', label: 'Quality', value: 30, color: '#22c55e' },
  { id: '3', label: 'Recency', value: 20, color: '#f59e0b' },
  { id: '4', label: 'Authority', value: 15, color: '#3b82f6' },
];

const mockEvidenceSources = [
  {
    source: 'github' as const,
    label: 'GitHub Repositories',
    items: [
      { id: '1', content: 'High star count and active development with regular releases.', timestamp: '2 hours ago' },
      { id: '2', content: 'Strong contributor base with diverse maintainer team.', timestamp: '1 day ago' },
    ],
  },
  {
    source: 'slack' as const,
    label: 'Team Discussions',
    items: [
      { id: '3', content: 'Team has positive experience with migration from legacy system.', author: 'Engineering', timestamp: '3 days ago' },
    ],
  },
];

const mockSourceSummaries: SourceSummary[] = [
  { id: 'github', name: 'GitHub', recordCount: 12, status: 'success' },
  { id: 'jira', name: 'Jira', recordCount: 8, status: 'success' },
  { id: 'slack', name: 'Slack', recordCount: 5, status: 'success' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [results, setResults] = useState<RankedEntity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeNavId, setActiveNavId] = useState('dashboard');
  const [queryInputValue, setQueryInputValue] = useState('');

  const selectedEntity = results.find(r => r.id === selectedEntityId) || null;

  // Available filter options
  const filterOptions: FilterOption[] = [
    { field: 'status', operator: 'eq', value: 'Active' },
    { field: 'status', operator: 'eq', value: 'Inactive' },
    { field: 'experience', operator: 'gte', value: '3 years' },
    { field: 'experience', operator: 'gte', value: '5 years' },
    { field: 'priority', operator: 'eq', value: 'High' },
    { field: 'priority', operator: 'eq', value: 'Medium' },
    { field: 'bugs', operator: 'eq', value: 'No P1 bugs' },
    { field: 'department', operator: 'eq', value: 'Engineering' },
  ];

  const handleNavigate = useCallback((id: string) => {
    setActiveNavId(id);
    // In a real app, this would navigate to different views
    console.log('Navigate to:', id);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your query about "${content}", I've analyzed multiple sources and ranked the best options for you. The results consider performance metrics, community feedback, and enterprise adoption rates.`,
        sources: mockSourceSummaries,
        resultCount: mockResults.length,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSelectEntity = useCallback((entity: RankedEntity) => {
    setSelectedEntityId(entity.id);
    setIsDetailOpen(true);
  }, []);

  const handleAddConstraint = useCallback((filter: { field: string; operator: string; value: string }) => {
    const newConstraint: Constraint = {
      id: Date.now().toString(),
      field: filter.field,
      operator: filter.operator,
      value: filter.value,
    };
    setConstraints(prev => [...prev, newConstraint]);
  }, []);

  const handleRemoveConstraint = useCallback((id: string) => {
    setConstraints(prev => prev.filter(c => c.id !== id));
  }, []);

  const handleExampleClick = useCallback((query: string) => {
    setQueryInputValue(query);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background - Dark blue theme with smooth edges */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#0F172A", "#1E3A8A", "#1D4ED8"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <AppShell
        isDetailOpen={isDetailOpen}
        activeNavId={activeNavId}
        onNavigate={handleNavigate}
        constraintBar={
          activeNavId === 'dashboard' ? (
            <ConstraintBar
              constraints={constraints}
              filterOptions={filterOptions}
              onRemove={handleRemoveConstraint}
              onAddFilter={handleAddConstraint}
            />
          ) : undefined
        }
        detailPanel={
          selectedEntity ? (
            <DetailPanel
              onClose={() => setIsDetailOpen(false)}
              title={selectedEntity.name}
              subtitle={selectedEntity.title}
            >
              <EntityDetail
                entity={selectedEntity}
                evidenceSources={mockEvidenceSources}
                constraints={mockConstraintChecks}
                scoreComponents={mockScoreComponents}
              />
            </DetailPanel>
          ) : null
        }
      >
        {/* Render view based on active navigation */}
        {activeNavId === 'sources' ? (
          <DataSourcesView
            onConnect={(id) => console.log('Connect:', id)}
            onDisconnect={(id) => console.log('Disconnect:', id)}
            onSync={(id) => console.log('Sync:', id)}
            onConfigure={(id) => console.log('Configure:', id)}
            onAddSource={() => console.log('Add source')}
          />
        ) : activeNavId === 'history' ? (
          <HistoryView
            onSelect={(item) => console.log('Select:', item)}
            onDelete={(id) => console.log('Delete:', id)}
            onExport={() => console.log('Export')}
          />
        ) : activeNavId === 'settings' ? (
          <SettingsView
            onSave={() => console.log('Save settings')}
          />
        ) : (
          /* Dashboard View - Main Content Area with Chat */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              {/* Conversation Thread */}
              <div className="flex justify-center w-full">
                <div className="w-full max-w-3xl px-4 pt-4">
                  <ConversationThread 
                    messages={messages} 
                    isLoading={isLoading}
                    loadingSources={mockSourceSummaries}
                    onExampleClick={handleExampleClick}
                  />
                </div>
              </div>
              
              {/* Results List - appears after query */}
              {results.length > 0 && (
                <div className="border-t border-zinc-700/50 mt-4">
                  <div className="max-w-4xl mx-auto">
                    <ResultsList
                      results={results}
                      selectedId={selectedEntityId}
                      onSelect={handleSelectEntity}
                    />
                  </div>
                </div>
              )}
              
              {/* Bottom spacer to prevent content from hiding behind input */}
              <div className="h-28" />
            </div>
            
            {/* Query Input - Fixed at bottom */}
            <div className="flex-shrink-0 pt-4 pb-4">
              <div className="max-w-3xl mx-auto px-4">
                <QueryInput
                  onSubmit={(query) => {
                    handleSendMessage(query);
                    setQueryInputValue('');
                  }}
                  isLoading={isLoading}
                  placeholder="Ask MERIDIAN to analyze and rank options..."
                  value={queryInputValue}
                  onChange={setQueryInputValue}
                />
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </div>
  );
}

export default App;

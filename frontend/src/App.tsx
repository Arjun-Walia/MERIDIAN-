import React, { useState, useCallback } from 'react';
import './styles/globals.css';

// Layout components
import { AppShell } from './components/layout/AppShell';
import { DetailPanel } from './components/layout/DetailPanel';
import { ConstraintBar, type Constraint } from './components/layout/ConstraintBar';

// Query components
import { QueryInput } from './components/query/QueryInput';
import { ConversationThread, type Message } from './components/query/ConversationThread';
import type { SourceSummary } from './components/query/Messages';

// Results components
import { ResultsList, type RankedEntity } from './components/results';

// Evidence components
import { EntityDetail, type ConstraintCheck, type ScoreComponent } from './components/evidence';

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

  const selectedEntity = results.find(r => r.id === selectedEntityId) || null;

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

  const handleAddConstraint = useCallback(() => {
    const newConstraint: Constraint = {
      id: Date.now().toString(),
      field: 'status',
      operator: 'eq',
      value: 'Active',
    };
    setConstraints(prev => [...prev, newConstraint]);
  }, []);

  const handleRemoveConstraint = useCallback((id: string) => {
    setConstraints(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <div className="relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <Aurora
          colorStops={["#6366f1", "#8b5cf6", "#3b82f6"]}
          blend={0.3}
          amplitude={0.8}
          speed={0.5}
        />
      </div>

      <AppShell
        isDetailOpen={isDetailOpen}
        activeNavId={activeNavId}
        onNavigate={handleNavigate}
        constraintBar={
          <ConstraintBar
            constraints={constraints}
            onRemove={handleRemoveConstraint}
            onAddClick={handleAddConstraint}
          />
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
        {/* Main Content Area - Centered Layout */}
        <div className="flex-1 flex flex-col h-full">
          {/* Scrollable content area with centering */}
          <div className="flex-1 flex flex-col overflow-auto">
            <div className="flex-1 flex justify-center w-full">
              <div className="w-full max-w-3xl">
                {/* Conversation Thread */}
                <ConversationThread 
                  messages={messages} 
                  isLoading={isLoading}
                  loadingSources={mockSourceSummaries}
                />
              </div>
            </div>
          </div>
          
          {/* Results List - appears after query */}
          {results.length > 0 && (
            <div className="border-t border-border-default max-h-[40vh]">
              <ResultsList
                results={results}
                selectedId={selectedEntityId}
                onSelect={handleSelectEntity}
              />
            </div>
          )}
          
          {/* Query Input - fixed at bottom with centering */}
          <div className="bg-base">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <QueryInput
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask MERIDIAN to analyze and rank options..."
              />
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

export default App;

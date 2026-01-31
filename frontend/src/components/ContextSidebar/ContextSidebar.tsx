import React from 'react';
import './ContextSidebar.css';
import { DataSource } from '../../types';

interface ContextSidebarProps {
  sources: DataSource[];
}

const ContextSidebar: React.FC<ContextSidebarProps> = ({ sources }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#22c55e';
      case 'error': return '#ef4444';
      default: return '#666';
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'jira': return '📋';
      case 'mongodb': return '🍃';
      case 'slack': return '💬';
      case 'ats': return '👥';
      case 'github': return '🐙';
      default: return '📁';
    }
  };

  return (
    <aside className="context-sidebar">
      <div className="sidebar-section">
        <h3>📊 Data Sources</h3>
        <ul className="sources-list">
          {sources.map((source) => (
            <li key={source.id} className="source-item">
              <span className="source-icon">{getSourceIcon(source.type)}</span>
              <span className="source-name">{source.name}</span>
              <span 
                className="source-status"
                style={{ backgroundColor: getStatusColor(source.status) }}
              />
            </li>
          ))}
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h3>🔗 Quick Actions</h3>
        <button className="action-btn">+ Connect Source</button>
        <button className="action-btn">📥 Import Data</button>
        <button className="action-btn">⚙️ Settings</button>
      </div>
      
      <div className="sidebar-section">
        <h3>📈 Recent Decisions</h3>
        <p className="empty-state">No decisions yet</p>
      </div>
    </aside>
  );
};

export default ContextSidebar;

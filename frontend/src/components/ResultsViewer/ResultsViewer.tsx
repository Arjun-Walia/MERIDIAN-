import React from 'react';
import './ResultsViewer.css';
import { Recommendation } from '../../types';

interface ResultsViewerProps {
  recommendations: Recommendation[];
}

const ResultsViewer: React.FC<ResultsViewerProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <aside className="results-viewer">
        <div className="results-header">
          <h3>🎯 Recommendations</h3>
        </div>
        <div className="empty-results">
          <p>Ask a question to see ranked recommendations with evidence.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="results-viewer">
      <div className="results-header">
        <h3>🎯 Recommendations</h3>
        <span className="result-count">{recommendations.length} results</span>
      </div>
      
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div key={rec.entityId} className="recommendation-card">
            <div className="rec-header">
              <span className="rec-rank">#{index + 1}</span>
              <span className="rec-name">{rec.displayName}</span>
              <span className="rec-score">{Math.round(rec.score * 100)}%</span>
            </div>
            
            <p className="rec-explanation">{rec.explanation}</p>
            
            <div className="rec-evidence">
              <h4>Evidence:</h4>
              {rec.evidence.map((ev, i) => (
                <div key={i} className="evidence-item">
                  <span className="evidence-source">{ev.sourceId}</span>
                  <span className="evidence-text">{ev.explanation}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ResultsViewer;

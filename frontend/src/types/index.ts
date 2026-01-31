/**
 * MERIDIAN Frontend Type Definitions
 */

// Message Types
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: string[];
    confidence?: number;
    processingTime?: number;
  };
}

// Data Source Types
export type DataSourceType = 'jira' | 'mongodb' | 'slack' | 'ats' | 'github' | 'custom';

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

// Recommendation Types
export interface Evidence {
  sourceId: string;
  entityId: string;
  field: string;
  value: any;
  explanation: string;
  weight: number;
}

export interface Recommendation {
  entityId: string;
  displayName: string;
  score: number;
  rank: number;
  evidence: Evidence[];
  explanation: string;
}

// API Response Types
export interface ChatResponse {
  message: string;
  recommendations: Recommendation[];
  queriedSources: string[];
  processingTime: number;
  confidence: number;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

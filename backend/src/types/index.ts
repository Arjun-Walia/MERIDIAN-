/**
 * MERIDIAN Type Definitions
 */

// Data Source Types
export type DataSourceType = 'jira' | 'mongodb' | 'slack' | 'ats' | 'github' | 'custom';

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  lastSync?: Date;
}

// Query Types
export interface QueryConstraint {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface QueryPlan {
  sourceId: string;
  entityType: string;
  constraints: QueryConstraint[];
  requiredFields: string[];
  priority: number;
}

// Response Types
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

export interface ChatResponse {
  message: string;
  recommendations: Recommendation[];
  queriedSources: string[];
  processingTime: number;
  confidence: number;
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: any;
}

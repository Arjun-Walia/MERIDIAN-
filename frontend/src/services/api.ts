import axios, { AxiosInstance } from 'axios';
import { ChatResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Send a chat message to the backend
   */
  async sendChat(message: string, context?: Record<string, any>): Promise<ChatResponse> {
    try {
      const response = await this.client.post('/chat', { message, context });
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  /**
   * Get available data sources
   */
  async getSources(): Promise<any[]> {
    const response = await this.client.get('/sources');
    return response.data.sources;
  }

  /**
   * Connect to a data source
   */
  async connectSource(sourceId: string, config: Record<string, any>): Promise<any> {
    const response = await this.client.post('/sources/connect', { sourceId, config });
    return response.data;
  }

  /**
   * Get decision history
   */
  async getDecisions(): Promise<any[]> {
    const response = await this.client.get('/decisions');
    return response.data.decisions;
  }

  /**
   * Get a specific decision with evidence
   */
  async getDecision(id: string): Promise<any> {
    const response = await this.client.get(`/decisions/${id}`);
    return response.data;
  }

  /**
   * Record decision outcome
   */
  async recordOutcome(id: string, outcome: string, feedback?: string): Promise<any> {
    const response = await this.client.post(`/decisions/${id}/outcome`, { outcome, feedback });
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.data.status === 'ok';
    } catch {
      return false;
    }
  }
}

export default new ApiService();

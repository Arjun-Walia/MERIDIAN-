/**
 * MongoDB Adapter - Internal database adapter for MERIDIAN data
 */

import mongoose from 'mongoose';

export interface MongoConfig {
  uri: string;
  database: string;
}

export class MongoAdapter {
  private connected: boolean = false;
  
  /**
   * Check if connected to MongoDB
   */
  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
  
  /**
   * Query a collection with filters
   */
  async query(collection: string, filters: Record<string, any>): Promise<any[]> {
    if (!this.isConnected()) throw new Error('MongoDB not connected');
    const col = mongoose.connection.collection(collection);
    return col.find(filters).toArray();
  }
  
  /**
   * Aggregate data from a collection
   */
  async aggregate(collection: string, pipeline: any[]): Promise<any[]> {
    if (!this.isConnected()) throw new Error('MongoDB not connected');
    const col = mongoose.connection.collection(collection);
    return col.aggregate(pipeline).toArray();
  }
  
  /**
   * Get statistics about the database
   */
  async getStats(): Promise<any> {
    if (!this.isConnected()) throw new Error('MongoDB not connected');
    return mongoose.connection.db?.stats();
  }
}

export default new MongoAdapter();

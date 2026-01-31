import mongoose, { Schema, Document } from 'mongoose';

export interface IEntity extends Document {
  canonicalId: string;
  type: 'person' | 'project' | 'issue' | 'document' | 'other';
  displayName: string;
  sourceIds: Map<string, string>;
  attributes: Map<string, any>;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema = new Schema<IEntity>({
  canonicalId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    required: true,
    enum: ['person', 'project', 'issue', 'document', 'other']
  },
  displayName: { type: String, required: true },
  sourceIds: { type: Map, of: String, default: {} },
  attributes: { type: Map, of: Schema.Types.Mixed, default: {} },
  confidence: { type: Number, default: 1.0, min: 0, max: 1 }
}, {
  timestamps: true
});

// Index for efficient lookups
EntitySchema.index({ type: 1 });
EntitySchema.index({ 'sourceIds.$**': 1 });

export default mongoose.model<IEntity>('Entity', EntitySchema);

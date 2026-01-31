import mongoose, { Schema, Document } from 'mongoose';

export interface IEvidence {
  sourceId: string;
  data: any;
  weight: number;
  explanation: string;
}

export interface IRecommendation {
  entityId: string;
  score: number;
  rank: number;
  evidence: IEvidence[];
}

export interface IDecision extends Document {
  query: string;
  context: Record<string, any>;
  recommendations: IRecommendation[];
  selectedId?: string;
  outcome?: 'positive' | 'negative' | 'neutral';
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceSchema = new Schema<IEvidence>({
  sourceId: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  weight: { type: Number, default: 1.0 },
  explanation: { type: String, required: true }
});

const RecommendationSchema = new Schema<IRecommendation>({
  entityId: { type: String, required: true },
  score: { type: Number, required: true },
  rank: { type: Number, required: true },
  evidence: [EvidenceSchema]
});

const DecisionSchema = new Schema<IDecision>({
  query: { type: String, required: true },
  context: { type: Map, of: Schema.Types.Mixed, default: {} },
  recommendations: [RecommendationSchema],
  selectedId: { type: String },
  outcome: { 
    type: String, 
    enum: ['positive', 'negative', 'neutral']
  },
  feedback: { type: String }
}, {
  timestamps: true
});

// Index for analytics
DecisionSchema.index({ createdAt: -1 });
DecisionSchema.index({ outcome: 1 });

export default mongoose.model<IDecision>('Decision', DecisionSchema);

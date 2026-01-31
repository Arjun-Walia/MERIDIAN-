import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface IChatSession extends Document {
  userId?: string;
  title: string;
  messages: IMessage[];
  context: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { 
    type: String, 
    required: true,
    enum: ['user', 'assistant', 'system']
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Map, of: Schema.Types.Mixed }
});

const ChatSessionSchema = new Schema<IChatSession>({
  userId: { type: String },
  title: { type: String, default: 'New Chat' },
  messages: [MessageSchema],
  context: { type: Map, of: Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index for efficient queries
ChatSessionSchema.index({ userId: 1, createdAt: -1 });
ChatSessionSchema.index({ isActive: 1 });

export default mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

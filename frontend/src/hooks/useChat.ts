import { useState, useCallback } from 'react';
import { Message, Recommendation, DataSource, ChatResponse } from '../types';
import api from '../services/api';

interface UseChatReturn {
  messages: Message[];
  recommendations: Recommendation[];
  sources: DataSource[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Default data sources
  const [sources] = useState<DataSource[]>([
    { id: 'jira', type: 'jira', name: 'Jira', status: 'disconnected' },
    { id: 'mongodb', type: 'mongodb', name: 'MongoDB', status: 'connected' },
    { id: 'slack', type: 'slack', name: 'Slack', status: 'disconnected' },
    { id: 'ats', type: 'ats', name: 'ATS', status: 'disconnected' }
  ]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response: ChatResponse = await api.sendChat(content);
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        metadata: {
          sources: response.queriedSources,
          confidence: response.confidence,
          processingTime: response.processingTime
        }
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update recommendations
      if (response.recommendations.length > 0) {
        setRecommendations(response.recommendations);
      }
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setRecommendations([]);
  }, []);

  return {
    messages,
    recommendations,
    sources,
    isLoading,
    sendMessage,
    clearChat
  };
};

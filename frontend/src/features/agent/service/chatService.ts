import { request } from '@/lib/axios';
import type { ChatMessage, NewConversation, Thread, ThreadList } from '../types';
import type { OnboardingKeywords, OnboardingSummaryResponse } from '@/features/aesthetics/types';

const AGENT_API_BASE = '/agent';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  thread_id: string;
  message: string;
  timestamp?: string;
}

export interface ThreadMessagesResponse {
  thread_id: string;
  messages: Array<{
    sender: string;
    content: string;
    timestamp: string;
  }>;
}

export interface ThreadInfo {
  thread_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export const chatService = {
  /**
   * Send a message to the agent for a specific thread
   */
  async askAgent(threadId: string, message: string): Promise<ChatResponse> {
    const response = await request({
      method: 'POST',
      url: `${AGENT_API_BASE}/threads/${threadId}/messages/`,
      data: { message }
    });
    return response.data;
  },

  /**
   * Get all messages for a specific thread
   */
  async getThreadMessages(threadId: string): Promise<Thread> {
    const response = await request({
      method: 'GET',
      url: `${AGENT_API_BASE}/threads/${threadId}/messages/`
    });
    return response.data;
  },

  /**
   * Get list of all threads
   */
  async listThreads(): Promise<Thread[]> {
    const response = await request({
      method: 'GET',
      url: `${AGENT_API_BASE}/threads/`
    });
    return response.data;
  },

  async getOnboardingThread(): Promise<Thread> {
    const response = await request({
      method: 'GET',
      url: `${AGENT_API_BASE}/onboarding/threads/`
    });
    return response.data;
  },

  /**
   * Create a new thread
   */
  async createNewThread(title?: string): Promise<Thread> {
    const response = await request({
      method: 'POST',
      url: `${AGENT_API_BASE}/threads/`,
      data: title ? { title } : {}
    });
    return response.data;
  },

  /**
   * Clear/delete a specific thread
   */
  async clearThread(threadId: string): Promise<{ message: string }> {
    const response = await request({
      method: 'DELETE',
      url: `${AGENT_API_BASE}/threads/${threadId}/`
    });
    return response.data;
  },

  /**
   * Generate a title for a specific thread
   */
  async generateThreadTitle(threadId: string): Promise<{ id: string; title: string; message: string }> {
    const response = await request({
      method: 'POST',
      url: `${AGENT_API_BASE}/threads/${threadId}/generate-title/`
    });
    return response.data;
  },

  /**
   * Generate an onboarding summary with keywords for a specific thread
   */
  async generateOnboardingSummary(threadId: string): Promise<OnboardingSummaryResponse> {
    const response = await request({
      method: 'POST',
      url: `${AGENT_API_BASE}/onboarding/threads/${threadId}/generate-summary/`
    });
    return response.data;
  },


  /**
   * Convert thread info to frontend conversation format
   */
  convertToFrontendConversation(threadInfo: Thread, messages: ChatMessage[] = []): NewConversation {
    // Generate a title from the first user message or use a default
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    const title = firstUserMessage && firstUserMessage.content
      ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
      : 'New Conversation';

    return {
      id: threadInfo.id,
      title: threadInfo.title || title,
      createdAt: threadInfo.created_at,
      archived: false,
      messages,
    };
  },

};

export default chatService;

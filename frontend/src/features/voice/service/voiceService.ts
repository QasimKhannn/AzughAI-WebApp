import { request } from '@/lib/axios';

const VOICE_API_BASE = '/agent';

export interface RealtimeTokenResponse {
    clientSecret: string;
    expiresAt: number;
    sessionId: string;
}


export const voiceService = {
  /**
   * Get a realtime token for voice interactions
   */
  async getRealtimeToken(threadId?: string): Promise<RealtimeTokenResponse> {
    const response = await request({
      method: "GET",
      url: `${VOICE_API_BASE}/realtime-token/`,
        params: threadId ? { thread_id: threadId } : {},
    });
    return response.data;
  },

  /**
   * Save a voice message to a thread
   */
  async saveVoiceMessage(
    threadId: string,
    content: string,
    sender: "user" | "agent"
  ): Promise<void> {
    await request({
      method: "POST",
      url: `${VOICE_API_BASE}/threads/${threadId}/voice-message/`,
      data: { content, sender },
    });
  },
};
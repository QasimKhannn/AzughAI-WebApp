import api from '@/lib/axios.ts'
import { Thread } from '@/features/agent/types';

class AgentService {
    static async askAgent(prompt: string) {
        const response = await api.post('/agent/ask/', { prompt });
        return response.data;
    }

    static async getThreads(): Promise<Thread[]> {
        try {
            const response = await api.get('/agent/threads/');
            return response.data;
        } catch (error) {
            console.error('Error fetching threads:', error);
            throw error;
        }
    }

    static async createThread(title?: string): Promise<Thread> {
        try {
            const request_body = {
                title: title || null,
            }
            const response = await api.post('/agent/threads/', request_body);
            return response.data;
        } catch (error) {
            console.error('Error creating thread:', error);
            throw error;
        }
    }

    static async deleteThread(threadId: string): Promise<void> {
        try {
            const response = await api.delete(`/agent/threads/${threadId}/`);
            console.log(`[AgentService] Deleted thread with ID: ${threadId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting thread:', error);
            throw error;
        }
    }
}

export default AgentService;
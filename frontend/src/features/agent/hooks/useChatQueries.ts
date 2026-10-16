import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  chatService from '../service/chatService';
import type { ChatMessage, NewConversation } from '../types';
import type { OnboardingSummaryResponse } from '@/features/aesthetics/types';
import extractChunks from '../utils';

export const QUERY_KEYS = {
  threads: ['threads'],
  threadMessages: (threadId: string) => ['thread-messages', threadId],
  allThreads: ['all-threads'],
} as const;

/**
 * Hook to get list of all threads
 */
export const useThreadsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.threads,
    queryFn: async () => {
      const response = await chatService.listThreads();
      return response;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to get messages for a specific thread
 */
export const useThreadMessagesQuery = (threadId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.threadMessages(threadId || ''),
    queryFn: async () => {
      if (!threadId) return null;
      const response = await chatService.getThreadMessages(threadId);
      console.log('Fetched messages for thread', threadId, response);
      return response.messages;
    },
    enabled: !!threadId,
    staleTime: 10000, // 10 seconds
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to generate a thread title
 */
export const useGenerateThreadTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: string) => {
      return await chatService.generateThreadTitle(threadId);
    },
    onSuccess: (data, threadId) => {
      // Update the thread title in the threads cache
      // queryClient.setQueryData(
      //   QUERY_KEYS.threads,
      //   (oldThreads: any[] | undefined) => {
      //     if (!oldThreads) return [];
      //     return oldThreads.map(thread => 
      //       thread.id === threadId
      //         ? { ...thread, title: data.title }
      //         : thread
      //     );
      //   }
      // );
      console.log('Generated title for thread', threadId, data);
      
      // Also invalidate the threads query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.threads
      });
    },
    onError: (error) => {
      console.error('Failed to generate thread title:', error);
    }
  });
};

/**
 * Hook to generate an onboarding summary with keywords
 */
export const useGenerateOnboardingSummaryMutation = () => {
  return useMutation({
    mutationFn: async (threadId: string): Promise<OnboardingSummaryResponse> => {
      return await chatService.generateOnboardingSummary(threadId);
    },
    onSuccess: (data, threadId) => {
      console.log('Generated onboarding summary for thread', threadId, data);
    },
    onError: (error) => {
      console.error('Failed to generate onboarding summary:', error);
    }
  });
};

/**
 * Hook to send a message to the agent
 */
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const agentThinkingRef = useRef(false);
  const [agentThinking, setAgentThinking] = useState(false);
  const generateTitleMutation = useGenerateThreadTitleMutation();

  const mutation = useMutation({
    mutationFn: async ({ threadId, message }: { threadId: string; message: string }) => {
      // Set agent thinking to true when starting
      agentThinkingRef.current = true;
      setAgentThinking(true);

      // Add user message optimistically before sending
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        created_at: new Date().toISOString(),
        sender: 'user',
        msg_type: 'text',
        content: message,
        tool_call: null
      };

      queryClient.setQueryData(
        QUERY_KEYS.threadMessages(threadId),
        (oldMessages: ChatMessage[] | undefined) => {
          return oldMessages ? [...oldMessages, userMessage] : [userMessage];
        }
      );

      // Start streaming request
      const response = await fetch(`/api/agent/threads/${threadId}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

        if (!response.ok) {
        // Reset thinking state on error
        agentThinkingRef.current = false;
        setAgentThinking(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        // Reset thinking state on error
        agentThinkingRef.current = false;
        setAgentThinking(false);
        throw new Error('No response body reader available');
      }


      const decoder = new TextDecoder();
      let agentMessageCreated = false;
      let currentAgentMessageId = '';
      let firstChunkReceived = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          // Set agent thinking to false on first chunk received
          if (!firstChunkReceived) {
            agentThinkingRef.current = false;
            setAgentThinking(false);
            firstChunkReceived = true;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });

          // Extract complete chunks using delimiter
          const chunks = extractChunks(chunk);
          console.log('Extracted chunks:', chunks);
          

          // Process each complete chunk
          for (const chunkStr of chunks) { // Exclude the last potentially incomplete chunk
            try {
              const parsedChunk = JSON.parse(chunkStr);
              
              if (parsedChunk.type === 'token' && parsedChunk.content) {
                // Create agent message if not created yet
                if (!agentMessageCreated) {
                  currentAgentMessageId = `agent-${Date.now()}`;
                  const initialAgentMessage: ChatMessage = {
                    id: currentAgentMessageId,
                    created_at: new Date().toISOString(),
                    sender: 'agent',
                    msg_type: 'text',
                    content: parsedChunk.content,
                    tool_call: null,
                  };

                  queryClient.setQueryData(
                    QUERY_KEYS.threadMessages(threadId),
                    (oldMessages: ChatMessage[] | undefined) => {
                      return oldMessages ? [...oldMessages, initialAgentMessage] : [initialAgentMessage];
                    }
                  );
                  agentMessageCreated = true;
                } else {
                  // Update existing agent message with new content
                  queryClient.setQueryData(
                    QUERY_KEYS.threadMessages(threadId),
                    (oldMessages: ChatMessage[] | undefined) => {
                      if (!oldMessages) return [];
                      return oldMessages.map(msg => 
                        msg.id === currentAgentMessageId
                          ? { ...msg, content: msg.content + parsedChunk.content }
                          : msg
                      );
                    }
                  );
                }
              } else if (parsedChunk.type === 'tool_start') {
                // Create a new agent message for tool call
                const toolMessageId = `tool-${Date.now()}`;
                const toolMessage: ChatMessage = {
                  id: toolMessageId,
                  created_at: new Date().toISOString(),
                  sender: 'agent',
                  msg_type: 'tool_call',
                  content: '',
                  running: true,
                  tool_call: {
                    tool: parsedChunk.tool,
                    tool_type: parsedChunk.tool_type || 'function',
                    arguments: parsedChunk.input || {},
                    result_data: null,
                  },
                };

                queryClient.setQueryData(
                  QUERY_KEYS.threadMessages(threadId),
                  (oldMessages: ChatMessage[] | undefined) => {
                    return oldMessages ? [...oldMessages, toolMessage] : [toolMessage];
                  }
                );
                
                // Reset for next agent response
                currentAgentMessageId = toolMessageId;
              } else if (parsedChunk.type === 'tool_end') {
                let toolResult: Record<string, unknown> | null = null;
                if (parsedChunk.output) {
                  if (typeof parsedChunk.output === 'string') {
                    try {
                      toolResult = JSON.parse(parsedChunk.output);
                    } catch (err) {
                      console.warn('Failed to parse tool output JSON', err);
                    }
                  } else if (typeof parsedChunk.output === 'object') {
                    toolResult = parsedChunk.output as Record<string, unknown>;
                  }
                }

                // Update the tool message with results
                queryClient.setQueryData(
                  QUERY_KEYS.threadMessages(threadId),
                  (oldMessages: ChatMessage[] | undefined) => {
                    if (!oldMessages) return [];
                    return oldMessages.map(msg => 
                      msg.tool_call?.tool === parsedChunk.tool && msg.running
                        ? { 
                            ...msg, 
                            running: false,
                            tool_call: {
                              ...msg.tool_call!,
                              result_data: toolResult ?? msg.tool_call?.result_data ?? null,
                            }
                          }
                        : msg
                    );
                  }
                );
                
                // Prepare for next agent message after tool completion
                agentMessageCreated = false;
              } else if (parsedChunk.type === 'complete') {
                // Check if we should generate a title
                const currentThreads = queryClient.getQueryData(QUERY_KEYS.threads) as any[];
                const currentThread = currentThreads?.find(t => t.id === threadId);
                
                if (currentThread && (!currentThread.title || currentThread.title === 'New Conversation')) {
                  // Generate title immediately without delay and await the result
                  generateTitleMutation.mutateAsync(threadId)
                }
                
                // Stream is complete
                break;
              } else if (parsedChunk.type === 'error') {
                throw new Error(parsedChunk.message);
              }
            } catch (parseError) {
              console.warn('Failed to parse chunk:', chunkStr, parseError);
            }
          }
        }
      } finally {
        // Reset thinking state when done
        agentThinkingRef.current = false;
        setAgentThinking(false);
        reader.releaseLock();
      }

      // Return the final agent message for consistency
      return {
        agentResponse: {
          id: currentAgentMessageId,
          created_at: Math.floor(Date.now() / 1000),
          role: 'assistant' as const,
          type: 'text' as const,
          content: 'Response completed',
          name: null,
          arguments: null,
          state: null,
          expandable: false,
        }
      };
    },
    onError: (error, variables) => {
      console.error('Failed to send message:', error);
      // Remove the optimistically added user message on error
      queryClient.setQueryData(
        QUERY_KEYS.threadMessages(variables.threadId),
        (oldMessages: ChatMessage[] | undefined) => {
          if (!oldMessages) return [];
          // Remove the last message (which should be the optimistically added user message)
          return oldMessages.slice(0, -1);
        }
      );
    },
  });
    // Return both the mutation and the agentThinking state
  return {
    ...mutation,
    agentThinking,
  };
};

/**
 * Hook to create a new thread
 */
export const useCreateThreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await chatService.createNewThread();
    },
    onSuccess: () => {
      // Invalidate threads list to show the new thread
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.threads
      });
    },
    onError: (error) => {
      console.error('Failed to create thread:', error);
    }
  });
};

/**
 * Hook to create a new onboarding thread
 */
export const useCreateOnboardingThreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await chatService.getOnboardingThread();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.threads
      });
    },
    onError: (error) => {
      console.error('Failed to create onboarding thread:', error);
    }
  });
};

/**
 * Hook to clear/delete a thread
 */
export const useClearThreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: string) => {
      return await chatService.clearThread(threadId);
    },
    onSuccess: (_, threadId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.threadMessages(threadId)
      });
      
      // Invalidate threads list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.threads
      });
    },
    onError: (error) => {
      console.error('Failed to clear thread:', error);
    }
  });
};

/**
 * Hook to get a combined conversation object for a thread
 */
export const useConversationQuery = (threadId: string | null) => {
  const { data: threadInfo } = useThreadsQuery();
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useThreadMessagesQuery(threadId);

  const conversation: NewConversation | null = React.useMemo(() => {
    if (!threadId || !threadInfo) return null;
    
    const thread = threadInfo.find(t => t.id === threadId);
    if (!thread) return null;

    return chatService.convertToFrontendConversation(thread, messages || []);
  }, [threadId, threadInfo, messages]);

  return {
    conversation,
    isLoading: messagesLoading,
    error: messagesError,
  };
};

/**
 * Custom hook for chat functionality
 */
export const useChatQueries = (currentThreadId: string | null) => {
  const threadsQuery = useThreadsQuery();
  const conversationQuery = useConversationQuery(currentThreadId);
  const { data: messages, isLoading: isLoadingMessages, error: messagesError } = useThreadMessagesQuery(currentThreadId || '');
  const {agentThinking, ...sendMessageMutation} = useSendMessageMutation();
  const createThreadMutation = useCreateThreadMutation();
  const createOnboardingThreadMutation = useCreateOnboardingThreadMutation();
  const clearThreadMutation = useClearThreadMutation();
  const generateTitleMutation = useGenerateThreadTitleMutation();



  const sendMessage = React.useCallback(async (message: string, threadId?: string) => {
    const targetThreadId = threadId || currentThreadId;
    
    if (!targetThreadId) {
      throw new Error('No thread ID provided');
    }

    return sendMessageMutation.mutateAsync({
      threadId: targetThreadId,
      message,
    });
  }, [currentThreadId, sendMessageMutation]);

  const createNewThread = async () => {
    return createThreadMutation.mutateAsync();
  };

  const createNewOnboardingThread = async () => {
    return createOnboardingThreadMutation.mutateAsync();
  };

  const clearThread = async (threadId: string) => {
    return clearThreadMutation.mutateAsync(threadId);
  };

  return {
    // Data
    threads: threadsQuery.data || [],
    conversation: conversationQuery.conversation,
    messages: messages|| [],
    
    // Loading states
    isLoadingThreads: threadsQuery.isLoading,
    isLoadingMessages,
    isSendingMessage: sendMessageMutation.isPending,
    isCreatingThread: createThreadMutation.isPending,
    isCreatingOnboardingThread: createOnboardingThreadMutation.isPending,
    isClearingThread: clearThreadMutation.isPending,
    isGeneratingTitle: generateTitleMutation.isPending,
    agentThinking,
    
    // Errors
    threadsError: threadsQuery.error,
    messagesError: messagesError,
    sendMessageError: sendMessageMutation.error,
    generateTitleError: generateTitleMutation.error,
    
    // Actions
    sendMessage,
    createNewThread,
    createNewOnboardingThread,
    clearThread,
    generateThreadTitle: (threadId: string) => generateTitleMutation.mutate(threadId),
    
    // Utilities
    refetchThreads: threadsQuery.refetch,
    refetchMessages: () => conversationQuery.isLoading ? null : conversationQuery,
  };
};

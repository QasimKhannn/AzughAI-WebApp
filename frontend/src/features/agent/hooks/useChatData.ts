//import React from 'react';
import { useThreadsQuery } from './useChatQueries';

export const useChatData = () => {
  const { data: threads, isLoading: threadsLoading, error: threadsError, refetch: refetchThreads } = useThreadsQuery();

  return {
    threads: threads || [],
    threadsLoading,
    threadsError,
    refetchThreads,
  };
};
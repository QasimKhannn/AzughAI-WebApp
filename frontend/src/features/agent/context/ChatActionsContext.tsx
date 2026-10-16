import { createContext, useContext, ReactNode } from 'react';

interface ChatActionsContextType {
  sendMessage: (message: string) => Promise<void>;
  threadId: string | null;
}

const ChatActionsContext = createContext<ChatActionsContextType | undefined>(undefined);

export const ChatActionsProvider = ({
  children,
  sendMessage,
  threadId,
}: {
  children: ReactNode;
  sendMessage: (message: string) => Promise<void>;
  threadId: string | null;
}) => {
  return (
    <ChatActionsContext.Provider value={{ sendMessage, threadId }}>
      {children}
    </ChatActionsContext.Provider>
  );
};

export const useChatActions = () => {
  const context = useContext(ChatActionsContext);
  if (!context) {
    throw new Error('useChatActions must be used within a ChatActionsProvider');
  }
  return context;
};
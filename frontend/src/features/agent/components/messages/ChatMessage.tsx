/**
 * ChatMessage Component
 * 
 * PURPOSE: Acts as a unified message wrapper and router
 * 
 * RESPONSIBILITIES:
 * - Receives the complete message object as a prop
 * - Determines message type based on message.sender ('user' | 'agent')
 * - Delegates rendering to appropriate specialized component:
 *   → UserMessage if sender === 'user'
 *   → AgentMessage if sender === 'agent'
 * - This component should NOT contain any rendering logic itself
 * - Pure delegation pattern
 * 
 * PROPS:
 * - message: ChatMessage (full message object from types.ts)
 * 
 * EXAMPLE USAGE:
 * ```tsx
 * import ChatMessage from '../messages/ChatMessage';
 * <ChatMessage message={message} />
 * ```
 * 
 * IMPLEMENTATION GUIDE:
 * 1. Import UserMessage and AgentMessage components
 * 2. Import ChatMessage type from '../../types'
 * 3. Create simple component that checks message.sender
 * 4. Return UserMessage or AgentMessage accordingly
 * 5. Pass entire message object as prop to child component
 * 
 * DO NOT:
 * - Include any styling or layout logic here
 * - Duplicate code from UserMessage or AgentMessage
 * - Handle message content rendering directly
 * 
 * See docs/CHAT_FEEDBACK.md for detailed implementation guide
 */

import type { ChatMessage as ChatMessageType } from '../../types';
import UserMessage from './UserMessage';
import AgentMessage from './AgentMessage';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  
  return (
    <div className={`flex w-full max-w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isUser ? (
        <UserMessage message={message} />
      ) : (
        <AgentMessage message={message} />
      )}
    </div>
  )
}

/**
 * ChatMessages Component
 *
 * PURPOSE: Container component that manages ONLY the message list
 *
 * RESPONSIBILITIES:
 * - Loop through messages array
 * - Render ChatMessage component for each message
 * - Display "agent thinking" loading state
 * - Handle scrolling behavior
 *
 * ❌ CURRENT ISSUE: Contains ChatInput (should be removed)
 *
 * ARCHITECTURE NOTE:
 * This component should ONLY render messages. ChatInput should be
 * in the parent ChatInterface (Chat.tsx) component for proper separation of concerns
 *
 * REQUIRED CHANGE:
 * - Replace MessageBubble with ChatMessage component
 *
 * BEFORE (current):
 * ```tsx
 * import MessageBubble from "./MessageBubble";
 * <MessageBubble key={message.id} message={message} />
 * ```
 *
 * AFTER (target):
 * ```tsx
 * import ChatMessage from "../messages/ChatMessage";
 * <ChatMessage key={message.id} message={message} />
 * ```
 *
 * PROPS (CURRENT):
 * - messages: ChatMessage[] - array of all messages in conversation
 * - agentThinking: boolean - whether agent is processing
 * - isSendingMessage: boolean - whether user message is being sent ❌ REMOVE
 * - onSendMessage: (message: string) => void - callback for new messages ❌ REMOVE
 *
 * PROPS (AFTER REFACTOR):
 * - messages: ChatMessage[] - array of all messages in conversation
 * - agentThinking: boolean - whether agent is processing
 *
 * LAYOUT:
 * - Scrollable message area (overflow-y-auto)
 * - Auto-scroll to bottom on new messages (optional enhancement)
 * - ❌ NO ChatInput - that belongs in ChatInterface (Chat.tsx)
 *
 * REQUIRED CHANGES:
 * 1. Remove ChatInput from this component
 * 2. Remove onSendMessage and isSendingMessage props
 * 3. Swap MessageBubble for ChatMessage from ../messages/ChatMessage
 * 4. Focus solely on rendering message list
 *
 * See docs/CHAT_FEEDBACK.md for detailed implementation guide
 */

import { it } from "node:test";
import type { ChatMessage as ChatMessageType } from "../../types";
// // TODO: Replace MessageBubble import with ChatMessage
import {ChatMessage, LoadingMessage } from "../messages";
import { useEffect, useRef } from "react";
import { mockProducts } from "@/features/products/types";

const mockToolCall: ChatMessageType = {
  id: "toolcall1",
  created_at: new Date().toISOString(),
  msg_type: "tool_call",
  sender: "agent",
  content: null,
  tool_call: {
    tool: "lookup_items",
    tool_type: "widget",
    arguments: {
      items: [
        ...mockProducts
      ]
    },
    result_data: null,
  }
}

const mockToolCall1: ChatMessageType = {
  id: "toolcall1",
  created_at: new Date().toISOString(),
  msg_type: "tool_call",
  sender: "agent",
  content: null,
  tool_call: {
    tool: "open_aesthetics",
    tool_type: "widget",
    arguments: {
    },
    result_data: null,
  }
}

const mockToolCall2: ChatMessageType = {
  id: "toolcall2",
  created_at: new Date().toISOString(),
  msg_type: "tool_call",
  sender: "agent",
  content: null,
  tool_call: {
    tool: "upload_images",
    tool_type: "widget",
    arguments: {
    },
    result_data: null,
  }
}

const mockToolCall3: ChatMessageType = {
  id: "toolcall3",
  created_at: new Date().toISOString(),
  msg_type: "tool_call",
  sender: "agent",
  content: null,
  tool_call: {
    tool: "upload_closet_items",
    tool_type: "widget",
    arguments: {
    },
    result_data: null,
  }
}

interface ChatMessagesProps {
  messages: ChatMessageType[];
  agentThinking: boolean;
}

const ChatMessages = ({ messages, agentThinking }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="w-full space-y-4">
      {messages.length === 0 ? (
        <></>
      ) : (
        messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
          />
        ))
      )}

      {agentThinking && <LoadingMessage />}
      {/* <ChatMessage message={mockToolCall} />
      <ChatMessage message={mockToolCall1} />
      <ChatMessage message={mockToolCall2} />
      <ChatMessage message={mockToolCall3} /> */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

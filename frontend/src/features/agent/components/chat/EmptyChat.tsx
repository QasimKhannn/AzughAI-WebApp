/**
 * EmptyChat Component
 *
 * PURPOSE: Display UI for starting new conversations
 *
 * CURRENT STATE: ✅ Structure is correct, needs click handlers
 *
 * COMPONENTS:
 * - Welcome message with user's name
 * - NewChatWidgetOptions (3 suggestion cards)
 * - ChatInput
 *
 * USAGE:
 * - Rendered by ChatPage component in src/pages/chat/index.tsx
 * - NOT used directly in App.tsx (that's the page component's job)
 * - Should NOT be in ChatInterface (Chat.tsx) - that's for active chats
 *
 * REQUIRED ENHANCEMENT:
 * Add onClick handlers to NewChatWidgetOptions cards:
 *
 * 1. Pass handleSuggestionClick to NewChatWidgetOptions
 * 2. Each card should have onClick that calls:
 *    onSendMessage(prebuiltMessage)
 * 3. Prebuilt messages:
 *    - "Ask about a document" → "Help me search my archive"
 *    - "Run a deep search" → "I need to run a deep search"
 *    - "Summarize a document" → "Summarize a document for me"
 *
 * PROPS:
 * - onSendMessage: Creates thread → navigates to /chat/:id
 * - disabled: Loading state
 * - placeholder: Input placeholder text
 *
 * BEHAVIOR:
 * 1. User types message OR clicks suggestion
 * 2. onSendMessage(message) is called
 * 3. Parent creates new thread via API
 * 4. Parent navigates to /chat/:id with {state: {initialMessage}}
 * 5. Message is NOT sent to backend yet (sent in /chat/:id page)
 *
 * See docs/CHAT_FEEDBACK.md for complete implementation
 */

import { StartOptionsWidget } from "../widgets";
import ChatInput from "./ChatInput";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface EmptyChatProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onStartVoice?: () => void;
}

const EmptyChat = ({
  onSendMessage,
  disabled,
  placeholder,
  onStartVoice,
}: EmptyChatProps) => {
  const { user } = useAuth();

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      onSendMessage(message.trim());
    }
  };

  return (
    <div className="h-full w-full max-w-2xl flex flex-col justify-between items-center self-center bg-transparent pt-2 xl:pt-8">
      {/* Spacer to push content to center */}
      <div className="flex-1" />

      {/* Center content */}
      <div className="flex flex-col items-center pb-10 xl:px-0 px-4">
        <div className="text-left xl:text-center space-y-2 mb-6 px-4">
          <h2 className="text-2xl xl:text-3xl font-medium text-white font-manrope">
            Hi {user?.first_name || "there"}, how are you today?
          </h2>
          <p className="text-white font-light text-base leading-relaxed">
            Let's get started! How can I assist you with your style today?
          </p>
        </div>
        <StartOptionsWidget onOptionClick={onSendMessage} />
      </div>

      {/* Spacer to push input to bottom */}
      <div className="flex-1" />

      {/* Input at bottom */}
      <div className="w-full mb-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={disabled}
          placeholder={placeholder}
          onVoiceClick={onStartVoice}
        />
      </div>
    </div>
  );
};

export default EmptyChat;

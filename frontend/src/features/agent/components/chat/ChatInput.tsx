import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { AudioLines, ArrowUp, Mic, Paperclip } from "lucide-react"
import { toast } from "sonner"
import { ChatInputSuggestions } from "./ChatInputSuggestions"
import { useVoiceStore } from "@/features/voice/store/voiceStore"

const mockSuggestions = {
  suggestions: [
    { id: "1", text: "Suggest a casual outfit for a weekend brunch.", onClick: (text: string) => {} },
    { id: "2", text: "What are some trendy accessories for summer?" , onClick: (text: string) => {} },
    { id: "3", text: "How can I style a little black dress for daytime?" , onClick: (text: string) => {} },
  ]
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  threadId?: string | null;
  onVoiceClick?: () => void;
}

export default function ChatInput({ onSendMessage, isLoading = false, placeholder="style me for...", threadId = null, onVoiceClick }: ChatInputProps) {
  const [query, setQuery] = useState("")
  const { openVoiceModal } = useVoiceStore()

  const handleSendMessage = () => {
    const trimmedQuery = query.trim()
    if (trimmedQuery && !isLoading) {
      setQuery("");
      onSendMessage(trimmedQuery);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);

    // Auto-resize textarea (max 3 lines ~72px)
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 72) + 'px';
  };

  const handleMicClick = () => {
    toast.info("Voice messages coming soon!");
  }

  const handleVoiceClick = () => {
    toast.info("Azugh voice coming soon!");
  }

  const handleVoiceAssistant = () => {
    console.log("handleVoiceAssistant", { threadId, onVoiceClick });
    if (threadId) {
      openVoiceModal(threadId)
    } else if (onVoiceClick) {
      // No threadId available, use callback to create one first
      onVoiceClick()
    }
  }

  return (
    <div className="flex flex-col w-full px-3 space-y-2">
      {/* Suggestions */}
      {/* <ChatInputSuggestions 
        suggestions={mockSuggestions.suggestions} 
      /> */}
      {/* Main Input Container */}
      <div className="relative bg-white rounded-xl shadow px-3 py-2 flex items-center">
        {/* Attach button - no action */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-transparent flex-shrink-0">
          <Paperclip strokeWidth={1.5} className="w-5 h-5 text-gray-400" />
        </div>

        {/* Textarea */}
        <Textarea
          placeholder={placeholder}
          value={query}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:border-none shadow-none resize-none text-gray-900 placeholder:text-gray-500 min-h-[40px] max-h-[72px] px-2 pb-1 pt-2.5 scrollbar-hide overflow-hidden"
          style={{ 
            boxShadow: "none",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          rows={1}
        />

        {/* Buttons */}
        <div className="flex items-center ml-2 flex-shrink-0">
          {/* Mic button */}
          <div
            onClick={handleMicClick}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-transparent hover:bg-gray-100 transition"
          >
            <Mic strokeWidth={1.5} className="w-5 h-5 text-gray-900" />
          </div>

          {/* Send / Voice button */}
          {query.trim() ? (
            <div
              onClick={handleSendMessage}
              className={`ml-2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-[#303A2FB2] transition ${
                isLoading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <ArrowUp strokeWidth={1.5} className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div
              onClick={handleVoiceAssistant}
              className="ml-2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-[#303A2FB2] transition"
            >
              <AudioLines strokeWidth={1.5} className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


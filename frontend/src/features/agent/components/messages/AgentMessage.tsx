/**
 * AgentMessage Component
 *
 * PURPOSE: Renders complex agent responses with tabs, widgets, sources, and actions
 *
 * RESPONSIBILITIES:
 * - Display agent messages with tabbed interface (Answers | Sources)
 * - Render text content using MarkdownRenderer in Answers tab
 * - Render widgets/tool calls using WidgetRenderer in Answers tab
 * - Display document sources in Sources tab
 * - Show Copy and Retry buttons (visible only on hover)
 * - Maintain tab state and sync heights between tabs
 *
 * PROPS:
 * - message: ChatMessage (full message object from types.ts)
 *
 * TAB STRUCTURE:
 *
 * ANSWERS TAB:
 * - If message.msg_type === 'text':
 *   → Use MarkdownRenderer with message.content
 * - If message.msg_type === 'tool_call':
 *   → Use WidgetRenderer with message.tool_call
 * - Show running/loading state if message.running === true
 *
 * SOURCES TAB:
 * - Display message.sources array
 * - Show document card for each source (id, title, url)
 * - If sources.length === 0: show "No sources available" message
 * - Display source count in tab badge
 *
 * ACTION BUTTONS:
 * - Copy Button:
 *   → Copies message.content to clipboard
 *   → Shows brief success feedback (checkmark animation)
 *   → Only visible on message hover
 * - Retry Button:
 *   → Triggers retry logic (regenerate response)
 *   → Shows loading state while retrying
 *   → Only visible on message hover
 *
 * HOVER BEHAVIOR:
 * - Buttons hidden by default (opacity-0 or display-none)
 * - Appear on message hover (use group-hover pattern)
 * - Smooth transition for better UX
 *
 * LAYOUT REQUIREMENTS:
 * - Left-aligned
 * - Full width or max-width container
 * - Tab switcher at top
 * - Content area with consistent height
 * - Action buttons at bottom (in answers tab only)
 *
 * STATE TO MANAGE:
 * - activeTab: 'answers' | 'sources'
 * - copyFeedback: boolean (for copy success animation)
 * - retryLoading: boolean (for retry loading state)
 *
 * EXAMPLE STRUCTURE:
 * ```tsx
 * <div className="w-full group"> // group for hover
 *   <div className="flex border-b">
 *     <button onClick={() => setActiveTab('answers')}>Answers</button>
 *     <button onClick={() => setActiveTab('sources')}>
 *       Sources <span>{sources.length}</span>
 *     </button>
 *   </div>
 *
 *   <div className="p-4">
 *     {activeTab === 'answers' ? (
 *       message.msg_type === 'text' ? (
 *         <MarkdownRenderer content={message.content} />
 *       ) : (
 *         <WidgetRenderer {...message.tool_call} />
 *       )
 *     ) : (
 *       <SourcesList sources={message.sources} />
 *     )}
 *   </div>
 *
 *   {activeTab === 'answers' && (
 *     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
 *       <button onClick={handleCopy}>Copy</button>
 *       <button onClick={handleRetry}>Retry</button>
 *     </div>
 *   )}
 * </div>
 * ```
 *
 * IMPLEMENTATION GUIDE:
 * 1. Import necessary components (MarkdownRenderer, WidgetRenderer from ../widgets)
 * 2. Import types and icons (MessageSquare, BookOpen, Copy, RotateCcw)
 * 3. Set up state for activeTab, copyFeedback, retryLoading
 * 4. Create tab switcher UI
 * 5. Implement tab content rendering logic
 * 6. Add Copy button with clipboard API
 * 7. Add Retry button (may need to connect to parent callback)
 * 8. Style with hover effects using Tailwind group utilities
 * 9. Handle edge cases (empty sources, null content, etc.)
 *
 * IMPORTANT NOTES:
 * - Keep sources tab height consistent with answers tab
 * - Use useRef and useEffect for height syncing if needed
 * - Ensure accessibility (keyboard navigation, ARIA labels)
 * - Test with different message types and states
 *
 * See docs/CHAT_FEEDBACK.md for detailed implementation guide
 */

import type { ChatMessage } from "../../types";
import MarkdownRenderer from "./MarkdownRenderer";
import WidgetRenderer from "../widgets/WidgetRenderer"; // Uncomment when implementing
import { AssistantAvatar } from "@/components/avatars";
import LoadingMessage from "../messages/LoadingMessage";

interface AgentMessageProps {
  message: ChatMessage;
}

export default function AgentMessage({ message }: AgentMessageProps) {
  const isWidget = message.msg_type === "tool_call" && message.tool_call;
  const isRunning = message.running;

  if (isWidget ) {
    if (!isRunning) {
    return (
      <div className="group w-full order-1 flex">
        {/* <AssistantAvatar className="mr-2 flex-shrink-0" /> */}
        <div className="p-2 bg-transparent min-w-0 w-full">
          <WidgetRenderer
            name={message.tool_call?.tool || ""}
            arguments={
              message.tool_call?.result_data &&
              Object.keys(message.tool_call.result_data).length > 0
                ? message.tool_call.result_data
                : message.tool_call?.arguments || {}
            }
            messageId={message.id}
          />
        </div>
      </div>
    )} else {
      return (
        <LoadingMessage />
        )
    }
  }

  return (
    <div className="group max-w-[100%] min-w-0 order-1 flex">
      <AssistantAvatar className="mr-2 flex-shrink-0" />
      <div className="py-2 px-3 rounded-2xl bg-white text-foreground font-light shadow min-w-0 overflow-hidden">
        <MarkdownRenderer content={message.content || ""} />
      </div>
    </div>
  );
}

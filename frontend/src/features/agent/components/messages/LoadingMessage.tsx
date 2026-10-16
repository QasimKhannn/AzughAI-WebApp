/**
 * LoadingMessage Component
 * 
 * PURPOSE: Display loading state while agent is generating a response
 * 
 * RESPONSIBILITIES:
 * - Show animated loading indicator
 * - Display "Agent is thinking..." or similar text
 * - Match agent message styling for visual consistency
 * 
 * USAGE:
 * - Rendered by ChatMessages when agentThinking === true
 * - Appears at the bottom of the message list
 * - Should be visually similar to AgentMessage but with loading animation
 * 
 * CURRENT STATE:
 * - This component exists but may need updates
 * - Ensure it aligns with new AgentMessage design
 * 
 * STYLING:
 * - Use same layout as AgentMessage (left-aligned)
 * - Include loading spinner or skeleton
 * - Subtle animation to indicate processing
 * 
 * EXAMPLE:
 * ```tsx
 * {agentThinking && <LoadingMessage />}
 * ```
 * 
 * See docs/CHAT_FEEDBACK.md for detailed implementation guide
 */

// TODO: Implement or update LoadingMessage component
import { AssistantAvatar } from "@/components/avatars";

export default function LoadingMessage() {
  return (
    <div className="group max-w-[100%] min-w-0 order-1 flex">
      <AssistantAvatar />
      <div className="flex items-center gap-1 py-3 px-4 rounded-2xl bg-white text-foreground font-light shadow min-w-0 overflow-hidden">
        <span 
          className="w-2 h-2 bg-black/60 rounded-full animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '600ms' }}
        />
        <span 
          className="w-2 h-2 bg-black/60 rounded-full animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '600ms' }}
        />
        <span 
          className="w-2 h-2 bg-black/60 rounded-full animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '600ms' }}
        />
      </div>
    </div>
  );
}

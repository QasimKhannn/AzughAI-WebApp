/**
 * UserMessage Component
 * 
 * PURPOSE: Renders messages sent by the user
 * 
 * RESPONSIBILITIES:
 * - Display user's message content using MarkdownRenderer
 * - Apply user-specific styling (right-aligned, distinct appearance)
 * - Keep it simple - users send text only, no widgets or tools
 * 
 * PROPS:
 * - message: ChatMessage (full message object from types.ts)
 * 
 * LAYOUT REQUIREMENTS:
 * - Right-aligned (flex-row-reverse or ml-auto)
 * - Distinct visual style from agent messages
 * - Clean, minimal design
 * - No action buttons (Copy/Retry are agent-only)
 * 
 * EXAMPLE STRUCTURE:
 * ```tsx
 * <div className="flex flex-row-reverse"> // Right align
 *   <div className="max-w-[80%] bg-primary text-primary-foreground rounded-lg p-4">
 *     <MarkdownRenderer content={message.content || ''} />
 *   </div>
 * </div>
 * ```
 * 
 * IMPLEMENTATION GUIDE:
 * 1. Import MarkdownRenderer from './MarkdownRenderer'
 * 2. Import ChatMessage type from '../../types'
 * 3. Create component that accepts message prop
 * 4. Use MarkdownRenderer to display message.content
 * 5. Style for right-aligned user bubble
 * 6. Handle null/empty content gracefully
 * 
 * STYLING NOTES:
 * - Use existing design system colors
 * - Match mockups/designs provided
 * - Ensure readable text with good contrast
 * - Responsive on mobile devices
 * 
 * See docs/CHAT_FEEDBACK.md for detailed implementation guide
 */

import type { ChatMessage } from '../../types';
import MarkdownRenderer from './MarkdownRenderer';
import {UserAvatar} from "@/components/avatars";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {getUserInitials} from "@/features/auth/utils/UserInitials";


interface UserMessageProps {
  message: ChatMessage;
}

export default function UserMessage({ message }: UserMessageProps) {
  // TODO: Implement user message rendering
  // 1. Create right-aligned container
  // 2. Add user message bubble styling
  // 3. Use MarkdownRenderer for message.content
  // 4. Handle empty/null content
  
  const { user } = useAuth();

  return (
    <div className="group max-w-[100%] min-w-0 order-1 flex flex-row-reverse">
      <UserAvatar initials={getUserInitials(user.first_name, user.last_name)} name={`${user.first_name} ${user.last_name}`} className="ml-2 flex-shrink-0" /> 
      <div className="py-2 px-3 rounded-2xl bg-chat-user text-foreground font-light shadow min-w-0 overflow-hidden">
        <MarkdownRenderer content={message.content || ''} />
      </div>
    </div>
  );
}

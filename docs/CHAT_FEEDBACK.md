# Azugh AI Chat Implementation Guide

## 🚨 CRITICAL: Routing & Navigation Architecture

### Current Problem

The current implementation uses `setCurrentConversation()` from the Zustand store to track which chat is open. **This is incorrect and not persistent** because:
- State is lost on page refresh
- No proper URL-based navigation
- Cannot share or bookmark specific conversations
- Violates REST principles

### Correct Implementation: Two-Page Architecture

The chat should use **URL-based routing** with two distinct pages:

#### Page Structure

```
/chat          → Empty chat (new conversation start)
/chat/:id      → Active conversation with messages
```

### Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ /chat (Empty Chat Page)                                             │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ EmptyChat Component                                         │    │
│  │  - Welcome message                                          │    │
│  │  - NewChatWidgetOptions (3 suggestion cards)               │    │
│  │  - ChatInput                                               │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  User Action:                                                        │
│  - Types message in ChatInput OR                                    │
│  - Clicks suggestion card                                           │
│         │                                                            │
│         ├─ 1. Create new thread (API call)                         │
│         ├─ 2. Get thread.id from response                          │
│         ├─ 3. Navigate to /chat/:id with state {initialMessage}    │
│         └─ 4. DO NOT send message yet!                             │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ navigate(`/chat/${threadId}`, 
                              │   { state: { initialMessage: "..." }})
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ /chat/:id (Active Chat Page)                                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ ChatInterface Component                                        │ │
│  │                                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │ ChatMessages (if messages exist)                         │ │ │
│  │  │  - Loops through messages                                │ │ │
│  │  │  - Renders ChatMessage for each                          │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │ ChatInput (always at bottom)                             │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  On Mount:                                                           │
│  1. Check location.state.initialMessage                             │
│  2. If exists AND thread has no messages:                           │
│     - Send initial message to backend                               │
│     - Clear navigation state                                        │
│  3. Load/poll messages from backend                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Details

#### 1. `/chat` Page (Empty Chat)

**File:** `frontend/src/pages/chat/index.tsx`

**Purpose:** Entry point for new conversations - THIS IS THE PAGE COMPONENT

**Current Status:** File exists but is empty - needs to be implemented

**Structure:**
```tsx
// This file should export the page component that renders EmptyChat
import { useNavigate } from 'react-router-dom';
import EmptyChat from '@/features/agent/components/chat/EmptyChat';
import { useChatQueries } from '@/features/agent/hooks/useChatQueries';

export default function ChatPage() {
  const navigate = useNavigate();
  const { createNewThread } = useChatQueries(null);
  
  const handleStartChat = async (message: string) => {
    // 1. Create new thread via API
    const thread = await createNewThread();
    
    // 2. Navigate to /chat/:id with message in state
    navigate(`/chat/${thread.id}`, {
      state: { initialMessage: message }
    });
    
    // 3. DO NOT send message here!
  };
  
  return <EmptyChat onSendMessage={handleStartChat} />;
}
```

**What to Import in App.tsx:**
```tsx
import ChatPage from "@/pages/chat/index";
// or simply: import ChatPage from "@/pages/chat";

<Route path="/chat" element={<MainLayout><ChatPage /></MainLayout>} />
```

**Suggestion Cards Click Behavior:**
- Each suggestion card should have `onClick` handler
- Clicking should call `handleStartChat(prebuiltMessage)`
- Prebuilt messages examples:
  - "Ask about a document" → "Help me search my archive"
  - "Run a deep search" → "I need to run a deep search"
  - "Summarize a document" → "Summarize a document for me"

#### 2. `/chat/:id` Page (Active Chat)

**File:** `frontend/src/pages/chat/[id].tsx`

**Purpose:** Display and manage active conversation - THIS IS THE PAGE COMPONENT

**Current Status:** File exists but is empty - needs to be implemented

**Structure:**
```tsx
// This file should export the page component (ChatSession)
import { useRef, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ChatInterface from '@/features/agent/components/chat/Chat';
import { useChatQueries } from '@/features/agent/hooks/useChatQueries';

export default function ChatSession() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialMessageSent = useRef(false);
  
  const { messages, sendMessage, agentThinking } = useChatQueries(id || null);
```

**What to Import in App.tsx:**
```tsx
import ChatSession from "@/pages/chat/[id]";

<Route path="/chat/:id" element={<MainLayout><ChatSession /></MainLayout>} />
```

**Behavior:
```tsx
// On mount:
useEffect(() => {
  const initialMessage = location.state?.initialMessage;
  
  if (initialMessage && messages.length === 0 && !initialMessageSent.current) {
    initialMessageSent.current = true;
    
    // Send the initial message to backend
    sendMessage(initialMessage, id);
    
    // Clear navigation state to prevent resending
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state, messages.length]);

// Poll or load messages from backend
// User can continue conversation by typing in ChatInput
```

### Component Refactoring Required

#### ChatInterface Component Changes

**File:** `frontend/src/features/agent/components/chat/Chat.tsx`

**Current Issues:****
- Uses `setCurrentConversation()` (Zustand) - REMOVE THIS
- Relies on non-persistent state
- Handles empty state internally

**Required Changes:**
```tsx
// BEFORE (incorrect):
const { currentConversationId, setCurrentConversation } = useChatStore();
if (!currentConversationId || messages.length === 0) {
  return <EmptyChat />;
}

// AFTER (correct):
// Get thread ID from URL params (passed from parent page)
const ChatInterface = ({ threadId }: { threadId: string }) => {
  const { messages, sendMessage } = useChatQueries(threadId);
  
  return (
    <div>
      <ChatMessages messages={messages} onSendMessage={sendMessage} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};
```

**Key Points:**
- ChatInterface should NOT handle empty state
- ChatInterface should receive `threadId` as prop from page component
- ChatInput should be part of ChatInterface, not ChatMessages
- Remove EmptyChat logic from ChatInterface

#### ChatMessages Component Changes

**File:** `frontend/src/features/agent/components/chat/ChatMessages.tsx`

**Current Issues:****
- Contains ChatInput (should be in parent)

**Required Changes:**
- Remove ChatInput from ChatMessages
- ChatMessages should ONLY render the message list
- ChatInput should be in ChatInterface (Chat.tsx)

```tsx
// BEFORE (incorrect):
const ChatMessages = ({ messages, onSendMessage }) => {
  return (
    <div>
      <div className="messages">{/* render messages */}</div>
      <ChatInput onSendMessage={onSendMessage} /> {/* REMOVE THIS */}
    </div>
  );
};

// AFTER (correct):
const ChatMessages = ({ messages }) => {
  return (
    <div className="messages">
      {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>
  );
};
```

#### EmptyChat Component Changes

**File:** `frontend/src/features/agent/components/chat/EmptyChat.tsx`

**Current State:** ✅ Already correct!

**Should Contain:**
- Welcome message
- NewChatWidgetOptions (suggestion cards)
- ChatInput
- `onSendMessage` handler that creates thread and navigates

**Should NOT:**
- Be used inside ChatInterface
- Handle message sending to backend (only thread creation + navigation)

### App.tsx Routing Changes

**CURRENT STATE:** App.tsx does not have chat routes - they need to be ADDED.

The current App.tsx uses `MainLayout` for protected routes. Chat routes should be added inside the protected routes section.

**IMPORTS TO ADD:**
```tsx
// ✅ ADD:
import ChatPage from "@/pages/chat";  // or "@/pages/chat/index"
import ChatSession from "@/pages/chat/[id]";
```

**ROUTES TO ADD (inside MainLayout protected routes):**
```tsx
// Empty chat page (uses ChatPage from /pages/chat/index.tsx)
<Route path="/chat" element={<ChatPage />} />

// Active chat page (uses ChatSession from /pages/chat/[id].tsx)
<Route path="/chat/:id" element={<ChatSession />} />
```

### Store Changes - Remove setCurrentConversation

**File:** `frontend/src/features/agent/store/agentStore.ts`

**Note:** The store file currently exists but is empty. If implementing a store, do NOT include `setCurrentConversation`.

**DO NOT ADD (deprecated pattern):**
```typescript
setCurrentConversation: (id: string) => {
  set({ currentConversationId: id });
},
```

**REASON:**
- URL params (`useParams`) should be single source of truth
- No need for Zustand to track current conversation
- Thread ID comes from `/chat/:id` route


### Summary of Changes

| What | Action | Why |
|------|--------|-----|
| `/chat` page | Implement with `EmptyChat` | New conversation start point |
| `/chat/:id` page | Implement with `ChatInterface` | Active conversation display |
| `Chat.tsx` | Remove empty state, add ChatInput | Focus on active chat only |
| `ChatMessages` | Remove ChatInput | Only render message list |
| `EmptyChat` | Keep ChatInput | Handles initial message |
| `setCurrentConversation` | **DO NOT USE** | Use URL params instead |
| Suggestion cards | Add onClick | Send prebuilt messages |
| App.tsx routes | Add both routes | Support new architecture |

---

## Overview

The chat system is built using a hierarchical component structure that separates concerns and ensures clean, maintainable code. The architecture follows a clear flow from the top-level chat interface down to individual message rendering.

### Component Architecture Diagram

```
ChatInterface (Chat.tsx - Main chat component)
    │
    └── ChatMessages (Message list container)
            │
            ├── [loops through messages array]
            │
            └── ChatMessage (Unified message wrapper)
                    │
                    ├── Determines message sender type
                    │
                    ├── UserMessage (if sender === 'user')
                    │   └── MarkdownRenderer
                    │
                    └── AgentMessage (if sender === 'agent')
                        │
                        ├── Tab Switcher (Answers | Sources)
                        │
                        ├── Answers Tab:
                        │   ├── MarkdownRenderer (for text messages)
                        │   └── WidgetRenderer (for tool calls/widgets)
                        │
                        ├── Sources Tab:
                        │   └── List of document references
                        │
                        └── Action Buttons (visible on hover only)
                            ├── Copy button
                            └── Retry button
```

### Data Flow

1. **ChatInterface** manages the overall chat state and user interactions
2. **ChatMessages** receives the messages array and renders each message
3. **ChatMessage** acts as a router, checking message type and delegating to appropriate component
4. **UserMessage** handles user messages with simple markdown rendering
5. **AgentMessage** handles complex agent responses with tabs, widgets, and interactive elements

---

## Things to Change

### 🔴 Critical: Disassemble MessageBubble Component

**Current Issue:** The `MessageBubble.tsx` component is doing too much - handling both user and agent messages, tabs, sources, and action buttons all in one place. This violates separation of concerns.

**Required Changes:**

#### 1. Create Unified ChatMessage Component
- **Location:** `frontend/src/features/agent/components/messages/ChatMessage.tsx`
- **Purpose:** Act as a message router/wrapper
- **Responsibilities:**
  - Receive the entire message object as prop
  - Check `message.sender` to determine type
  - Render `UserMessage` if sender is 'user'
  - Render `AgentMessage` if sender is 'agent'
  - NO rendering logic itself - pure delegation

#### 2. Implement UserMessage Component
- **Location:** `frontend/src/features/agent/components/messages/UserMessage.tsx` (already exists, needs implementation)
- **Purpose:** Render user messages
- **Responsibilities:**
  - Accept full message object as prop
  - Use `MarkdownRenderer` to display `message.content`
  - Simple, clean styling for user messages
  - No action buttons
  - Right-aligned layout

#### 3. Implement AgentMessage Component
- **Location:** `frontend/src/features/agent/components/messages/AgentMessage.tsx` (already exists, needs implementation)
- **Purpose:** Render agent messages with advanced features
- **Responsibilities:**
  - Accept full message object as prop
  - Implement tab switcher (Answers | Sources)
  - **Answers Tab:**
    - If `message.msg_type === 'text'`: use `MarkdownRenderer` with `message.content`
    - If `message.msg_type === 'tool_call'`: use `WidgetRenderer` with `message.tool_call`
  - **Sources Tab:**
    - Display `message.sources` array
    - Show document references with title and link
    - Display "No sources available" if array is empty
  - **Action Buttons (Copy & Retry):**
    - Position at bottom of message
    - Only visible on hover (use CSS group-hover or state)
    - Copy button: copies message content to clipboard
    - Retry button: triggers retry logic
  - Left-aligned layout

#### 4. Update ChatMessages Component
- **Current:** Uses `MessageBubble` directly (legacy component)
- **Change to:** Use new `ChatMessage` component
- **Code Change:**
  ```tsx
  // OLD (current):
  <MessageBubble key={message.id} message={message} />
  
  // NEW (target):
  import ChatMessage from '../messages/ChatMessage';
  <ChatMessage key={message.id} message={message} />
  ```

### 🟡 Important: Security & Best Practices

#### 6. MarkdownRenderer Safety
- **Current State:** Commented code shows usage of `rehypeRaw` which can be dangerous
- **Requirement:** 
  - Do NOT use `marked` library with direct HTML rendering
  - Do NOT pass `dangerouslySetInnerHTML`
  - Keep using `react-markdown` with proper sanitization
  - Only use safe plugins (`remark-gfm` is fine)
  - Avoid `rehype-raw` unless absolutely necessary and properly sanitized

### 🟢 Enhancement: UI/UX Improvements

#### 7. Hover-based Action Buttons
- Buttons should be hidden by default
- Show on message hover for cleaner interface
- Use Tailwind CSS groups or React state
- Example approach:
  ```tsx
  <div className="group">
    {/* message content */}
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Copy & Retry buttons */}
    </div>
  </div>
  ```

---

## Components Guide

### Message Components

| Component | Path | Role | Props |
|-----------|------|------|-------|
| **ChatMessage** | `frontend/src/features/agent/components/messages/ChatMessage.tsx` | Message router - delegates to UserMessage or AgentMessage based on sender | `message: ChatMessage` |
| **UserMessage** | `frontend/src/features/agent/components/messages/UserMessage.tsx` | Renders user messages with markdown support | `message: ChatMessage` |
| **AgentMessage** | `frontend/src/features/agent/components/messages/AgentMessage.tsx` | Renders agent messages with tabs, widgets, sources, and actions | `message: ChatMessage` |
| **MarkdownRenderer** | `frontend/src/features/agent/components/messages/MarkdownRenderer.tsx` | Safely renders markdown to HTML | `content: string, className?: string` |
| **LoadingMessage** | `frontend/src/features/agent/components/messages/LoadingMessage.tsx` | Shows loading state for agent responses | N/A |

### Container Components

| Component | Path | Role | Props |
|-----------|------|------|-------|
| **ChatMessages** | `frontend/src/features/agent/components/chat/ChatMessages.tsx` | Container that loops through messages and renders ChatMessage for each | `messages: ChatMessage[], agentThinking: boolean` |
| **ChatInput** | `frontend/src/features/agent/components/chat/ChatInput.tsx` | Input field for user to type messages | `onSendMessage: (msg: string) => void, disabled?: boolean, placeholder?: string` |
| **ChatInterface** | `frontend/src/features/agent/components/chat/Chat.tsx` | Top-level chat component managing state and layout | `threadId: string` |

### Widget Components

| Component | Path | Role | Props |
|-----------|------|------|-------|
| **WidgetRenderer** | `frontend/src/features/agent/components/widgets/WidgetRenderer.tsx` | Renders tool calls and interactive widgets | `name: string, arguments: Record<string, unknown>, messageId: string, onInteraction?: (data) => void` |
| **NewChatWidgetOptions** | `frontend/src/features/agent/components/widgets/NewChatWidgetOptions.tsx` | Displays initial chat options (Ask, Search, Summarize) | `onSuggestionClick?: (message: string) => void` |
| **DeepSearchWidget** | `frontend/src/features/agent/components/widgets/DeepSearchWidget.tsx` | Widget for deep search functionality | `WidgetProps` |

### Supporting Components

| Component | Path | Role |
|-----------|------|------|
| **EmptyChat** | `frontend/src/features/agent/components/chat/EmptyChat.tsx` | Displays when no messages exist |

---

## Implementation Checklist

- [ ] Implement `ChatMessage.tsx` component (message router)
- [ ] Implement `UserMessage.tsx` component
- [ ] Implement `AgentMessage.tsx` component
  - [ ] Add tab switcher (Answers/Sources)
  - [ ] Implement Answers tab with MarkdownRenderer and WidgetRenderer
  - [ ] Implement Sources tab with document list
  - [ ] Add Copy and Retry buttons (hover-only)
- [ ] Update `ChatMessages.tsx` to use `ChatMessage` instead of MessageBubble
- [ ] Update `index.ts` exports to include new components
- [ ] Test all message types (user text, agent text, agent widget, agent sources)
- [ ] Verify hover interactions work correctly
- [ ] Ensure MarkdownRenderer is secure (no unsafe HTML rendering)

---

## Type Definitions

Refer to `frontend/src/features/agent/types.ts` for full type definitions:

```typescript
interface ChatMessage {
  id: string;
  created_at: string;
  sender: 'user' | 'agent';
  msg_type: 'text' | 'tool_call';
  content: string | null;
  sequence?: number;
  tool_call: ToolCall | null;
  running?: boolean;
  sources?: Source[];
}

interface ToolCall {
  tool_name: string;
  tool_type: "widget" | "function";
  arguments: Record<string, unknown>;
  result_data: Record<string, unknown> | null;
}

interface Source {
  id: string;
  title: string;
  url: string;
}
```

---

## Testing Scenarios

1. **User sends text message** → Should render with UserMessage component, right-aligned
2. **Agent sends text response** → Should render with AgentMessage, Answers tab active, markdown formatted
3. **Agent sends tool call** → Should render widget in Answers tab
4. **Agent includes sources** → Sources tab should show document list with count badge
5. **Hover over agent message** → Copy and Retry buttons should appear
6. **Click Copy button** → Message content copied to clipboard, feedback shown
7. **Switch tabs** → Answers ↔ Sources should maintain layout and height
8. **Agent thinking state** → Loading indicator should appear below messages

---

## Notes for Developer

- **Don't rush**: Take time to understand the component hierarchy before coding
- **One component at a time**: Start with ChatMessage, then UserMessage, then AgentMessage
- **Test incrementally**: After each component, test it works before moving to next
- **Preserve functionality**: All current features must work after refactor
- **Clean code**: Follow existing code style and patterns in the project
- **Ask questions**: If anything is unclear, ask before implementing

Good luck! 🚀

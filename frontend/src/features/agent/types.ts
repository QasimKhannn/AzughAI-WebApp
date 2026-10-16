export interface ToolCall {
  tool: string;
  tool_type: "widget" | "function";
  arguments: Record<string, unknown>;
  result_data: Record<string, unknown> | null;
}

export interface ChatMessage {
  id: string;
  created_at: string;
  sender: "user" | "agent";
  msg_type: "text" | "tool_call";
  content: string | null;
  sequence?: number;
  tool_call: ToolCall | null;
  running?: boolean; // Only in the frontend for tracking ongoing tool calls
}

export interface Response {
    id: string;
    created_at: string;
    messages: ChatMessage[];
}

export interface Thread {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  is_onboarding: boolean;
  messages?: ChatMessage[];
  responses?: Response[];
  summary?: string; // Optional summary field
  closet?: any[]; // Optional closet IDs
  wishlist?: any[]; // Optional wishlist IDs
  cart?: any[]; // Optional cart IDs
  disliked?: any[]; // Optional disliked item IDs
  // remove this later, as not needed on frontend
  stats?: string; // e.g., "5 messages · 2 items"
  subtitle?: string; // Optional subtitle field
  date?: string; // Optional date field for display purposes
}

export interface ThreadList {
  threads: Thread[];
}

export interface WidgetProps {
  arguments: Record<string, unknown>;
  messageId: string;
  onInteraction?: (data: Record<string, unknown>) => void;
}

export interface NewConversation {
  id: string;
  title: string;
  createdAt: string;
  archived: boolean;
  messages: ChatMessage[];
}


export interface ChatStore {
  showFinishLoader: boolean;
  setShowFinishLoader: (show: boolean) => void;

  showScrollLoader: boolean;
  setShowScrollLoader: (show: boolean) => void;

  openAestheticQuizModal: boolean;
  setOpenAestheticQuizModal: (open: boolean) => void;

  isCanvasOpen: boolean;
  setIsCanvasOpen: (open: boolean) => void;
  toggleCanvas: () => void;
}
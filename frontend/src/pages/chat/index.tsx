import { EmptyChat } from "@/features/agent/components/chat"
import { useNavigate } from "react-router-dom"
import { useChatQueries } from "@/features/agent/hooks/useChatQueries"
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from "sonner";

export default function ChatPage() {
  const navigate = useNavigate();
  const { createNewThread } = useChatQueries(null);

  const handleStartChat = async (message: string) => {
    try {
      // Create a new thread
      const result = await createNewThread();
      const newThreadId = result.id;
      
      // Navigate to the new thread with the initial message
      navigate(`/chat/${newThreadId}`, {
        state: { initialMessage: message }
      });
    } catch (error) {
      console.error("Failed to create new thread:", error);
      // Fallback to a temporary thread ID if creation fails
      toast.error('Failed to create a new chat. Please try again.');
    }
  };

  const handleStartVoice = async () => {
    try {
      // Create a new thread for voice conversation
      const result = await createNewThread();
      const newThreadId = result.id;
      
      // Navigate to the new thread with voice mode flag
      navigate(`/chat/${newThreadId}`, {
        state: { startVoice: true }
      });
    } catch (error) {
      console.error("Failed to create voice thread:", error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-white pb-4">
        <EmptyChat onSendMessage={handleStartChat} onStartVoice={handleStartVoice} />
    </div>
  )
}

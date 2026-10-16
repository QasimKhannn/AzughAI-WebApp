import { useState, useMemo } from "react";
import { useChatData } from "@/features/agent/hooks/useChatData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, MessageSquarePlus, SearchX } from "lucide-react";
import ConversationItem from "./ConversationItem";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import  ImageIcon from "@/components/icons/ImageIcon";

interface ConversationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConversationsModal({ open, onOpenChange }: ConversationsModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { threads, threadsLoading } = useChatData();
  const [searchQuery, setSearchQuery] = useState("");

  // Extract current thread ID from path (e.g., /chat/5769e86c-8465-47ca-906d-2d043f7ab09a)
  const currentThreadId = useMemo(() => {
    const match = location.pathname.match(/^\/chat\/([a-f0-9-]+)$/i);
    return match ? match[1] : null;
  }, [location.pathname]);

  const filteredThreads = useMemo(() => {
    const threadsArray = Array.isArray(threads) ? threads : [];
    if (!searchQuery.trim()) return threadsArray;
    const query = searchQuery.toLowerCase();
    return threadsArray.filter((thread: { title?: string }) =>
      (thread.title || "Untitled conversation").toLowerCase().includes(query)
    );
  }, [threads, searchQuery]);

  const handleConversationClick = (id: string) => {
    navigate(`/chat/${id}`);
    onOpenChange(false);
  };

  const handleRename = (id: string, newTitle: string) => {
    // TODO: Implement rename functionality
    console.log("Rename:", id, "to:", newTitle);
  };

  const handleDetails = (id: string) => {
    // TODO: Implement details functionality
    console.log("Details:", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete:", id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen xl:w-md h-screen xl:h-auto xl:max-w-md bg-white shadow-xl rounded-none xl:rounded-lg border-0 p-0 gap-0 outline-none flex flex-col">
        <DialogHeader className="px-4 xl:py-4 pb-4 pt-10 flex-shrink-0">
          <DialogTitle className="font-normal text-foreground/80 xl:text-base text-2xl text-left">past chats</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 p-0 xl:hidden"
            onClick={() => onOpenChange(false)}
          >
            <ImageIcon height={28} width={28} name="cancel.svg" />
          </Button>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 pb-3 flex-shrink-0">
            <div className="relative">
              <Search
                size={18}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
              />
              <Input
                placeholder="search past chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-light text-sm"
              />
            </div>
          </div>

          <div className="flex-1 xl:max-h-80 xl:h-80 xl:min-h-80 overflow-y-auto px-2 pb-4">
            {threadsLoading ? (
              <div className="flex items-center justify-center py-8">
                <span className="font-light text-foreground/50 text-sm">Loading...</span>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                {searchQuery ? (
                  <>
                    <SearchX size={40} strokeWidth={1} className="text-foreground/30" />
                    <span className="font-light text-foreground/50 text-sm">
                      No conversations found
                    </span>
                  </>
                ) : (
                  <>
                    <MessageSquarePlus size={40} strokeWidth={1} className="text-foreground/30" />
                    <span className="font-light text-foreground/50 text-sm text-center">
                      No chats yet.<br />Start a new conversation!
                    </span>
                  </>
                )}
              </div>
            ) : (
              filteredThreads?.map((thread: { id: string; title?: string; is_onboarding?: boolean }) => (
                <ConversationItem
                  key={thread.id}
                  id={thread.id}
                  title={thread.title || "Untitled conversation"}
                  isSelected={thread.id === currentThreadId}
                  onClick={handleConversationClick}
                  onRename={handleRename}
                  onDetails={handleDetails}
                  onDelete={handleDelete}
                  className={thread.is_onboarding ? "hidden" : ""}
                />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
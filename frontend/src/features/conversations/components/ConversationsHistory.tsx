// import PageLayout from "@/layout/PageLayout";
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import ConversationItem from "./ConversationItem";
// import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
// import { mockConvoItems } from "../mockData";
// import ImageIcon from "@/components/icons/ImageIcon";
// import { Thread } from "@/features/agent/types";
// import { useIsMobile } from "@/hooks/use-mobile";
// import ConversationSummary from "./ConversationsSummary";
// import { useChatQueries } from "@/features/agent/hooks/useChatQueries";
// import { useChatData } from "@/features/agent/hooks/useChatData";

// const ConversationHistory = () => {
//       const {
//     // threads,
//     // isLoadingThreads,
//     // threadsError,
//     clearThread,
//   } = useChatQueries(null);
//   const {
//     threads,
//     //threadsLoading,
//     threadsError,
//     //refetchThreads
//   } = useChatData();
//   const isMobile = useIsMobile();
//   const [items, setItems] = useState<Thread[]>([...threads]);
//   const [showDelete, setShowDelete] = useState(false);
//   const [search, setSearch] = useState("");
//   const [selectedConversation, setSelectedConversation] =
//     useState<Thread | null>(items.length > 0 ? items[0] : null);

//   // Filter items by search
//   const filteredItems = items.filter((item) =>
//     item.title.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleSelectConversation = (conversation: Thread) => {
//     setSelectedConversation(conversation);
//   };

//   useEffect(() => {
//     setItems([...threads]);
//   }, [threads]);

//   // Mobile layout (existing functionality)
//   if (isMobile) {
//     return (
//       <div className="w-full min-h-screen flex flex-col pt-[12.5vh] pb-[20vh] max-w-screen-xl md:max-w-full mx-auto">
//         <div className={`flex justify-between items-center text-lg px-4 py-4`}>
//           <h1 className="text-2xl md:text-2xl text-black font-manrope lowercase tracking-wide font-light">
//             Conversations history
//           </h1>
//           <button
//             onClick={() => {}}
//             className="text-black hover:text-black/70 transition-colors"
//           >
//             ({items.length})
//           </button>
//         </div>
//         {items.length === 0 ? (
//           <div className="flex flex-col gap-3 items-center justify-center p-6 text-center border-t border-black h-full">
//             <ImageIcon
//               name="conversation-icon.svg"
//               alt="No conversations"
//               width={70}
//               height={64}
//             />
//             <h2 className="text-xl font-semibold mt-2">No Conversations Yet</h2>
//             <p className="text-gray-600 px-2">
//               Your chats with AzughAI will appear here once you start styling
//               sessions
//             </p>
//             <button className="bg-[#303A2FB2] text-white px-6 py-2 rounded-full font-light font-manrope lowercase w-full hover:bg-gray-800 transition-colors">
//               Start a New Chat
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-start flex-grow h-full w-full text-center border-t border-black">
//             <div className="relative my-3 w-full flex-shrink-0 px-2">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Search className="w-5 h-5" />
//               </span>
//               <Input
//                 className="pl-10 rounded-xl font-manrope"
//                 placeholder="Find your recent conversations"
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//             <div className="w-full flex flex-col items-center flex-grow overflow-y-auto min-h-0">
//               {filteredItems.length > 0 ? (
//                 filteredItems.map((item, idx) => (
//                   <ConversationItem
//                     key={item.id}
//                     id={item.id}
//                     title={item.title}
//                     subtitle={item.subtitle}
//                     date={item.date}
//                     stats={item.stats}
//                     onDelete={() => setShowDelete(true)}
//                     closet={item.closet}
//                     wishlist={item.wishlist}
//                     cart={item.cart}
//                     disliked={item.disliked}
//                     isMobile={true}
//                   />
//                 ))
//               ) : (
//                 <div className="text-gray-400 mt-8">
//                   No conversations found.
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//         {showDelete && (
//           <ConfirmDeleteModal
//             open={showDelete}
//             onClose={() => setShowDelete(false)}
//             title="Delete Conversation?"
//             description="This conversation will be permanently removed from your history. You won't be able to view its summary again."
//             deleteLabel="Delete"
//             cancelLabel="Cancel"
//           />
//         )}
//       </div>
//     );
//   }

//   // Desktop two-column layout
//   return (
//     <div className="w-full min-h-screen md:max-w-full flex flex-col pt-[12vh] md:pb-[0vh] max-w-7xl mx-auto">
//       {/* Common Header */}
//       <div className="flex justify-between items-center text-lg px-4 py-4">
//         <h1 className="text-2xl text-black font-manrope lowercase tracking-wide font-light">
//           Conversations history
//         </h1>
//         <button
//           onClick={() => {}}
//           className="text-black hover:text-black/70 transition-colors"
//         >
//           ({items.length})
//         </button>
//       </div>

//       {/* Two Columns */}
//       <div className="flex flex-1 min-h-0 border-t border-black">
//         {/* Left Sidebar - Conversations List */}
//         <div className="w-1/4 border-r border-black flex flex-col">
//           {/* Search */}
//           <div className="p-4 border-b border-black">
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Search className="w-4 h-4" />
//               </span>
//               <Input
//                 className="pl-10 rounded-xl font-manrope"
//                 placeholder="Find your recent conversations"
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Conversations List */}
//           <div className="flex-1 overflow-y-auto hide-scrollbar">
//             {items.length === 0 ? (
//               <div className="flex flex-col gap-3 items-center justify-center p-6 text-center h-full">
//                 <ImageIcon
//                   name="conversation-icon.svg"
//                   alt="No conversations"
//                   width={60}
//                   height={56}
//                 />
//                 <h2 className="text-lg font-semibold mt-2">
//                   No Conversations Yet
//                 </h2>
//                 <p className="text-gray-600 text-sm">
//                   Your chats with AzughAI will appear here
//                 </p>
//                 <button className="bg-[#303A2FB2] text-white px-4 py-2 rounded-full font-light font-manrope lowercase hover:bg-gray-800 transition-colors mt-2">
//                   Start a New Chat
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 {filteredItems.length > 0 ? (
//                   filteredItems.map((item) => (
//                     <ConversationItem
//                       key={item.id}
//                       id={item.id}
//                       title={item.title}
//                       subtitle={item.subtitle}
//                       date={item.date}
//                       stats={item.stats}
//                       onDelete={() => setShowDelete(true)}
//                       onSelect={() => handleSelectConversation(item)}
//                       isSelected={selectedConversation?.id === item.id}
//                       closet={item.closet}
//                       wishlist={item.wishlist}
//                       cart={item.cart}
//                       disliked={item.disliked}
//                       isMobile={false}
//                     />
//                   ))
//                 ) : (
//                   <div className="text-gray-400 text-center py-8 text-sm">
//                     No conversations found matching "{search}"
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Content - Conversation Details */}
//         <div className="flex-1 flex flex-col min-h-0">
//           {selectedConversation ? (
//             <ConversationSummary
//               conversation={selectedConversation}
//               isEmbedded={true}
//             />
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500">
//               <div className="text-center">
//                 <ImageIcon
//                   name="conversation-icon.svg"
//                   alt="Select conversation"
//                   width={80}
//                   height={76}
//                   className="mx-auto mb-4 opacity-50"
//                 />
//                 <h3 className="text-lg font-manrope mb-2">
//                   Select a conversation
//                 </h3>
//                 <p className="text-sm">
//                   Choose a conversation from the sidebar to view its details
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showDelete && (
//         <ConfirmDeleteModal
//           open={showDelete}
//           onClose={() => setShowDelete(false)}
//           title="Delete Conversation?"
//           description="This conversation will be permanently removed from your history. You won't be able to view its summary again."
//           deleteLabel="Delete"
//           cancelLabel="Cancel"
//         />
//       )}
//     </div>
//   );
// };

// export default ConversationHistory;


import PageLayout from "@/layout/PageLayout";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ConversationItem from "./ConversationItem";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import ImageIcon from "@/components/icons/ImageIcon";
import { Thread } from "@/features/agent/types";
import { useIsMobile } from "@/hooks/use-mobile";
import ConversationSummary from "./ConversationsSummary";
import { useChatQueries } from "@/features/agent/hooks/useChatQueries";
import { useChatData } from "@/features/agent/hooks/useChatData";


const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

const convertDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const ConversationHistory = () => {
  const { clearThread } = useChatQueries(null);
  const {
    threads,
    threadsLoading,
    threadsError,
    refetchThreads
  } = useChatData();
  
  const isMobile = useIsMobile();
  const [showDelete, setShowDelete] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Thread | null>(null);

  // Set initial selected conversation when threads load
  useEffect(() => {
    if (threads && threads.length > 0 && !selectedConversation) {
      setSelectedConversation(threads[0]);
    }
    console.log("Threads updated:", threads);
  }, [threads, selectedConversation]);

  // Filter items by search
  const filteredItems = (threads || []).filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectConversation = (conversation: Thread) => {
    setSelectedConversation(conversation);
  };

  const handleDeleteClick = (threadId: string) => {
    setThreadToDelete(threadId);
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (threadToDelete) {
      await clearThread(threadToDelete);
      // If we deleted the selected conversation, clear selection
      if (selectedConversation?.id === threadToDelete) {
        const remaining = threads?.filter(t => t.id !== threadToDelete) || [];
        setSelectedConversation(remaining.length > 0 ? remaining[0] : null);
      }
      refetchThreads();
    }
    setShowDelete(false);
    setThreadToDelete(null);
  };

  const itemsCount = threads?.length || 0;

  // Loading state
  if (threadsLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  // Error state
  if (threadsError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading conversations. Please try again.</p>
      </div>
    );
  }

  // Mobile layout (existing functionality)
  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white pb-[20vh] max-w-screen-xl md:max-w-full mx-auto">
        <div className={`flex justify-between items-center text-lg px-4 py-4`}>
          <h1 className="text-2xl md:text-2xl text-black font-manrope lowercase tracking-wide font-light">
            Conversations history
          </h1>
          <button
            onClick={() => {}}
            className="text-black hover:text-black/70 transition-colors"
          >
            ({itemsCount})
          </button>
        </div>
        {itemsCount === 0 ? (
          <div className="flex flex-col gap-3 items-center justify-center p-6 text-center border-t border-black h-full">
            <ImageIcon
              name="conversation-icon.svg"
              alt="No conversations"
              width={70}
              height={64}
            />
            <h2 className="text-xl font-semibold mt-2">No Conversations Yet</h2>
            <p className="text-gray-600 px-2">
              Your chats with AzughAI will appear here once you start styling
              sessions
            </p>
            <button className="bg-[#303A2FB2] text-white px-6 py-2 rounded-full font-light font-manrope lowercase w-full hover:bg-gray-800 transition-colors">
              Start a New Chat
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start flex-grow h-full w-full text-center border-t border-black">
            <div className="relative my-3 w-full flex-shrink-0 px-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
              <Input
                className="pl-10 rounded-xl font-manrope"
                placeholder="Find your recent conversations"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col items-center flex-grow overflow-y-auto min-h-0">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ConversationItem
                    key={item.id}
                    id={item.id}
                    title={truncateText(item.title, 30) || "New Conversation"}
                    subtitle={item.subtitle}
                    date={convertDateTime(item.created_at)}
                    stats={item.stats}
                    onDelete={() => handleDeleteClick(item.id)}
                    closet={item.closet}
                    wishlist={item.wishlist}
                    cart={item.cart}
                    disliked={item.disliked}
                    isMobile={true}
                  />
                ))
              ) : (
                <div className="text-gray-400 mt-8">
                  No conversations found.
                </div>
              )}
            </div>
          </div>
        )}
        {showDelete && (
          <ConfirmDeleteModal
            open={showDelete}
            onClose={() => {
              setShowDelete(false);
              setThreadToDelete(null);
            }}
            onDelete={handleConfirmDelete}
            title="Delete Conversation?"
            description="This conversation will be permanently removed from your history. You won't be able to view its summary again."
            deleteLabel="Delete"
            cancelLabel="Cancel"
          />
        )}
      </div>
    );
  }

  // Desktop two-column layout
  return (
    <div className="w-full min-h-screen md:max-w-full flex flex-col pt-[12vh] md:pb-[0vh] max-w-7xl mx-auto bg-white">
      {/* Common Header */}
      <div className="flex justify-between items-center text-lg px-4 py-4">
        <h1 className="text-2xl text-black font-manrope lowercase tracking-wide font-light">
          Conversations history
        </h1>
        <button
          onClick={() => {}}
          className="text-black hover:text-black/70 transition-colors"
        >
          ({itemsCount})
        </button>
      </div>

      {/* Two Columns */}
      <div className="flex flex-1 min-h-0 border-t border-black">
        {/* Left Sidebar - Conversations List */}
        <div className="w-1/4 border-r border-black flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-black">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <Input
                className="pl-10 rounded-xl font-manrope"
                placeholder="Find your recent conversations"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {itemsCount === 0 ? (
              <div className="flex flex-col gap-3 items-center justify-center p-6 text-center h-full">
                <ImageIcon
                  name="conversation-icon.svg"
                  alt="No conversations"
                  width={60}
                  height={56}
                />
                <h2 className="text-lg font-semibold mt-2">
                  No Conversations Yet
                </h2>
                <p className="text-gray-600 text-sm">
                  Your chats with AzughAI will appear here
                </p>
                <button className="bg-[#303A2FB2] text-white px-4 py-2 rounded-full font-light font-manrope lowercase hover:bg-gray-800 transition-colors mt-2">
                  Start a New Chat
                </button>
              </div>
            ) : (
              <div>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <ConversationItem
                      key={item.id}
                      id={item.id}
                      title={truncateText(item.title, 30) || "New Conversation"}
                      subtitle={item.subtitle}
                      date={convertDateTime(item.created_at)}
                      stats={item.stats}
                      onDelete={() => handleDeleteClick(item.id)}
                      onSelect={() => handleSelectConversation(item)}
                      isSelected={selectedConversation?.id === item.id}
                      closet={item.closet}
                      wishlist={item.wishlist}
                      cart={item.cart}
                      disliked={item.disliked}
                      isMobile={false}
                    />
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8 text-sm">
                    No conversations found matching "{search}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Conversation Details */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedConversation ? (
            <ConversationSummary
              conversation={selectedConversation}
              isEmbedded={true}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ImageIcon
                  name="conversation-icon.svg"
                  alt="Select conversation"
                  width={80}
                  height={76}
                  className="mx-auto mb-4 opacity-50"
                />
                <h3 className="text-lg font-manrope mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm">
                  Choose a conversation from the sidebar to view its details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmDeleteModal
          open={showDelete}
          onClose={() => {
            setShowDelete(false);
            setThreadToDelete(null);
          }}
          onDelete={handleConfirmDelete}
          title="Delete Conversation?"
          description="This conversation will be permanently removed from your history. You won't be able to view its summary again."
          deleteLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
};

export default ConversationHistory;

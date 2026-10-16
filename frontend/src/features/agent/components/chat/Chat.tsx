/**
 * ChatInterface Component - NEEDS REFACTORING
 * 
 * CURRENT ISSUES:
 * 1. ❌ Uses setCurrentConversation from Zustand (non-persistent)
 * 2. ❌ Handles empty state (should be in ChatPage at pages/chat/index.tsx)
 * 3. ❌ ChatInput is in ChatMessages (should be here)
 * 
 * NEW ARCHITECTURE:
 * 
 * This component should ONLY be used in /chat/:id page (active conversation).
 * - Rendered by ChatSession component in src/pages/chat/[id].tsx
 * - NOT used directly in App.tsx (that's the page component's job)
 * - Should NOT handle empty state - that's for ChatPage with EmptyChat
 * 
 * REQUIRED CHANGES:
 * 
 * 1. Remove Zustand dependency:
 *    - DELETE: const { currentConversationId, setCurrentConversation } = useChatStore();
 *    - ADD: Accept threadId as prop from parent page component
 *    - Use URL params (useParams) in parent, pass as prop
 * 
 * 2. Remove EmptyChat logic:
 *    - DELETE: All empty state handling
 *    - DELETE: EmptyChat component import and usage
 *    - This component assumes conversation exists
 * 
 * 3. Move ChatInput here:
 *    - ChatInput should be part of ChatInterface, not ChatMessages
 *    - ChatMessages should ONLY render message list
 *    - Layout: <ChatMessages /> at top, <ChatInput /> at bottom
 * 
 * 4. Simplify structure:
 *    ```tsx
 *    const ChatInterface = ({ threadId }: { threadId: string }) => {
 *      const { messages, sendMessage, agentThinking } = useChatQueries(threadId);
 *      
 *      return (
 *        <div className="chat-container">
 *          <ChatMessages messages={messages} agentThinking={agentThinking} />
 *          <ChatInput onSendMessage={sendMessage} disabled={agentThinking} />
 *        </div>
 *      );
 *    };
 *    ```
 * 
 * USAGE:
 * - Only used in /chat/:id page
 * - Receives threadId from URL params via parent page component
 * - Displays active conversation with messages
 * 
 * See docs/CHAT_FEEDBACK.md for detailed refactoring guide
 */

// import { useChatStore } from "../store/chatStore"; // ❌ TODO: Remove this import
// import ChatLoader from "./ChatLoader";
// import EmptyChat from "./EmptyChat"; // ❌ TODO: Remove this import - EmptyChat belongs in /chat page
// import ChatMessages from "./ChatMessages";
// import { useChatQueries } from "../hooks/useChat";

// const ChatInterface = () => {
//     const { currentConversationId, setCurrentConversation } = useChatStore();
//     const {
//         messages,
//         sendMessage,
//         agentThinking,
//         isSendingMessage,
//         isLoadingMessages,
//         createNewThread
//     } = useChatQueries(currentConversationId);

//     const handleSendMessage = async (message: string) => {
//         let targetThreadId = currentConversationId;
//         if (!currentConversationId) {
//             try {
//                 const newThread = await createNewThread();
//                 targetThreadId = newThread.id;
//                 setCurrentConversation(newThread.id);
//             } catch (error) {
//                 console.error('Failed to create new thread:', error);
//                 return;
//             }
//         }
//         try {
//             if (typeof targetThreadId === "string") {
//                 await sendMessage(message, targetThreadId);
//             } else {
//                 console.error('Invalid thread id:', targetThreadId);
//             }
//         } catch (error) {
//             console.error('Failed to send message:', error);
//         }
//     };

//     // Only show loader if loading messages for an existing conversation that has messages
//     if (isLoadingMessages && currentConversationId && messages && messages.length > 0) {
//         return <ChatLoader />;
//     }

//     if (!currentConversationId || !messages || messages.length === 0) {
//         return (
//             <EmptyChat
//                 onSendMessage={handleSendMessage}
//                 disabled={isSendingMessage || agentThinking}
//                 placeholder={agentThinking ? "Agent is thinking..." : "Ask anything..."}
//             />
//         );
//     }

//     return (
//         <ChatMessages
//             messages={messages}
//             agentThinking={agentThinking}
//             isSendingMessage={isSendingMessage}
//             onSendMessage={handleSendMessage}
//         />
//     );
// };

// export default ChatInterface;
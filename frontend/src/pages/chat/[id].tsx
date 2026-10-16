import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useCallback, useRef, useState } from "react";
import { ChatInput, ChatMessages } from "@/features/agent/components/chat";
import { useChatStore } from "@/features/agent/store/agentStore";
import { useChatQueries } from "@/features/agent/hooks/useChatQueries";
import { FinishLoader, ChatScrollLoader } from "@/components/loading-screens";
import QuizModal from "@/features/aesthetics/components/quiz/QuizModal";
import { sampleAesthetics } from "@/data/sampleAesthetics";
import { writeAestheticsMessage } from "@/features/agent/utils";
import { ChatActionsProvider } from "@/features/agent/context/ChatActionsContext";
import  VoiceAgentModal from "@/features/voice/components/VoiceAgentModal";
import { useVoiceStore } from "@/features/voice/store/voiceStore";
import DesktopChatCanvas from "@/features/agent/components/canvas/DesktopChatCanvas";
import MobileChatCanvas from "@/features/agent/components/canvas/MobileChatCanvas";
import CollectionButton from "@/features/agent/components/canvas/CollectionButton";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (value?: string | null): boolean =>
  !!value && UUID_PATTERN.test(value);

export default function ChatSession() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isOnboardingRoute = location.pathname === "/chat/onboarding";
  const { openVoiceModal } = useVoiceStore();
  const voiceStarted = useRef(false);

  // Redirect if id is present but not a valid UUID (and not onboarding)
  useEffect(() => {
    if (id && !isOnboardingRoute && !isValidUUID(id)) {
      navigate("/chat", { replace: true });
    }
  }, [id, isOnboardingRoute, navigate]);

  const [resolvedThreadId, setResolvedThreadId] = useState<string | null>(
    isOnboardingRoute ? null : isValidUUID(id) ? id : null
  );
  const initialMessageSent = useRef(false);
  const onboardingInitRef = useRef(false);

  const {
    showFinishLoader,
    showScrollLoader,
    setShowScrollLoader,
    openAestheticQuizModal,
    setOpenAestheticQuizModal,
    isCanvasOpen,
  } = useChatStore();

  const {
    messages,
    isLoadingMessages,
    isSendingMessage,
    sendMessage,
    sendMessageError,
    agentThinking,
    createNewOnboardingThread,
  } = useChatQueries(resolvedThreadId);

  useEffect(() => {
    if (!isOnboardingRoute && isValidUUID(id)) {
      setResolvedThreadId(id);
    }
  }, [id, isOnboardingRoute]);

  useEffect(() => {
    if (!isOnboardingRoute || onboardingInitRef.current) return;

    onboardingInitRef.current = true;

    (async () => {
      try {
        const thread = await createNewOnboardingThread();
        setResolvedThreadId(thread.id);
        // check if the conversation has no messages, then send the initial message
        if (thread.responses.length === 0) {
          await sendMessage("Hey Azugh", thread.id);
        }
      } catch (error) {
        console.error("Failed to initialize onboarding chat:", error);
        onboardingInitRef.current = false;
      }
    })();
  }, [isOnboardingRoute, createNewOnboardingThread, sendMessage]);


  // Handle voice start from navigation state
  useEffect(() => {
    const startVoice = location.state?.startVoice;

    if (startVoice && id && !voiceStarted.current) {
      voiceStarted.current = true;
      console.log("Starting voice for thread:", id);

      // Open the voice modal with this thread
      openVoiceModal(id);

      // Clear the navigation state to prevent re-opening
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [id, location.state, location.pathname, navigate, openVoiceModal]);

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      if (!resolvedThreadId) return;

      try {
        await sendMessage(userMessage);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [resolvedThreadId, sendMessage]
  );

  useEffect(() => {
    const initialMessage = location.state?.initialMessage;

    if (
      initialMessage &&
      resolvedThreadId &&
      !initialMessageSent.current &&
      !isLoadingMessages
    ) {
      initialMessageSent.current = true;
      handleSendMessage(initialMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    resolvedThreadId,
    location.state,
    location.pathname,
    navigate,
    handleSendMessage,
    isLoadingMessages,
  ]);

  const handleWidgetInteraction = useCallback(
    (data: Record<string, unknown>) => {
      console.log("Widget interaction:", data);
      // For now, just log the interaction
      // In the future, we can send this as a structured message to the agent
    },
    []
  );

  const handleFinishScrollAnimation = async ()=>{
    await setShowScrollLoader(false)
    // navigate to chat
    navigate("/chat")
  }

  // Show error if there was an issue sending a message
  if (sendMessageError) {
    console.error("Chat error:", sendMessageError);
  }

  return (
    <ChatActionsProvider
      sendMessage={handleSendMessage}
      threadId={resolvedThreadId}
    >
      <VoiceAgentModal />
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none} .hide-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}`}</style>
      <div className="h-full w-full min-h-full flex items-stretch justify-center pb-4 overflow-hidden gap-4">
        {/* Main Chat Area */}
        <div className={`h-full flex flex-col justify-between items-center bg-transparent overflow-hidden transition-all duration-300 ${isCanvasOpen ? 'flex-1 max-w-2xl' : 'w-full max-w-2xl'}`}>
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="w-full px-4 py-6">
              {isLoadingMessages ? (
                <></>
              ) : (
                <ChatMessages
                  messages={messages || []}
                  agentThinking={agentThinking}
                />
              )}
            </div>
          </div>

          <div className="w-full mb-0">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isSendingMessage}
              threadId={resolvedThreadId}
              placeholder={isOnboardingRoute ? "talk about myself..." : "style me for..."}
            />
          </div>
        </div>

        {/* Desktop Canvas - appears on the right when open */}
        {isCanvasOpen && (
          <div className="hidden lg:flex h-full py-4 pr-4 w-[50%]">
            <DesktopChatCanvas />
          </div>
        )}
        
        {/* Mobile Canvas - full screen overlay */}
        <div className="lg:hidden">
          <MobileChatCanvas />
        </div>
        
        {showScrollLoader && (
          <ChatScrollLoader
            onClick={handleFinishScrollAnimation}
            buttonOnClick={handleFinishScrollAnimation}
            onFinished={handleFinishScrollAnimation}
          />
        )}
        {showFinishLoader && <FinishLoader />}
        <QuizModal
          open={openAestheticQuizModal}
          onClose={() => setOpenAestheticQuizModal(false)}
          aesthetics={sampleAesthetics}
          onComplete={({ liked, disliked }) => {
            console.log("Liked:", liked);
            console.log("Disliked:", disliked);
            const aestheticsMessage = writeAestheticsMessage(liked, disliked);
            handleSendMessage(aestheticsMessage);
          }}
        />
        
        {/* Collection Button - Floating Action Button */}
        <CollectionButton />
      </div>
    </ChatActionsProvider>
  );
}

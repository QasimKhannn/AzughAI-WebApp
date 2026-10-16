import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatBotPage from "../azugh";
import { useOnboardingModal } from "@/features/onboarding/store/onboardingStore";
import SummaryPopup from "@/features/aesthetics/components/summary/SummaryPopup";
import FinishLoader from "@/components/loading-screens/FinishLoader";
import ChatScrollLoader from "@/components/loading-screens/ChatScrollLoader";
import { useAzughContext } from "@/context";
import { AzughProvider } from "@/context";

const HomePage = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const isOnboarding = window.location.pathname.startsWith("/home/onboarding");

    const {
        showFinishLoader,
        openFinishLoader,
        closeFinishLoader,
        showSummaryPopup,
        openSummaryPopup,
        closeSummaryPopup,
        showChatRevealLoader,
        openChatRevealLoader,
        closeChatRevealLoader,
    } = useOnboardingModal();

      const {
        setMessages,
        setLoading
      } = useAzughContext();

    // New state for chat reveal loader
    // const [showChatRevealLoader, setShowChatRevealLoader] = useState(false);

    // Only show loader if coming from onboarding
    // useEffect(() => {
    //     if (isOnboarding) {
    //         closeSummaryPopup(); // Ensure summary is closed first
    //         openFinishLoader();
    //     }
    // }, [isOnboarding, openFinishLoader, closeSummaryPopup]);

    // Called when loader animation finishes
    const handleLoaderFinished = () => {
        closeFinishLoader();
        setTimeout(() => {
            openSummaryPopup();
        }, 100);
    };

    // Called when summary popup is accepted
    const handleSummaryAccepted = () => {
        closeSummaryPopup();
        openChatRevealLoader();
    };

    // Called when user wants to go back to chat
    const handleGoBackToChat = () => {
        closeSummaryPopup();
        // User continues with the existing chat state
        // No need to clear messages or navigate away
    };

    // Called when chat reveal loader finishes
    const handleChatRevealFinished = () => {
        closeChatRevealLoader();
        // Navigate to /home with smooth transition
        navigate("/home");
        //window.location.href = "/home"
        // clear the chat history or reset any necessary state here
        setMessages([]);
        setLoading(false);
        
        // Optionally, you can trigger any next step here
    };

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">

            <img
                src="/assets/backgrounds/green_bg.png"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div className="absolute inset-0 bg-black bg-opacity-25 z-10"></div>

            <div className="absolute inset-0 flex flex-col z-20">
                <div className="flex-1 flex flex-col justify-end">
                    <ChatBotPage />
                </div>
            </div>

            {/* Loader exists ONLY here */}
            {showFinishLoader && (
                <FinishLoader  />
            )}

            {/* Popup exists ONLY here */}
            {showSummaryPopup && (
                <SummaryPopup 
                    open={showSummaryPopup} 
                    onClose={handleSummaryAccepted}
                    onGoBackToChat={handleGoBackToChat}
                />
            )}

            {/* Chat Reveal Loader */}
            {showChatRevealLoader && (
                <ChatScrollLoader onFinished={handleChatRevealFinished} />
            )}
        </div>
    );
};

export default HomePage;


const ChatBotPageInner = () => {
    return (
        <AzughProvider>
            <HomePage />
        </AzughProvider>
    );
}

export { ChatBotPageInner };
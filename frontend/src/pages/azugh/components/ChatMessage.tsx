import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AssistantAvatar, AssistantMessageWrapper, UserAvatar } from "./ChatCommon";
import OcassionWidget from "../widgets/OcassionWidget";
import BudgetWidget from "../widgets/BudgetWidget";
import PiecesWidget from "../widgets/PiecesWidget";
import ItemsWidget from "../widgets/ItemsWidget";
import UploadImageWidgetProps from "../widgets/UploadImageWidget";
import Button from "@/components/common/button/Button";
import { ArrowRight } from "lucide-react";
import MotionText from "@/components/animations/MotionText";
import MainModal from "../components/MainModal";
import OnboardingModal from "../components/OnboardingModal";
import { useAzughContext } from "@/context";
import UploadClosetWidget from "../widgets/UploadClosetWidget";
import { useOnboardingModal } from "@/features/onboarding/store/onboardingStore";

interface ChatMessageProps {
  msg: { sender: string; text: string; widget?: string };
  isLastAssistant: boolean;
  setModalOpen?: (val: boolean) => void;
  modalOpen?: boolean;
  isOnboarding?: boolean;
  handleConfirmAestheticsSelection?: () => void;
  currentItem?: any;
  modalItemIdx?: number | null;
  finalItems?: any[];
  onWishlist?: (idx: number) => void;
  onAddToCart?: (idx: number) => void;
  setModalItemIdx?: (idx: number) => void;
  aestheticsSelected?: boolean;
}

const ChatMessage = memo((props: ChatMessageProps) => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  const [helpText, setHelpText] = useState("I don’t know where to start...");
  const { msg, isLastAssistant, } = props;
  const {
    setMessages,
    finalItems,
    setShowHelpButton,
    setLoading,
    currentItem,
    modalOpen,
    setModalOpen,
    modalItemIdx
  } = useAzughContext();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [aestheticsSelected, setAestheticsSelected] = useState(false);

  const handleConfirmAestheticsSelection = async () => {
    setAestheticsSelected(true);
    setModalOpen(false);
    // send message to chat
    setLoading(true);
    await delay(600);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      {
        sender: "assistant",
        text:
        "Perfect! Your closet is now set up and ready to go. \n\nWant me to get even more precise? You can upload a full body and your favorite selfie so I can understand your skin tone, hair, and overall vibe, or just describe it if that feels better for you",
        widget: "upload_image"
      },
    ]);
    setShowHelpButton(true);
    setHelpText("Yes exactly")
  }

  const handleImageUploadContinue = async () => {
    setLoading(true);
    await delay(600);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      {
      sender: "assistant",
      text: "Alright, here’s what I’ve picked up so far: \n You’re someone who loves expressing yourself through fashion, avoids styles that don’t feel authentic, and wants a look that’s both effortless and unique. Sound about right? Want to adjust anything before we start building your wardrobe story? You can tell me now or tweak your profile later in settings.",
      widget: "upload_closet"
      },
    ]);
  }

      const {
          showFinishLoader,
          openFinishLoader,
          closeFinishLoader,
          showSummaryPopup,
          openSummaryPopup,
          closeSummaryPopup,
          //setShowStartOptions
      } = useOnboardingModal();

  const handleClosetConfirmation = async () => {
    setLoading(true);
    await delay(600);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      {
        sender: "assistant",
        text:
          "Great! Now, tell me where you're headed, and I'll pick the perfect look for it. Whether it's a casual coffee run or a special night out — I've got your style covered. ✨",
      },
    ]);
    await delay(2500);
    closeSummaryPopup(); // Ensure summary is closed first
    openFinishLoader();
    //setMessages([]); // Clear chat history
    //setShowStartOptions(true);
  }

  const handleFinalItemWishlist = (idx: number) => {
    // Handle wishlist logic here if needed
    console.log("Added to wishlist:", finalItems[idx]);
  };

  const handleFinalItemAddToCart = (idx: number) => {
    // Handle cart logic here if needed
    console.log("Added to cart:", finalItems[idx]);
  };


  // Only render modal for the aesthetics message
  if (
    msg.sender === "assistant" &&
    msg.text.startsWith("Great choice! Let’s get you set up with aesthetics that truly")
  ) {
    return (
      <>
        <AssistantMessageWrapper text={msg.text} />
        {!aestheticsSelected && (
          <div className="flex flex-col items-center justify-center max-w-md mx-auto mt-6 gap-2 w-full">
            <Button
              label="Go to Aesthetics"
              icon={<ArrowRight />}
              className="w-1/2"
              onClick={() => {
                setIsOnboarding(true); // <-- Add this line
                setModalOpen && setModalOpen(true);
              }}
            />
          </div>
        )}
        {/* Modal logic is now here */}
        {isOnboarding ? (
          <OnboardingModal
            open={modalOpen}
            onClose={handleConfirmAestheticsSelection}
            onboardingWidget="aesthetics"
          />
        ) : (
          <MainModal
            open={modalOpen}
            onClose={() => setModalOpen && setModalOpen(false)}
            item={currentItem || (modalItemIdx !== null ? finalItems?.[modalItemIdx!] : null)}
            itemIdx={modalItemIdx}
            items={finalItems}
            wishlist={new Set()}
            onWishlist={handleFinalItemWishlist}
            cart={new Set()}
            onAddToCart={handleFinalItemAddToCart}
          />
        )}
      </>
    );
  }

  if (msg.sender === "assistant" && msg.widget) {
    switch (msg.widget) {
      case "upload_closet":
        return (
          <AssistantMessageWrapper text={msg.text}>
            <UploadClosetWidget
              onContinue={handleClosetConfirmation}
              onSkip={handleClosetConfirmation}
            />
          </AssistantMessageWrapper>
        );
      case "upload_image":
        return (
          <AssistantMessageWrapper text={msg.text}>
            <UploadImageWidgetProps onContinue={handleImageUploadContinue} />
          </AssistantMessageWrapper>
        );
    }
  }

  if (msg.sender === "assistant") {
    switch (msg.text) {
      case "Tell me where you're headed, and I'll pick the perfect look for it. Whether it's a casual coffee run or a special night out — I've got your style covered. ✨":
        return (
          <AssistantMessageWrapper text={msg.text}>
            <OcassionWidget />
          </AssistantMessageWrapper>
        );
      case "Let’s talk budget 💸\nNo stress — I’ll style you within your range. Just slide to set what you’re comfortable spending, and I’ll find the best picks that won’t break the bank.":
        return (
          <AssistantMessageWrapper text={msg.text}>
            <BudgetWidget />
          </AssistantMessageWrapper>
        );
      case "Looking for a full outfit or just a couple of key pieces? Let me know how many items you’re after, and I’ll build the perfect combo for you.":
        return (
          <AssistantMessageWrapper text={msg.text}>
            <PiecesWidget />
          </AssistantMessageWrapper>
        );
      case "Tops, dresses, pants, or maybe outerwear? Pick the type of clothing you’re looking for, and I’ll show you the best options in style.":
        return (
          <AssistantMessageWrapper text={msg.text}>
            <ItemsWidget />
          </AssistantMessageWrapper>
        );
      case "Want me to get even more precise? You can upload a full body and your favorite selfie so I can understand your skin tone, hair, and overall vibe, or just describe it if that feels better for you":
        return (
          <>
            <AssistantMessageWrapper text={msg.text}>
              <UploadImageWidgetProps />
            </AssistantMessageWrapper>
          </>
        );
      default:
        return (
          <div className="flex items-end px-4">
            <AssistantAvatar />
            <div className="py-2 px-3 w-fit min-h-[2.5rem] rounded-xl max-w-[90vw] md:max-w-[45vw] bg-white text-gray-900 shadow prose prose-sm transition-all duration-300">
              <ReactMarkdown
                components={{
                  p: ({ children }) =>
                    isLastAssistant
                      ? <MotionText text={String(children)} speed={15} />
                      : <span>{children}</span>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        );
    }
  }

  // Get user name from localStorage
  const getUserName = () => {
    return localStorage.getItem("userName") || "User";
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = getUserName();
  const userInitials = getUserInitials(userName);

  // User message
  return (
    <div className="flex items-end justify-end px-4">
      <div className="py-2 px-3 rounded-xl max-w-[80vw] sm:max-w-[60vw] bg-chat-assistant text-gray-900 shadow w-fit min-w-[2.5rem]">
        {msg.text}
      </div>
      <UserAvatar initials={userInitials} name={userName} />
    </div>
  );
});

export default ChatMessage;

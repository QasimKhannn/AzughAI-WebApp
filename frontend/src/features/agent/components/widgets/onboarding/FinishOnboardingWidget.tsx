import { WidgetProps } from "@/features/agent/types";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/features/agent/store/agentStore";
import { useChatActions } from "@/features/agent/context/ChatActionsContext";
import { SummaryPopup } from "@/features/aesthetics/components/summary";
import { useState, useEffect } from "react";
import { useGenerateOnboardingSummaryMutation } from "@/features/agent/hooks/useChatQueries";
import type { OnboardingKeywords } from "@/features/aesthetics/types";
import { toast } from "sonner";

export default function FinishOnboardingWidget({
  arguments: args,
  messageId,
  onInteraction,
}: WidgetProps) {
  const { sendMessage, threadId } = useChatActions();
  const [displayOnboardingSummary, setDisplayOnboardingSummary] =
    useState(false);
  const { setShowFinishLoader, setShowScrollLoader } = useChatStore();
  
  // State to store the generated summary and keywords
  const [summary, setSummary] = useState<string | undefined>(undefined);
  const [keywords, setKeywords] = useState<OnboardingKeywords | undefined>(undefined);
  
  // Use the onboarding summary mutation
  const generateSummaryMutation = useGenerateOnboardingSummaryMutation();

  // Bind the loader to the mutation's pending state
  useEffect(() => {
    setShowFinishLoader(generateSummaryMutation.isPending);
  }, [generateSummaryMutation.isPending, setShowFinishLoader]);

  const handleReady = async () => {
    if (!threadId) {
      toast.error("Could not generate summary. Please try again.");
      return;
    }

    try {
      // Call the API to generate summary and extract keywords
      const result = await generateSummaryMutation.mutateAsync(threadId);
      
      // Store the results
      setSummary(result.summary);
      setKeywords(result.keywords);
      
      // Show the summary popup
      setDisplayOnboardingSummary(true);
    } catch (error) {
      console.error("Failed to generate onboarding summary:", error);
      toast.error("Could not generate your style profile. Please try again.");
    }
  };

  const handleNotReady = async () => {
    // Handle not ready action
    await sendMessage("I'm not ready yet");
  };

  const handleCloseSummary = async () => {
    // close the summary
    setDisplayOnboardingSummary(false)
    // display the scroll animation
    setShowScrollLoader(true);
  };

  const handleGoBackToChat = async () =>{
    // close the summary and send a message
    setDisplayOnboardingSummary(false)
    await sendMessage("Let's discuss further");
  }

  return (
    <div className="relative flex w-full items-center justify-center">
      <Button
        variant="outline"
        className="flex items-center justify-center w-[179px] h-[179px] rounded-full border-white text-white hover:bg-white z-10 -mr-3"
        onClick={handleNotReady}
        disabled={generateSummaryMutation.isPending}
      >
        <span className="font-light text-lg text-center">
          I'm not ready
          <br />
          yet
        </span>
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center w-[179px] h-[179px] rounded-full border-white text-white hover:bg-white -ml-3"
        onClick={handleReady}
        disabled={generateSummaryMutation.isPending}
      >
        <span className="font-light text-lg text-center">
          I'm ready
          <br />
          to go
        </span>
      </Button>
      <SummaryPopup
        open={displayOnboardingSummary}
        onClose={() => handleCloseSummary()}
        onGoBackToChat={() => handleGoBackToChat()}
        summary={summary}
        keywords={keywords}
      />
    </div>
  );
}

import { WidgetProps } from "@/features/agent/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/features/agent/store/agentStore";

export default function OpenAestheticsWidget({
  arguments: args,
  messageId,
  onInteraction,
}: WidgetProps) {
  const { setOpenAestheticQuizModal } = useChatStore();
  const handleClick = () => {
    setOpenAestheticQuizModal(true);
  };

  return (
    <div className="flex w-full items-center justify-center">
    <Button
      variant="outline"
      className="flex items-center justify-center w-[179px] h-[179px] rounded-full border-white text-white hover:bg-white"
      onClick={handleClick}
    >
      <span className="font-light text-lg text-center">
        choose your
        <br />
        aesthetics
      </span>
    </Button>
    </div>
  );
}

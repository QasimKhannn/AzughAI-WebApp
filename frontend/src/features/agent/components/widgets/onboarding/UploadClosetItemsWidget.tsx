import { useState, useRef, useEffect } from "react";
import { WidgetProps } from "@/features/agent/types";
import { Button } from "@/components/ui/button";
import { ProductUploadPlaceholder } from "@/components/images/ProductUploadPlaceholder";
import QRCodeModal from "@/components/qr-code/QRCodeModal";
import { useChatActions } from "@/features/agent/context/ChatActionsContext";
import { toast } from "sonner";

interface ClosetItem {
  imageUrl: string;
  name: string;
}

const avatarImage = "/assets/creatives/upload_image.png";
const MIN_PLACEHOLDERS = 3;
const DESKTOP_BREAKPOINT = 1024; // lg breakpoint in Tailwind

export default function UploadClosetItemsWidget({
  arguments: args,
  messageId,
  onInteraction,
}: WidgetProps) {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [openQRCode, setOpenQRCode] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : false
  );
  const { sendMessage } = useChatActions();

  // Listen for window resize to update breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate number of placeholders: minimum 3, add 1 if all are filled
  const filledCount = items.length;
  const placeholderCount =
    filledCount >= MIN_PLACEHOLDERS ? filledCount + 1 : MIN_PLACEHOLDERS;

  // Scroll to end when new placeholder is added
  useEffect(() => {
    if (placeholderCount > MIN_PLACEHOLDERS && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [placeholderCount]);

  const handleUploadClick = (index: number) => {
    if (isDesktop) {
      setOpenQRCode(true);
    } else {
      toast.info("Product upload from chat will be available soon.");
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleSkip = async () => {
    await sendMessage("I will upload closet items later");
  };

  const handleSubmit = () => {
    onInteraction?.({
      type: "submit",
      messageId,
      items,
    });
  };

  const hasItems = items.length > 0;

  return (
    <div className="flex flex-col items-center w-full pb-6">
      {/* Avatar */}
      <div className="relative z-10 mb-[-28px] lg:mb-[-40px]">
        <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full border-2 border-[#f0edeb] overflow-hidden">
          <img
            src={avatarImage}
            alt="Closet avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Container */}
      <div className="w-full bg-[#f0edeb] rounded-xl px-6 pt-10 pb-6 flex flex-col gap-6 items-center">
        {/* Instruction Text */}
        <p className="text-foreground text-center text-base lg:text-xl font-light">
          Add items from your closet
          <br />
          to get personalized recommendations.
        </p>

        {/* Product Upload Slots - Scrollable, shows 3 at a time */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 w-full min-h-[220px] overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <ProductUploadPlaceholder
              key={index}
              imageUrl={items[index]?.imageUrl}
              productName={items[index]?.name}
              onUpload={() => handleUploadClick(index)}
              onRemove={() => handleRemoveItem(index)}
              className="flex-shrink-0 min-w-[calc((100%-16px)/3)]"
            />
          ))}
        </div>

        {/* Skip/Submit Button */}
        <Button
          variant={hasItems ? "default" : "ghost-dark"}
          onClick={hasItems ? handleSubmit : handleSkip}
          className="font-light rounded-full px-10 w-full lg:w-auto"
        >
          {hasItems ? "continue" : "skip"}
        </Button>
      </div>

      <QRCodeModal
        open={openQRCode}
        onClose={() => setOpenQRCode(false)}
        qrValue="https://example.com"
        onPrimaryClick={() => {
          toast.info("Product upload from chat will be available soon.");
          setOpenQRCode(false);
        }}
      />
    </div>
  );
}

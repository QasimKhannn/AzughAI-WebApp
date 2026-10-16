import { useState, useRef, useEffect } from "react";
import { WidgetProps } from "@/features/agent/types";
import { Button } from "@/components/ui/button";
import { ImageUploadPlaceholder } from "@/components/images/ImageUploadPlaceholder";
import  QRCodeModal from "@/components/qr-code/QRCodeModal";
import { useChatActions } from "@/features/agent/context/ChatActionsContext";


const avatarImage = "/assets/creatives/upload_image.png";
const MIN_PLACEHOLDERS = 3;
const DESKTOP_BREAKPOINT = 1024; // lg breakpoint in Tailwind

export default function UploadImagesWidget({
  arguments: args,
  messageId,
  onInteraction,
}: WidgetProps) {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [uploadIndex, setUploadIndex] = useState<number>(0);
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
  const filledCount = images.filter(Boolean).length;
  const placeholderCount = filledCount >= images.length && filledCount >= MIN_PLACEHOLDERS
    ? filledCount + 1
    : Math.max(MIN_PLACEHOLDERS, images.length);

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
    setUploadIndex(index);
    if (isDesktop) {
      setOpenQRCode(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages((prev) => {
          const newImages = [...prev];
          newImages[uploadIndex] = result;
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSkip = async () => {
    await sendMessage("I will upload images later");
  };

  const handleSubmit = async () => {
    const uploadedImages = images.filter(Boolean);
    await sendMessage("Done uploading images"); // later implement sending images
  };

  const hasImages = images.some(Boolean);

  return (
    <div className="flex flex-col items-center w-full pb-6">
      {/* User Avatar */}
        <div className="relative z-10 mb-[-28px] lg:mb-[-40px]">
          <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full border-2 border-[#f0edeb] overflow-hidden">
            <img
              src={avatarImage}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      {/* Container */}
      <div className="w-full bg-[#f0edeb] rounded-xl px-6 pt-10 pb-6 flex flex-col gap-6 items-center">
        {/* Instruction Text */}
        <p className="text-foreground text-center text-base lg:text-xl font-light">
          Please, upload a photo in natural light,
          <br />
          selfies & full body if possible.
        </p>

        {/* Photo Upload Slots - Scrollable, shows 3 at a time */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 w-full min-h-[177px] overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <ImageUploadPlaceholder
              key={index}
              imageUrl={images[index]}
              onUpload={() => handleUploadClick(index)}
              onRemove={() => handleRemoveImage(index)}
              className="flex-shrink-0 min-w-[calc((100%-16px)/3)]"
            />
          ))}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Skip/Submit Button */}
        <Button
          variant={hasImages ? "default" : "ghost-dark"}
          onClick={hasImages ? handleSubmit : handleSkip}
          className="font-light rounded-full px-10 w-full lg:w-auto"
        >
          {hasImages ? "continue" : "skip"}
        </Button>
      </div>
      <QRCodeModal
        open={openQRCode}
        onClose={() => setOpenQRCode(false)}
        qrValue="https://example.com"
        onPrimaryClick={() => {
          setOpenQRCode(false);
          fileInputRef.current?.click();
        }}
      />
    </div>
  );
}

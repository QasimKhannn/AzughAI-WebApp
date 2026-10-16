import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CarouselStep from "@/components/onboarding/CarouselStep";
import QuizCarouselCard from "@/components/onboarding/QuizCarouselCard";
import { AESTHETIC_STYLE_OPTIONS } from "@/data/OnboardingData";
import { cn } from "@/lib/utils";

type OnboardingModalProps = {
  open: boolean;
  onClose: () => void;
  onboardingWidget: "aesthetics";
  bgColor?: string;
  useImageBg?: boolean;
  darkMode?: boolean;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  onClose,
  onboardingWidget,
  bgColor = "transparent",
  useImageBg = true,
  darkMode = false,
}) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [votes, setVotes] = React.useState<{
    [label: string]: "up" | "down" | null;
  }>({});
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  // Get actual viewport height
  const getViewportHeight = () => {
    return window.visualViewport?.height || document.documentElement.clientHeight || window.innerHeight;
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const handleClose = async () => {
    if (
      onboardingWidget === "aesthetics" &&
      currentIdx >= AESTHETIC_STYLE_OPTIONS.length
    ) {
      // Wait for the last swipe animation to finish
      await delay(300);
      onClose();
      // reset currentIdx
      setCurrentIdx(0);
      setVotes({});
    }
  };

  useEffect(() => {
    // if it is the aesthetics widget, and last image is swiped, go to next step
    handleClose();
  }, [currentIdx]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(getViewportHeight());
    };

    const handleVisualViewportChange = () => {
      setWindowHeight(getViewportHeight());
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleVisualViewportChange);

    // Update dimensions when modal opens
    if (open) {
      setWindowWidth(window.innerWidth);
      setWindowHeight(getViewportHeight());
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleVisualViewportChange);
    };
  }, [open]);

  const renderWidget = () => {
    switch (onboardingWidget) {
      case "aesthetics":
        // Calculate dimensions with height as priority, then calculate width based on proportion
        const maxHeight = Math.floor(windowHeight * 1.1);
        const aspectRatio = 0.55; // width/height ratio for rectangular proportion

        // Use maxHeight as the final height
        const calculatedHeight = maxHeight;
        const calculatedWidth = Math.floor(calculatedHeight * aspectRatio);

        return (
          <CarouselStep
            items={AESTHETIC_STYLE_OPTIONS}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            votes={votes}
            setVotes={setVotes}
            renderItem={(item, idx, isActive) => (
              <QuizCarouselCard
                item={item}
                idx={idx}
                isActive={isActive}
                carouselStep={0}
              />
            )}
            cardWidth={calculatedWidth}
            height={calculatedHeight}
            className="!px-0 pt-[12.5vh]"
            buttonsDarkMode={darkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 !mt-0 w-full h-full !z-30", bgColor)}>
          {useImageBg && (
            <img
              src="/assets/backgrounds/green_bg.png"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover z-40"
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed left-0 top-0 right-0 w-full !h-screen z-40 flex items-center justify-center bg-transparent overflow-hidden"
          >
            {renderWidget()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;

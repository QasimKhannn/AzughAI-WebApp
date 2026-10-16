import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const defaultMessages = [
  "I'm traveling to Ibiza, pack for me",
  "Help me dress up for Pride",
  "Outfits for interview",
  "Business conference speaker outfit",
  "Outfit for a romantic date",
  "Wedding guest outfit",
  "Rebrand my style"
];

// VISUAL VALUES
const bubbleHeight = 60;
const gapHeight = 112;
const rowHeight = bubbleHeight + gapHeight;

interface ChatScrollLoaderProps {
  messages?: string[];
  speed?: number;
  onFinished?: () => void;
  bgImage?: string;
  buttonOnClick?: () => void;
  onClick?: () => void;
}

const ChatScrollLoader = ({
  messages = defaultMessages,
  speed = 200,
  onFinished,
  bgImage = "/assets/backgrounds/green_bg.png",
  buttonOnClick,
  onClick,
}: ChatScrollLoaderProps) => {
  const [scrollY, setScrollY] = useState(0);
  const animationFrame = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // For lerp smoothing
  const targetY = useRef(0);

  // Total scroll distance: all messages + one extra row
  const totalRows = messages.length + 1;
  const totalScroll = totalRows * rowHeight;

  useEffect(() => {
    let containerHeight = 0;
    if (containerRef.current) {
      containerHeight = containerRef.current.offsetHeight;
    } else {
      containerHeight = window.innerHeight;
    }

    function animateScroll(timestamp: number) {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = (timestamp - startTime.current) / 1000; // seconds
      targetY.current = Math.min(elapsed * speed, totalScroll + containerHeight);

      // Lerp for smoothness
      setScrollY(prev => prev + (targetY.current - prev) * 0.15);

      if (targetY.current < totalScroll + containerHeight - 1) {
        animationFrame.current = requestAnimationFrame(animateScroll);
      } else {
        setScrollY(totalScroll + containerHeight);
        if (onFinished) setTimeout(onFinished, 400);
      }
    }

    animationFrame.current = requestAnimationFrame(animateScroll);

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      startTime.current = null;
    };
  }, [speed, totalScroll, onFinished]);

  return createPortal(
    <div 
      className="fixed inset-0 w-full h-full z-[9999]"
      onClick={onClick}
    >
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Background image */}
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />

        {/* Close button */}
        {buttonOnClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              buttonOnClick();
            }}
            className="absolute top-6 right-6 z-50 p-2 rounded-full border border-white/50 
                       bg-transparent hover:bg-white/10 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Top fade */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-40 
                        bg-gradient-to-b from-black via-black/70 to-transparent z-30" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 
                        bg-gradient-to-t from-black via-black/70 to-transparent z-30" />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10" />

        {/* Chat container */}
        <div
          ref={containerRef}
          className="relative w-full px-5 md:px-0 md:w-1/2 h-full z-20 overflow-hidden pt-[130vh]"
        >
          {/* SCROLLING WRAPPER */}
          <motion.div
            className="flex flex-col items-center gap-32"
            style={{ y: -scrollY }}
            transition={undefined}
          >
            {messages.map((text, idx) => (
              <div
                key={idx}
                className={`flex items-center w-full ${idx % 2 === 0 ? "justify-end" : "justify-start"}`}
                style={{ height: "clamp(48px, 8vw, 60px)" }}
              >
                <div className="
                  px-4 py-4
                  md:px-8 md:py-5
                  bg-chat-user backdrop-blur-md text-foreground
                  rounded-tl-2xl rounded-br-2xl shadow-lg font-light
                  text-sm sm:text-base md:text-lg
                  whitespace-normal
                  max-w-[90vw] sm:max-w-[70vw] md:max-w-md
                  break-words
                ">
                  {text}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChatScrollLoader;

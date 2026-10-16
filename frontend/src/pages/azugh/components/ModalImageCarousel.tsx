import React, { useEffect, useMemo, useRef, useState } from "react";
import { Heart } from "lucide-react";
import ImageIcon from "@/components/icons/ImageIcon";

type ModalImageCarouselProps = {
  images: string[];
  currentIdx: number;            // Controlled: 0..images.length-1
  onPrev: () => void;
  onNext: () => void;
  alt: string;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;

  /** Layout (total width = main + peek). Peek is ~20% by default */
  width?: number;                // e.g. 310
  height?: number;               // e.g. 260
  peekFraction?: number;         // 0.2 = 20% of total width
};

const ModalImageCarousel: React.FC<ModalImageCarouselProps> = ({
  images,
  currentIdx,
  onPrev,
  onNext,
  alt,
  isWishlisted,
  onToggleWishlist,
  width = 290,
  height = 307,
  peekFraction = 0.2,
}) => {
  const count = images?.length ?? 0;
  if (!count) return null;

  const n = count;

  // --- Dimensions ---
  const shiftPx = 20; // Amount to shift from main to peek
  const clampedPeekFraction = Math.max(0, Math.min(peekFraction, 0.5));
  const peekPx = Math.round(width * clampedPeekFraction) + shiftPx;
  const slideWidth = width - peekPx; // main image width is now smaller

  // --- Infinite track with clones so the peek always shows the "next" image ---
  // display = [last, ...images, first] when n > 1. Otherwise just [images[0]].
  const displayImages = useMemo(() => {
    if (n <= 1) return images.slice();
    return [images[n - 1], ...images, images[0]];
  }, [images, n]);

  const displayCount = displayImages.length; // n + 2 when n > 1

  // visualIdx is the index inside displayImages (accounting for clones).
  // The "real" index currentIdx maps to visualIdx = currentIdx + 1.
  const [visualIdx, setVisualIdx] = useState(() => (n > 1 ? currentIdx + 1 : 0));
  const [enableTransition, setEnableTransition] = useState(true);

  const prevIdxRef = useRef(currentIdx);

  // Sync visualIdx with currentIdx changes from parent and handle wrap (0 <-> n-1)
  useEffect(() => {
    if (n <= 1) {
      setVisualIdx(0);
      return;
    }

    const prev = prevIdxRef.current;
    const next = currentIdx;

    // Default visual target (no wrap)
    let targetVisual = next + 1;

    // Detect forward wrap: last -> 0
    if (prev === n - 1 && next === 0) {
      // Animate to trailing clone at index n+1
      targetVisual = n + 1;
    }
    // Detect backward wrap: 0 -> last
    else if (prev === 0 && next === n - 1) {
      // Animate to leading clone at index 0
      targetVisual = 0;
    }

    setEnableTransition(true);
    setVisualIdx(targetVisual);
    prevIdxRef.current = next;
  }, [currentIdx, n]);

  // After reaching a clone, snap without transition to the corresponding real slide
  const handleTransitionEnd = () => {
    if (n <= 1) return;

    if (visualIdx === 0) {
      // We hit the leading clone (displayImages[0] = last real image)
      setEnableTransition(false);
      setVisualIdx(n); // real "last" is at index n (since [last, ...n, first])
      // Re-enable transition on next frame
      requestAnimationFrame(() => setEnableTransition(true));
    } else if (visualIdx === n + 1) {
      // We hit the trailing clone (displayImages[n+1] = first real image)
      setEnableTransition(false);
      setVisualIdx(1); // real "first" is at index 1
      requestAnimationFrame(() => setEnableTransition(true));
    }
  };

  // Track style: because viewport width > slideWidth, the right strip shows next slide.
  const trackStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: displayCount * slideWidth,
      height,
      transform: `translateX(-${visualIdx * slideWidth}px)`,
      transition: enableTransition ? "transform 0.35s cubic-bezier(0.4,0,0.2,1)" : "none",
      willChange: "transform",
    };
  }, [displayCount, visualIdx, slideWidth, height, enableTransition]);

  // Touch/swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) onPrev();
      else onNext();
    }
    touchStartX.current = null;
  };

  // Where to place UI that shouldn't sit inside the peek strip
  const rightUiOffset = peekPx + 12;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Wishlist */}
      {onToggleWishlist && (
        <button
          className="absolute top-0 right-0 z-20 w-9 h-9 flex items-center justify-center border border-gray-200 bg-white"
          style={{ right: 0, cursor: "pointer" }} // <-- changed from rightUiOffset to 0
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          aria-label="WishList"
          type="button"
        >
          <ImageIcon name={isWishlisted ? "heart-filled.svg" : "heart.svg"} alt="Wishlist" width={20} height={20} />
        </button>
      )}

      {/* Left arrow */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center rounded-md bg-white/80 border border-gray-200 px-2 py-1 shadow"
        style={{ display: n > 1 ? undefined : "none" }}
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
        type="button"
      >
        <span className="text-xl">&#8592;</span>
      </button>

      {/* Right arrow (not inside the peek zone) */}
      <button
        className="absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center rounded-md bg-white/80 border border-gray-200 px-2 py-1 shadow"
        style={{ right: rightUiOffset - 4, display: n > 1 ? undefined : "none" }}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
        type="button"
      >
        <span className="text-xl">&#8594;</span>
      </button>

      {/* Viewport (includes main + peek width). Track slides beneath. */}
      <div className="relative overflow-hidden" style={{ width, height }}>
        <div className="flex gap-0" style={trackStyle} onTransitionEnd={handleTransitionEnd}>
          {displayImages.map((src, i) => (
            <div
              key={`${src}_${i}`}
              className="flex items-center justify-center shrink-0 p-0 m-0"
              style={{ width: slideWidth, height }}
            >
              <img
                src={src}
                alt={alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  boxShadow:
                    n > 1 && i === visualIdx
                      ? "0 4px 16px rgba(0,0,0,0.08)"
                      : undefined,
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalImageCarousel;

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type PeekCarouselProps<T> = {
    items: T[];
    current: number;
    setCurrent: (idx: number) => void;
    renderItem: (item: T, idx: number, isActive: boolean) => React.ReactNode;
    cardWidth?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
};

function PeekCarousel<T>({
    items,
    current,
    setCurrent,
    renderItem,
    cardWidth = 260,
    height = 320,
    className,
    style,
}: PeekCarouselProps<T>) {
    const [containerWidth, setContainerWidth] = useState<number>(window.innerWidth);
    const PEEK = (containerWidth - cardWidth) / 2;
    const x = useMotionValue(-(current * cardWidth - PEEK));
    const springX = useSpring(x, { stiffness: 300, damping: 35 });
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        const handleResize = () => setContainerWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        x.set(-(current * cardWidth - PEEK));
        return () => window.removeEventListener("resize", handleResize);
    }, [current, cardWidth, PEEK, x, items.length]);

    // Ensure current index is always valid when items are removed
    useEffect(() => {
        if (current > items.length - 1 && items.length > 0) {
            setCurrent(items.length - 1);
        }
    }, [items.length, current, setCurrent]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(deltaX) > 40) {
            const newIndex = deltaX > 0 
                ? (current === 0 ? items.length - 1 : current - 1)
                : (current === items.length - 1 ? 0 : current + 1);
            setCurrent(newIndex);
        }
        touchStartX.current = null;
    };

    return (
        <div
            className={`relative w-full max-w-full overflow-hidden ${className || ""}`}
            style={{
                width: containerWidth,
                maxWidth: "100%",
                height,
                ...style,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <motion.div
                className="flex"
                style={{
                    x: springX,
                    willChange: "transform",
                    boxSizing: "border-box",
                }}
            >
                {items.map((item, idx) => {
                    let marginRight;
                    if (idx === items.length - 1 && items.length > 1) {
                        marginRight = `${PEEK}px`;
                    }
                    return (
                        <div
                            key={idx}
                            className={`flex-shrink-0 transition-opacity duration-300 ${idx === current ? "opacity-100 z-20" : "opacity-70 z-10"}`}
                            style={{
                                width: cardWidth,
                                minWidth: cardWidth,
                                height,
                                pointerEvents: "auto",
                                marginRight,
                                cursor: "pointer"
                            }}
                        >
                            <div className="w-full h-full">{renderItem(item, idx, idx === current)}</div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}

export default PeekCarousel;

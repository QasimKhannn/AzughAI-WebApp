import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AestheticsCarouselProps<T> {
    items: T[];
    current: number;
    setCurrent: (idx: number, direction?: "left" | "right") => void;
    renderItem: (item: T, idx: number, isActive: boolean) => React.ReactNode;
    cardWidth?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    onThumbsUpRef?: React.MutableRefObject<(() => void) | null>;
    onThumbsDownRef?: React.MutableRefObject<(() => void) | null>;
    externalLeftStack?: number[];
    externalRightStack?: number[];
}

function AestheticsCarousel<T>({
    items,
    current,
    setCurrent,
    renderItem,
    cardWidth = 260,
    height = 320,
    className,
    style,
    onThumbsUpRef,
    onThumbsDownRef,
    externalLeftStack,
    externalRightStack
}: AestheticsCarouselProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState<number>(window.innerWidth);
    const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < 640);

    const [internalLeftStack, setInternalLeftStack] = useState<number[]>([]);
    const [internalRightStack, setInternalRightStack] = useState<number[]>([]);

    const leftStackToUse = externalLeftStack ?? internalLeftStack;
    const rightStackToUse = externalRightStack ?? internalRightStack;

    // Thumbs up/down handlers
    const handleThumbsUp = React.useCallback(() => {
        if (current < items.length) {
            if (!externalLeftStack && !externalRightStack) {
                setInternalRightStack((prev) => [...prev, current]);
            }
            setCurrent(current + 1, "right");
        }
    }, [current, items.length, setCurrent, externalLeftStack, externalRightStack]);

    const handleThumbsDown = React.useCallback(() => {
        if (current < items.length) {
            if (!externalLeftStack && !externalRightStack) {
                setInternalLeftStack((prev) => [...prev, current]);
            }
            setCurrent(current + 1, "left");
        }
    }, [current, items.length, setCurrent, externalLeftStack, externalRightStack]);

    // Expose handlers via refs if provided
    useEffect(() => {
        if (onThumbsUpRef) onThumbsUpRef.current = handleThumbsUp;
        if (onThumbsDownRef) onThumbsDownRef.current = handleThumbsDown;
    }, [handleThumbsUp, handleThumbsDown, onThumbsUpRef, onThumbsDownRef]);

    useEffect(() => {
        const handleResize = () => {
            const width = containerRef.current?.offsetWidth || window.innerWidth;
            setContainerWidth(width);
            setIsMobile(width < 640);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Responsive card dimensions
    const responsiveCardWidth = Math.min(cardWidth * 0.80, containerWidth * 0.75);
    const responsiveHeight = height * 0.6;

    // Card positions
    const getCenterLeft = () => (containerWidth - responsiveCardWidth) / 2;
    const getLeftStack = () => -responsiveCardWidth * (isMobile ? 0.8 : 0.75);
    const getRightStack = () => containerWidth - responsiveCardWidth * (isMobile ? 0.2 : 0.25);

    // Touch handlers for swipe
    const touchStartX = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || current >= items.length) return;

        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const threshold = 50;

        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                handleThumbsUp();
            } else {
                handleThumbsDown();
            }
        }
        touchStartX.current = null;
    };

    // Reset stacks and current index when external stacks are provided and empty
    useEffect(() => {
        if (externalLeftStack !== undefined && externalRightStack !== undefined) {
            if (externalLeftStack.length === 0 && externalRightStack.length === 0) {
                setInternalLeftStack([]);
                setInternalRightStack([]);
                setCurrent(0);
            }
        } else {
            setInternalLeftStack([]);
            setInternalRightStack([]);
            setCurrent(0);
        }
        // eslint-disable-next-line
    }, [items.length, externalLeftStack?.length, externalRightStack?.length]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full max-w-full overflow-hidden ${className || ""}`}
            style={{
            width: "100%",
            maxWidth: "100%",
            ...style,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative w-full" style={{ height: responsiveHeight }}>
            {/* Left stack */}
            {leftStackToUse.map((idx) =>
                items[idx] ? (
                <motion.div
                    key={`left-${idx}`}
                    className="absolute"
                    style={{
                    left: getLeftStack(),
                    top: 0,
                    width: responsiveCardWidth,
                    minWidth: responsiveCardWidth,
                    height: responsiveHeight,
                    zIndex: 10 + idx,
                    pointerEvents: "none",
                    opacity: 0.7,
                    scale: isMobile ? 0.88 : 0.92,
                    }}
                    initial={{ left: getCenterLeft(), opacity: 1, scale: 1 }}
                    animate={{ left: getLeftStack(), opacity: 0.7, scale: isMobile ? 0.88 : 0.92 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="w-full h-full">{renderItem(items[idx], idx, false)}</div>
                </motion.div>
                ) : null
            )}
            {/* Center card */}
            {current < items.length &&
                !leftStackToUse.includes(current) &&
                !rightStackToUse.includes(current) &&
                items[current] ? (
                <motion.div
                key={`center-${current}`}
                className="absolute"
                style={{
                    left: getCenterLeft(),
                    top: 0,
                    width: responsiveCardWidth,
                    minWidth: responsiveCardWidth,
                    height: responsiveHeight,
                    zIndex: 100,
                    pointerEvents: "auto",
                    opacity: 1,
                    scale: 1,
                    cursor: "pointer",
                }}
                initial={{ left: getCenterLeft(), opacity: 1, scale: 1 }}
                animate={{ left: getCenterLeft(), opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                <div className="w-full h-full">{renderItem(items[current], current, true)}</div>
                </motion.div>
            ) : null}
            {/* Right stack */}
            {rightStackToUse.map((idx) =>
                items[idx] ? (
                <motion.div
                    key={`right-${idx}`}
                    className="absolute"
                    style={{
                    left: getRightStack(),
                    top: 0,
                    width: responsiveCardWidth,
                    minWidth: responsiveCardWidth,
                    height: responsiveHeight,
                    zIndex: 10 + idx,
                    pointerEvents: "none",
                    opacity: 0.7,
                    scale: isMobile ? 0.88 : 0.92,
                    }}
                    initial={{ left: getCenterLeft(), opacity: 1, scale: 1 }}
                    animate={{ left: getRightStack(), opacity: 0.7, scale: isMobile ? 0.88 : 0.92 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="w-full h-full">{renderItem(items[idx], idx, false)}</div>
                </motion.div>
                ) : null
            )}
            </div>
        </div>
    );
}

export default AestheticsCarousel;

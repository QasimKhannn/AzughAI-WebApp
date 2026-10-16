import React from "react";
import AestheticsCarousel from "./AestheticsCarousel";
import { ThumbsUpIcon, ThumbsDownIcon, Undo } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselStepProps = {
    items: any[];
    onNext?: (selected: any[]) => void;
    onBack?: () => void;
    renderItem: (item: any, idx: number, isActive: boolean) => React.ReactNode;
    cardWidth?: number;
    height?: number;
    className?: string;
    hideNavigationButtons?: boolean;
    currentIdx?: number;
    setCurrentIdx?: (idx: number) => void;
    votes?: { [label: string]: "up" | "down" | null };
    setVotes?: (votes: { [label: string]: "up" | "down" | null }) => void;
    buttonsDarkMode?: boolean;
};

const CarouselStep: React.FC<CarouselStepProps> = ({
    items,
    onNext,
    onBack,
    renderItem,
    cardWidth = 224,
    height = 340,
    className = "",
    hideNavigationButtons = false,
    currentIdx: externalCurrentIdx,
    setCurrentIdx: externalSetCurrentIdx,
    votes: externalVotes,
    setVotes: externalSetVotes,
    buttonsDarkMode = false,
}) => {
    const [internalCurrentIdx, setInternalCurrentIdx] = React.useState(0);
    const [internalVotes, setInternalVotes] = React.useState<{ [label: string]: "up" | "down" | null }>({});
    const [leftStack, setLeftStack] = React.useState<number[]>([]);
    const [rightStack, setRightStack] = React.useState<number[]>([]);

    // Use external state if provided, otherwise use internal state
    const currentIdx = externalCurrentIdx !== undefined ? externalCurrentIdx : internalCurrentIdx;
    const setCurrentIdx = externalSetCurrentIdx || setInternalCurrentIdx;
    const votes = externalVotes || internalVotes;
    const setVotes = externalSetVotes || setInternalVotes;

    const handleThumbsUp = React.useCallback(() => {
        if (currentIdx < items.length) {
            const currentItem = items[currentIdx];
            const updatedVotes = { ...votes, [currentItem.label]: "up" as const };
            setVotes(updatedVotes);
            setRightStack(prev => [...prev, currentIdx]);
            setCurrentIdx(currentIdx + 1);
        }
    }, [currentIdx, items, votes, setVotes, setCurrentIdx]);

    const handleThumbsDown = React.useCallback(() => {
        if (currentIdx < items.length) {
            const currentItem = items[currentIdx];
            const updatedVotes = { ...votes, [currentItem.label]: "down" as const };
            setVotes(updatedVotes);
            setLeftStack(prev => [...prev, currentIdx]);
            setCurrentIdx(currentIdx + 1);
        }
    }, [currentIdx, items, votes, setVotes, setCurrentIdx]);

    const handleReturnOption = React.useCallback(() => {
        if (currentIdx > 0) {
            const previousIdx = currentIdx - 1;
            const previousItem = items[previousIdx];
            
            // Remove the vote for the returned card
            const updatedVotes = { ...votes };
            delete updatedVotes[previousItem.label];
            setVotes(updatedVotes);
            
            // Remove the card from the appropriate stack
            // Check which stack the card was in and remove it
            if (leftStack.includes(previousIdx)) {
                setLeftStack(prev => prev.filter(idx => idx !== previousIdx));
            } else if (rightStack.includes(previousIdx)) {
                setRightStack(prev => prev.filter(idx => idx !== previousIdx));
            }
            
            // Move back to the previous card
            setCurrentIdx(previousIdx);
        }
    }, [currentIdx, items, votes, setVotes, leftStack, rightStack, setCurrentIdx]);

    const allCardsSwiped = currentIdx >= items.length;
    const liked = items.filter(opt => votes[opt.label] === "up");

    // Pass voting logic to carousel
    const carouselProps = {
        items,
        current: currentIdx,
        setCurrent: (idx: number, direction?: "left" | "right") => {
            if (idx > currentIdx && currentIdx < items.length) {
                const currentItem = items[currentIdx];
                if (direction === "left") {
                    const updatedVotes = { ...votes, [currentItem.label]: "down" as const };
                    setVotes(updatedVotes);
                    setLeftStack(prev => [...prev, currentIdx]);
                } else if (direction === "right") {
                    const updatedVotes = { ...votes, [currentItem.label]: "up" as const };
                    setVotes(updatedVotes);
                    setRightStack(prev => [...prev, currentIdx]);
                }
            }
            setCurrentIdx(idx);
        },
        cardWidth,
        height,
        renderItem,
        externalLeftStack: leftStack,
        externalRightStack: rightStack,
    };

    // Responsive dimensions
    const isMobile = window.innerWidth < 640;
    const responsiveCardWidth = isMobile ? Math.min(cardWidth, window.innerWidth * 0.75) : cardWidth;
    const responsiveHeight = isMobile ? height * 0.85 : height;

    // Reset carousel state when component mounts or items change
    React.useEffect(() => {
        if (externalSetCurrentIdx) {
            externalSetCurrentIdx(0);
        } else {
            setInternalCurrentIdx(0);
        }

        if (externalSetVotes) {
            externalSetVotes({});
        } else {
            setInternalVotes({});
        }

        setLeftStack([]);
        setRightStack([]);
    }, [items.length, externalSetCurrentIdx, externalSetVotes]);

    return (
        <div className={`flex flex-col w-full items-center font-manrope justify-start ${className || "h-[85vh]"}`}>
            <AestheticsCarousel
                {...carouselProps}
                cardWidth={responsiveCardWidth}
                height={responsiveHeight}
            />
            <div className="flex flex-col items-center justify-center mt-4 sm:mt-6 min-h-[80px] w-full">
                {!allCardsSwiped ? (
                    <div className="flex mb-2 justify-center w-full px-4">
                        <button
                            className={cn("rounded-full p-2 sm:p-2 mr-2 border border-white bg-transparent transition-all flex items-center justify-center", buttonsDarkMode ? "border-black" : "border-white")}
                            onClick={handleThumbsDown}
                            style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56 }}
                            aria-label="Thumbs Down"
                        >
                            <ThumbsDownIcon className={cn("w-5 h-5 sm:w-7 sm:h-7 text-gray-700 fill-white", buttonsDarkMode ? "text-black" : "text-transparent")} fill="white" stroke="currentColor" />
                        </button>
                        <button
                            className={cn("rounded-full p-2 sm:p-2 border border-white bg-transparent transition-all flex items-center justify-center", buttonsDarkMode ? "border-black" : "border-white")}
                            onClick={handleReturnOption}
                            style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56 }}
                            aria-label="Thumbs Up"
                        >
                            <Undo className={cn("w-5 h-5 sm:w-7 sm:h-7 text-white", buttonsDarkMode ? "text-black" : "text-white")}  stroke="currentColor" />
                        </button>
                        <button
                            className={cn("rounded-full p-2 ml-2 sm:p-2 border border-white bg-transparent transition-all flex items-center justify-center", buttonsDarkMode ? "border-black" : "border-white")}
                            onClick={handleThumbsUp}
                            style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56 }}
                            aria-label="Thumbs Up"
                        >
                            <ThumbsUpIcon className={cn("w-5 h-5 sm:w-7 sm:h-7 text-gray-700 fill-white", buttonsDarkMode ? "text-black" : "text-transparent")} fill="white" stroke="currentColor" />
                        </button>
                    </div>
                ) : null}
                <span className={cn("font-light text-lg sm:text-xl text-white mt-1 min-h-[28px] flex items-center justify-center w-full text-center px-4 md:hidden", buttonsDarkMode ? "text-black" : "text-white")}>
                    {!allCardsSwiped ? "swipe left or right" : ""}
                </span>
                <span className={cn("font-light text-lg sm:text-xl text-white mt-1 min-h-[28px] items-center justify-center w-full text-center px-4 hidden md:flex", buttonsDarkMode ? "text-black" : "text-white")}>
                    {!allCardsSwiped ? "click dislike or like" : ""}
                </span>

            </div>
        </div>
    );
};

export default CarouselStep;

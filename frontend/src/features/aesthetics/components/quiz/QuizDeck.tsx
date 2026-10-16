import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import QuizCard from "@/features/aesthetics/components/quiz/QuizCard";
import { useAesthetics } from "@/features/aesthetics/store/useAesthetics";

export type QuizDeckHandles = {
	like: () => void;
	dislike: () => void;
	undo: () => void;
};

type QuizDeckProps = {
	className?: string;
	cardWidth?: number;
	cardHeight?: number;
};

const SWIPE_THRESHOLD = 50;

const QuizDeck = forwardRef<QuizDeckHandles, QuizDeckProps>(
	({ className, cardWidth: providedCardWidth, cardHeight: providedCardHeight }, ref) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const touchStartX = useRef<number | null>(null);

		const [containerWidth, setContainerWidth] = useState<number>(
			typeof window === "undefined" ? 0 : window.innerWidth
		);
		const [isMobile, setIsMobile] = useState<boolean>(
			typeof window === "undefined" ? false : window.innerWidth < 640
		);

		// Store state
		const aesthetics = useAesthetics((s) => s.aesthetics);
		const currentIndex = useAesthetics((s) => s.currentIndex);
		const leftStack = useAesthetics((s) => s.leftStack);
		const rightStack = useAesthetics((s) => s.rightStack);
		const like = useAesthetics((s) => s.like);
		const dislike = useAesthetics((s) => s.dislike);
		const undo = useAesthetics((s) => s.undo);

		const totalCount = aesthetics.length;
		const isComplete = totalCount > 0 && currentIndex >= totalCount;

		// Handle resize - matching AestheticsCarousel exactly
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

		// Responsive card dimensions - matching AestheticsCarousel exactly
		const responsiveCardWidth = Math.min(
			(providedCardWidth ?? 260) * 0.8,
			containerWidth * 0.75
		);
		const responsiveHeight = (providedCardHeight ?? 320) * 0.6;

		// Card positions - matching AestheticsCarousel exactly
		const getCenterLeft = () => (containerWidth - responsiveCardWidth) / 2;
		const getLeftStack = () => -responsiveCardWidth * (isMobile ? 0.8 : 0.75);
		const getRightStack = () => containerWidth - responsiveCardWidth * (isMobile ? 0.2 : 0.25);

		// Expose imperative handles
		useImperativeHandle(
			ref,
			() => ({
				like,
				dislike,
				undo,
			}),
			[like, dislike, undo]
		);

		// Touch handlers - matching AestheticsCarousel exactly
		const handleTouchStart = (e: React.TouchEvent) => {
			touchStartX.current = e.touches[0].clientX;
		};

		const handleTouchEnd = (e: React.TouchEvent) => {
			if (touchStartX.current === null || currentIndex >= aesthetics.length) return;

			const deltaX = e.changedTouches[0].clientX - touchStartX.current;

			if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
				if (deltaX > 0) {
					like();
				} else {
					dislike();
				}
			}
			touchStartX.current = null;
		};

		const springTransition = { type: "spring", stiffness: 300, damping: 30 };

		return (
			<div
				ref={containerRef}
				className={cn("relative w-full max-w-full overflow-hidden", className)}
				style={{ width: "100%", maxWidth: "100%" }}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<div className="relative w-full" style={{ height: responsiveHeight }}>
					{/* Left stack (disliked) */}
					{leftStack.map((idx) =>
						aesthetics[idx] ? (
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
								animate={{
									left: getLeftStack(),
									opacity: 0.7,
									scale: isMobile ? 0.88 : 0.92,
								}}
								transition={springTransition}
							>
								<div className="h-full w-full">
									<QuizCard aesthetic={aesthetics[idx]} index={idx} totalCount={totalCount} />
								</div>
							</motion.div>
						) : null
					)}

					{/* Center card */}
					{!isComplete &&
						!leftStack.includes(currentIndex) &&
						!rightStack.includes(currentIndex) &&
						aesthetics[currentIndex] ? (
						<motion.div
							key={`center-${currentIndex}`}
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
							transition={springTransition}
						>
							<div className="h-full w-full">
								<QuizCard
									aesthetic={aesthetics[currentIndex]}
									index={currentIndex}
									totalCount={totalCount}
								/>
							</div>
						</motion.div>
					) : null}

					{/* Right stack (liked) */}
					{rightStack.map((idx) =>
						aesthetics[idx] ? (
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
								animate={{
									left: getRightStack(),
									opacity: 0.7,
									scale: isMobile ? 0.88 : 0.92,
								}}
								transition={springTransition}
							>
								<div className="h-full w-full">
									<QuizCard aesthetic={aesthetics[idx]} index={idx} totalCount={totalCount} />
								</div>
							</motion.div>
						) : null
					)}
				</div>
			</div>
		);
	}
);

QuizDeck.displayName = "QuizDeck";

export default QuizDeck;

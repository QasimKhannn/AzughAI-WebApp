import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsDownIcon, ThumbsUpIcon, Undo } from "lucide-react";
import BackgroundLayout from "@/layout/backgrounds/BackgroundLayout";
import { cn } from "@/lib/utils";
import QuizDeck, { type QuizDeckHandles } from "@/features/aesthetics/components/quiz/QuizDeck";
import { useAesthetics } from "@/features/aesthetics/store/useAesthetics";
import type { Aesthetic } from "@/features/aesthetics/types";
import {Button} from "@/components/ui/button";
import { X } from "lucide-react";

const CARD_ASPECT_RATIO = 0.55;

// Separate component for buttons to isolate re-renders
type QuizButtonsProps = {
	deckRef: React.RefObject<QuizDeckHandles | null>;
	darkButtons: boolean;
};

const QuizButtons = memo(({ deckRef, darkButtons }: QuizButtonsProps) => {
	// Only subscribe to what's needed for button visibility
	const currentIndex = useAesthetics((s) => s.currentIndex);
	const totalCount = useAesthetics((s) => s.aesthetics.length);
	const isComplete = totalCount > 0 && currentIndex >= totalCount;

	const handleUndo = () => deckRef.current?.undo();
	const handleDislike = () => deckRef.current?.dislike();
	const handleLike = () => deckRef.current?.like();

	return (
		<div className="flex w-full flex-col items-center justify-center mt-6 sm:mt-8 min-h-[80px]">
			{!isComplete && (
				<div className="flex w-full justify-center px-4">
					<button
						type="button"
						className={cn(
							"mr-2 flex h-12 w-12 items-center justify-center rounded-full border bg-transparent p-2 transition-all sm:h-14 sm:w-14",
							darkButtons ? "border-black" : "border-white"
						)}
						onClick={handleDislike}
						aria-label="Dislike aesthetic"
					>
						<ThumbsDownIcon
							className={cn("h-6 w-6", darkButtons ? "text-black" : "text-white")}
							strokeWidth={1.5}
						/>
					</button>
					<button
						type="button"
						className={cn(
							"flex h-12 w-12 items-center justify-center rounded-full border bg-transparent p-2 transition-all sm:h-14 sm:w-14",
							darkButtons ? "border-black" : "border-white"
						)}
						onClick={handleUndo}
						aria-label="Undo selection"
					>
						<Undo className={cn("h-6 w-6", darkButtons ? "text-black" : "text-white")} strokeWidth={1.5} />
					</button>
					<button
						type="button"
						className={cn(
							"ml-2 flex h-12 w-12 items-center justify-center rounded-full border bg-transparent p-2 transition-all sm:h-14 sm:w-14",
							darkButtons ? "border-black" : "border-white"
						)}
						onClick={handleLike}
						aria-label="Like aesthetic"
					>
						<ThumbsUpIcon
							className={cn("h-6 w-6", darkButtons ? "text-black" : "text-white")}
							strokeWidth={1.5}
						/>
					</button>
				</div>
			)}
			<span
				className={cn(
					"mt-2 flex min-h-[28px] w-full items-center justify-center px-4 text-center text-sm font-light tracking-[0.2em] md:hidden",
					darkButtons ? "text-black" : "text-white"
				)}
			>
				{isComplete ? "" : "swipe left or right"}
			</span>
			<span
				className={cn(
					"mt-2 hidden min-h-[28px] w-full items-center justify-center px-4 text-center text-base font-light md:flex",
					darkButtons ? "text-black" : "text-white"
				)}
			>
				{isComplete ? "" : "click dislike or like"}
			</span>
		</div>
	);
});

QuizButtons.displayName = "QuizButtons";

// Separate component to handle completion logic without causing parent re-renders
type CompletionHandlerProps = {
	open: boolean;
	onComplete?: (payload: { liked: Aesthetic[]; disliked: Aesthetic[] }) => void;
	onClose: () => void;
};

const CompletionHandler = ({ open, onComplete, onClose }: CompletionHandlerProps) => {
	const currentIndex = useAesthetics((s) => s.currentIndex);
	const totalCount = useAesthetics((s) => s.aesthetics.length);
	const liked = useAesthetics((s) => s.liked);
	const disliked = useAesthetics((s) => s.disliked);

	const isComplete = totalCount > 0 && currentIndex >= totalCount;

	useEffect(() => {
		if (!isComplete || !open) return;
		const timeout = setTimeout(() => {
			onComplete?.({ liked, disliked });
			onClose();
		}, 320);
		return () => clearTimeout(timeout);
	}, [isComplete, liked, disliked, onClose, onComplete, open]);

	return null;
};

type QuizModalProps = {
	open: boolean;
	onClose: () => void;
	aesthetics: Aesthetic[];
	showBackground?: boolean;
	darkButtons?: boolean;
	className?: string;
	onComplete?: (payload: { liked: Aesthetic[]; disliked: Aesthetic[] }) => void;
};

const QuizModal = ({
	open,
	onClose,
	aesthetics,
	showBackground = true,
	darkButtons = false,
	className,
	onComplete,
}: QuizModalProps) => {
	const deckRef = useRef<QuizDeckHandles>(null);

	// Only get actions - these don't change and won't cause re-renders
	const setAesthetics = useAesthetics((s) => s.setAesthetics);
	const reset = useAesthetics((s) => s.reset);

	// Viewport sizing
	const [viewportWidth, setViewportWidth] = useState(() =>
		typeof window === "undefined" ? 0 : window.innerWidth
	);
	const [viewportHeight, setViewportHeight] = useState(() =>
		typeof window === "undefined" ? 0 : window.innerHeight
	);

	const getViewportHeight = () => {
		if (typeof window === "undefined") return 0;
		const visualHeight = window.visualViewport?.height;
		if (visualHeight) return visualHeight;
		if (typeof document !== "undefined") {
			return document.documentElement?.clientHeight ?? window.innerHeight;
		}
		return window.innerHeight;
	};

	// Initialize store when modal opens, reset when it closes
	useEffect(() => {
		if (open && aesthetics.length > 0) {
			setAesthetics(aesthetics);
		}
		if (!open) {
			reset();
		}
	}, [open, aesthetics, setAesthetics, reset]);

	// Handle viewport resize
	useEffect(() => {
		if (typeof window === "undefined") return;
		const handleResize = () => {
			setViewportWidth(window.innerWidth);
			setViewportHeight(getViewportHeight());
		};
		const handleVisualViewport = () => {
			setViewportHeight(getViewportHeight());
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		window.visualViewport?.addEventListener("resize", handleVisualViewport);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.visualViewport?.removeEventListener("resize", handleVisualViewport);
		};
	}, [open]);

	const computedCardHeight = Math.max(0, Math.floor(viewportHeight * 1.1));
	const computedCardWidth = computedCardHeight > 0
		? Math.floor(computedCardHeight * CARD_ASPECT_RATIO)
		: Math.max(240, Math.floor(viewportWidth * CARD_ASPECT_RATIO));

	const deck = (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 40 }}
			transition={{ duration: 0.25 }}
			className="flex h-full w-full items-center justify-center"
		>
			<div className="flex h-full w-full max-w-[1600px] flex-col items-center justify-start overflow-hidden px-0 pt-[12.5vh]">
				<QuizDeck
					ref={deckRef}
					className="w-full"
					cardWidth={computedCardWidth}
					cardHeight={computedCardHeight}
				/>
				<QuizButtons deckRef={deckRef} darkButtons={darkButtons} />
			</div>
		</motion.div>
	);

	const Wrapper = showBackground
		? ({ children }: { children: ReactNode }) => (
			  <BackgroundLayout className={cn("fixed inset-0 z-40 items-center justify-center h-screen w-screen", className)}>
					<Button
					className="absolute top-6 right-6"
					variant="outline"
					size="icon"
					onClick={onClose}
					aria-label="Close quiz modal"
				>
					<X />
				</Button>
				  {children}
			  </BackgroundLayout>
		  )
		: ({ children }: { children: ReactNode }) => (
			  <div className={cn("fixed inset-0 z-40 flex items-center justify-center bg-white", className)}>
				  {children}
			  </div>
		  );

	return (
		<>
			<CompletionHandler open={open} onComplete={onComplete} onClose={onClose} />
			<AnimatePresence>
				{open && <Wrapper>{deck}</Wrapper>}
			</AnimatePresence>
		</>
	);
};

export default QuizModal;

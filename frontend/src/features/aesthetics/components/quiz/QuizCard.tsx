import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Aesthetic } from "@/features/aesthetics/types";

type QuizCardProps = {
	aesthetic: Aesthetic;
	index: number;
	totalCount?: number;
	className?: string;
};

const FALLBACK_IMAGE = "/assets/fallback.png";

const QuizCard = ({ aesthetic, index, totalCount, className }: QuizCardProps) => {
	const [imageError, setImageError] = useState(false);
	const secondaryText = (aesthetic as { secondLabel?: string }).secondLabel ?? aesthetic.description;

	const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
		if (!imageError) {
			setImageError(true);
			event.currentTarget.src = FALLBACK_IMAGE;
		}
	};

	return (
		<div
			className={cn(
				"relative flex h-full w-full flex-col items-center justify-start overflow-hidden border-[0.5px] bg-white shadow-2xl transition-all",
				className
			)}
			style={{ borderColor: "black" }}
		>
			<div className="flex w-[90%] justify-between py-4">
				<p className="text-left text-sm font-medium lowercase text-black sm:text-base">
					({aesthetic.label?.toLowerCase?.() ?? ""})
				</p>
				<p className="text-left text-sm font-medium text-black sm:text-base">
					{`${(index + 1).toString().padStart(2, "0")}${totalCount ? `/${totalCount}` : ""}`}
				</p>
			</div>
			<div className="h-full w-full overflow-hidden pb-0">
				<img
					src={imageError ? FALLBACK_IMAGE : aesthetic.image}
					alt={aesthetic.label}
					className="h-full w-full object-contain pb-4"
					style={{ minHeight: "100%" }}
					onError={handleImageError}
					loading="eager"
				/>
			</div>
			{secondaryText && (
				<p className="px-4 pb-2 text-left text-sm font-medium text-black sm:text-base">
					{secondaryText}
				</p>
			)}
		</div>
	);
};

export default QuizCard;

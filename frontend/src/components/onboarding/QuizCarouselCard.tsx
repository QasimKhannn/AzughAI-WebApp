import React, { useState } from "react";
import { AESTHETIC_STYLE_OPTIONS } from "@/data/OnboardingData";

type QuizCarouselCardProps = {
    item: any;
    idx: number;
    isActive: boolean;
    carouselStep: number;
};

const QuizCarouselCard: React.FC<QuizCarouselCardProps> = ({ item, idx, isActive, carouselStep }) => {
    const [imageError, setImageError] = useState(false);
    const fallbackImage = "/assets/fallback.png";
    
    // Function to handle image loading errors
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error(`Failed to load image: ${item.image}`);
        setImageError(true);
        e.currentTarget.src = fallbackImage;
    };
    
    return (
        <div
            className="relative w-full h-full bg-white shadow-2xl overflow-hidden transition-all border-[0.5px] flex flex-col items-center justify-start"
            style={{
                borderColor: "black",
                background: "#fff"
            }}
        >
            {/* Overlay with text */}
            <div className="flex w-[90%] py-4 justify-between">
                <p className="text-black text-left font-medium text-sm sm:text-base">
                    ({item.label.toLowerCase()})
                </p>
                <p className="text-black text-left font-medium text-sm sm:text-base">
                    {(idx + 1).toString().padStart(2, '0')}/{AESTHETIC_STYLE_OPTIONS.length}
                </p>
            </div>
            <div className="w-[100%] h-[100%] pb-0 overflow-hidden">
                <img
                    src={imageError ? fallbackImage : item.image}
                    alt={item.label}
                    className="w-full pb-4 h-full object-contain"
                    style={{ minHeight: "100%" }}
                    onError={handleImageError}
                    loading="eager"
                />
            </div>
            {item.secondLabel && (
                <p className="text-black text-left font-medium text-sm sm:text-base px-4 pb-2">
                    {item.secondLabel}
                </p>
            )}
        </div>
    );
};

export default QuizCarouselCard;

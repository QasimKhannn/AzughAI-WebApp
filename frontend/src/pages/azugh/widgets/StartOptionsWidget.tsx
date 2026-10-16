import React from "react";

interface StartOption {
    title: string;
    image: string;
    description: string;
}

interface StartOptionCardProps {
    option: StartOption;
    onClick: (title: string) => void;
}

const StartOptionCard: React.FC<StartOptionCardProps> = ({ option, onClick }) => {
    return (
        <div 
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 flex flex-col h-full max-w-[160px] min-h-[160px] sm:max-w-[200px] sm:min-h-[200px]"
            onClick={() => onClick(option.title)}
        >
            {/* Image Section */}
            <div className="h-12 sm:h-16 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <img
                    src={option.image}
                    alt={option.title}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 font-manrope leading-tight mb-2 line-clamp-2">
                    {option.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 font-manrope leading-relaxed line-clamp-3 flex-1">
                    {option.description}
                </p>
            </div>
        </div>
    );
};

interface StartOptionsWidgetProps {
    onOptionClick: (title: string) => void;
    className?: string;
}

const startOptions: StartOption[] = [
    {
        title: "Instant Outfit",
        image: "/assets/creatives/option_1.png",
        description: "Outfit ideas for any occasion or weather styled for you.",
    },
    {
        title: "Closet Refresh",
        image: "/assets/sub-2.png",
        description: "Remix your closet staples into fresh, effortless looks.",
    },
    {
        title: "Travel Capsule",
        image: "/assets/sub-3.png",
        description: "Pack light and chic curated looks for your destination.",
    },
];

const StartOptionsWidget: React.FC<StartOptionsWidgetProps> = ({ onOptionClick, className = "" }) => {
    return (
        <div className={`w-full px-4 ${className}`}>
            {/* Options Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
                {startOptions.map((option, index) => (
                    <StartOptionCard
                        key={index}
                        option={option}
                        onClick={onOptionClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default StartOptionsWidget;
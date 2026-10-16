import React from "react";

interface StartOption {
    title: string;
    image: string;
    description: string;
    message?: string;
}

interface StartOptionCardProps {
    option: StartOption;
    onClick: (title: string) => void;
}

const StartOptionCard: React.FC<StartOptionCardProps> = ({ option, onClick }) => {
    return (
        <div 
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105 flex flex-col h-full min-h-[100px] xl:max-w-[200px] xl:min-h-[200px]"
            onClick={() => onClick(option.message || option.title)}
        >
            {/* Image Section */}
            <div className="h-20 xl:h-16 bg-gray-100 flex items-center justify-center flex-shrink-0">
                <img
                    src={option.image}
                    alt={option.title}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-sm sm:text-base font-medium text-gray-900 font-manrope leading-tight mb-2 line-clamp-2">
                    {option.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 font-manrope leading-relaxed line-clamp-3 flex-1 font-light">
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
        title: "instant outfit",
        image: "/assets/widgets/instant.jpg",
        description: "I’m looking for new spring jackets, pullovers and...",
        message: "Help me put together an outfit quickly."
    },
    {
        title: "digital closet",
        image: "/assets/widgets/digital.jpg",
        description: "I’m going on a date this evening, pick an outfit from my closet..",
        message: "Help me pick an outfit from my digital closet."
    },
    {
        title: "travel outfit",
        image: "/assets/widgets/travel.jpg",
        description: "I’m traveling soon and,I need help me packing..",
        message: "Help me plan outfits for my trip."
    },
];

const StartOptionsWidget: React.FC<StartOptionsWidgetProps> = ({ onOptionClick, className = "" }) => {
    return (
        <div className={`w-full px-4 ${className}`}>
            {/* Options Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 xl:gap-4 w-full">
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
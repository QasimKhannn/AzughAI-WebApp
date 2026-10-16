import React from "react";

const HairOptions: React.FC<{
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    hairImages: string[];
    optionRows: string[][];
    lastHairOption: string | null;
}> = ({ options, value, onChange, hairImages, optionRows, lastHairOption }) => (
    <div className="w-full flex flex-col items-center justify-center" style={{ minHeight: "min(60vw, 340px)" }}>
        <div
            className="grid grid-cols-3 gap-y-[2vw] gap-x-[2vw] sm:gap-y-3 sm:gap-x-3"
            style={{
                width: "100%",
                maxWidth: 250,
                margin: "0 auto",
            }}
        >
            {optionRows.flat().map((option, idx) => {
                const isSelected = value === option;
                const imageSrc = hairImages[idx];
                const hasImage = !!imageSrc;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`flex flex-col items-center justify-center rounded-full transition
                            ${isSelected ? "scale-105 shadow-lg ring-2 ring-white" : "opacity-90"}
                            focus:outline-none`}
                        style={{
                            width: "18vw",
                            height: "18vw",
                            minWidth: "48px",
                            minHeight: "48px",
                            maxWidth: "88px",
                            maxHeight: "88px",
                            background: hasImage
                                ? `url('${imageSrc}') center/cover no-repeat`
                                : "transparent",
                            backgroundColor: hasImage ? "#DED8D4" : "transparent",
                            border: hasImage ? undefined : "2px solid #fff",
                            padding: "0",
                        }}
                    >
                        {!hasImage && (
                            <span className="text-white text-sm sm:text-base font-semibold text-center px-1 sm:px-2">
                                {option}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
        {lastHairOption && (
            <div className="flex flex-col gap-3 sm:gap-4 mt-3 sm:mt-4 w-full max-w-xs">
                <button
                    key={lastHairOption}
                    type="button"
                    onClick={() => onChange(lastHairOption)}
                    className={`flex items-center w-full h-16 px-3 sm:px-4 md:px-5 py-4 sm:py-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base md:text-lg
                    ${value === lastHairOption
                            ? "bg-[#DED8D4] text-[#4E2B25] border-white font-bold shadow"
                            : "bg-white/10 text-white border-white/10 hover:bg-white/20"}
                    `}
                    aria-pressed={value === lastHairOption}
                >
                    <span
                        className={`flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border mr-3 sm:mr-4 transition-all duration-200
                        ${value === lastHairOption
                                ? "border-black bg-black"
                                : "border-white/60 bg-transparent"}
                    `}
                    >
                        {value === lastHairOption && (
                            <span className="block w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-white" />
                        )}
                    </span>
                    <span
                        className={`text-left transition-all duration-200
                        ${value === lastHairOption
                                ? "text-[#4E2B25]"
                                : "text-white"}
                    `}
                    >
                        {lastHairOption}
                    </span>
                </button>
            </div>
        )}
    </div>
);

export default HairOptions;

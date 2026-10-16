import React from "react";

const HairColorOptions: React.FC<{
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    hairColorColors: string[];
    optionRows: string[][];
}> = ({ options, value, onChange, hairColorColors, optionRows }) => (
    <div className="flex flex-col py-1">
        {optionRows.map((row, rowIdx) => {
            const isSecondRowWithThree = rowIdx === 1 && row.length === 3;
            return (
                <div
                    className={`flex justify-center items-center ${rowIdx !== optionRows.length - 1 ? "mb-[5vw]" : ""}`}
                    key={rowIdx}
                >
                    {row.map((option, colIdx) => {
                        const idx = rowIdx * 4 + colIdx;
                        const isSelected = value === option;
                        const bgColor = hairColorColors[idx] || "#DED8D4";
                        const isLast = colIdx === row.length - 1;
                        // Make text black for second row (rowIdx === 1), else white
                        const labelColor = rowIdx === 1 ? "text-black" : "text-white";
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onChange(option)}
                                className={`flex flex-col items-center justify-center rounded-full transition
                                    ${isSelected ? "scale-105 shadow-lg ring-2 ring-white" : "opacity-90"}
                                    focus:outline-none w-[18vw] h-[18vw] min-w-[48px] min-h-[48px] max-w-[88px] max-h-[88px] p-0
                                    ${!isLast ? "mr-[4vw]" : ""}
                                `}
                                style={{
                                    backgroundColor: bgColor,
                                }}
                            >
                                <span className={`${labelColor} text-xs sm:text-sm font-semibold text-center px-1 sm:px-2`}>
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                    {!isSecondRowWithThree && row.length < 4 &&
                        Array.from({ length: 4 - row.length }).map((_, i) => (
                            <div
                                key={`empty-color-${i}`}
                                className={`w-[18vw] min-w-[48px] max-w-[88px] ${i !== (3 - row.length) ? "mr-[4vw]" : ""}`}
                            />
                        ))}
                </div>
            );
        })}
    </div>
);

export default HairColorOptions;

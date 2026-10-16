import React from "react";

const SkinToneOptions: React.FC<{
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    skinToneColors: string[];
    optionRows: string[][];
}> = ({ options, value, onChange, skinToneColors, optionRows }) => (
    <>
        {optionRows.map((row, rowIdx) => (
            <div
                key={rowIdx}
                className="flex justify-center items-center"
                style={{
                    marginTop: rowIdx === 0 ? 0 : "2vw",
                    marginBottom: rowIdx === optionRows.length - 1 ? 0 : "2vw",
                }}
            >
                {row.map((option, colIdx) => {
                    const idx = rowIdx * 4 + colIdx;
                    const isSelected = value === option;
                    // For "Not sure", transparent bg and line break
                    const isNotSure = option.toLowerCase() === "not sure";
                    const bgColor = isNotSure ? "transparent" : (skinToneColors[idx] || "#DED8D4");
                    // Add line break if two words
                    const displayName =
                        isNotSure
                            ? "Not\nsure"
                            : option.split(" ").length === 2
                                ? option.split(" ").join("\n")
                                : option;
                    // Use white text for second row (rowIdx === 1)
                    const textColor =
                        isNotSure
                            ? "text-white"
                            : rowIdx === 1
                                ? "text-white"
                                : "text-[#292929]";
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
                                backgroundColor: bgColor,
                                padding: "0",
                                marginRight: colIdx !== row.length - 1 ? "2vw" : 0,
                                border: isNotSure ? "1.5px solid #FFF" : undefined,
                            }}
                        >
                            <span
                                className={`text-center font-manrope text-xs sm:text-sm font-semibold ${textColor}`}
                                style={{ whiteSpace: "pre-line" }}
                            >
                                {displayName}
                            </span>
                        </button>
                    );
                })}
                {row.length < 4 &&
                    Array.from({ length: 4 - row.length }).map((_, i) => (
                        <div className="flex-1" key={`empty-skin-${i}`} />
                    ))}
            </div>
        ))}
    </>
);

export default SkinToneOptions;

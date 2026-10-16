import React from "react";

const JewelleryOptions: React.FC<{
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    jewelleryImages: string[];
    optionRows: string[][];
}> = ({ options, value, onChange, jewelleryImages, optionRows }) => (
    <>
        {optionRows.map((row, rowIdx) => {
            if (rowIdx === 2 && row.length === 2) {
                const dontWearIdx = 6;
                const openToAnythingIdx = 7;
                const dontWearSelected = value === options[dontWearIdx];
                const openToAnythingSelected = value === options[openToAnythingIdx];

                return (
                    <div
                        className={`flex justify-center items-center ${rowIdx !== optionRows.length - 1 ? "mb-4 sm:mb-6" : ""}`}
                        key={rowIdx}
                    >
                        <button
                            key={options[dontWearIdx]}
                            type="button"
                            onClick={() => onChange(options[dontWearIdx])}
                            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full transition
                                ${dontWearSelected ? "scale-105 shadow-lg ring-2 ring-white" : "opacity-90"}
                                focus:outline-none mr-4`}
                            style={{
                                background: jewelleryImages[dontWearIdx]
                                    ? `url('${jewelleryImages[dontWearIdx]}') center/cover no-repeat`
                                    : "transparent",
                                border: "2px solid #fff",
                            }}
                        >
                            <span className="text-white text-base font-semibold text-center px-2">
                                {options[dontWearIdx]}
                            </span>
                        </button>
                        <button
                            key={options[openToAnythingIdx]}
                            type="button"
                            onClick={() => onChange(options[openToAnythingIdx])}
                            className={`flex flex-col items-center justify-center h-20 rounded-full transition
                                ${openToAnythingSelected ? "scale-105 shadow-lg ring-2 ring-white" : "opacity-90"}
                                focus:outline-none`}
                            style={{
                                minWidth: 180,
                                background: jewelleryImages[openToAnythingIdx]
                                    ? `url('${jewelleryImages[openToAnythingIdx]}') center/cover no-repeat`
                                    : "transparent",
                            }}
                        >
                            <span className="text-white text-base font-semibold text-center px-2">
                                {options[openToAnythingIdx]}
                            </span>
                        </button>
                    </div>
                );
            }

            return (
                <div
                    className={`flex justify-center items-center ${rowIdx !== optionRows.length - 1 ? "mb-4 sm:mb-6" : ""}`}
                    key={rowIdx}
                >
                    {row.map((option, colIdx) => {
                        const idx = rowIdx * 3 + colIdx;
                        const isSelected = value === option;
                        const imageSrc = jewelleryImages[idx];
                        const hasImage = !!imageSrc;
                        const isLast = colIdx === row.length - 1;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onChange(option)}
                                className={`flex flex-col items-center justify-center w-20 h-20 rounded-full transition
                                    ${isSelected ? "scale-105 shadow-lg ring-2 ring-white" : "opacity-90"}
                                    focus:outline-none ${!isLast ? "mr-4" : ""}`}
                                style={hasImage ? {
                                    background: `url('${imageSrc}') center/cover no-repeat`,
                                    backgroundColor: "#DED8D4",
                                } : {
                                    background: "transparent",
                                    border: "2px solid #fff",
                                }}
                            >
                                <span className="text-white text-base font-semibold text-center px-2">
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                </div>
            );
        })}
    </>
);

export default JewelleryOptions;

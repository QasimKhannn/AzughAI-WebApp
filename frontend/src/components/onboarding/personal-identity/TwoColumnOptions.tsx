import React from "react";

const TwoColumnOptions: React.FC<{
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    optionRows: string[][];
}> = ({ options, value, onChange, optionRows }) => (
    <>
        {optionRows.map((row, rowIdx) => {
            const isLastRow = rowIdx === optionRows.length - 1;
            const isSingle = row.length === 1;
            return (
                <div
                    key={rowIdx}
                    className={`flex gap-[1vw] sm:gap-1 mb-0 justify-center`}
                    style={{
                        marginTop: rowIdx === 0 ? 0 : "1vw",
                        marginBottom: isLastRow ? 0 : "1vw"
                    }}
                >
                    {row.map((option, colIdx) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`flex items-center w-full h-[52px] rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base md:text-lg
                                ${value === option
                                    ? "bg-[#DED8D4] text-[#4E2B25] border-[#F0EDEB] font-bold shadow"
                                    : "bg-white/10 text-white border-white/10 hover:bg-white/20"}
                                ${row.length === 2 && colIdx === 0 ? "mr-[2vw] sm:mr-2" : ""}
                                `}
                            style={isLastRow && isSingle ? { flex: "0 0 100%" } : {}}
                            aria-pressed={value === option}
                        >
                            <span className={`flex ml-3 items-center justify-center w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border mr-[3vw] sm:mr-4 transition-all duration-200
                                ${value === option
                                    ? "border-black bg-black"
                                    : "border-[#F0EDEB] bg-transparent"}`}>
                                {value === option && (
                                    <span className="block w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-white" />
                                )}
                            </span>
                            <p className={`text-left font-manrope text-[16px] font-light transition-all duration-200
                                ${value === option ? "text-[#4E2B25]" : "text-[#F0EDEB]"}`}>
                                {option}
                            </p>
                        </button>
                    ))}
                    {/* Only add empty div if not last row and not single */}
                    {!isLastRow && row.length < 2 && <div className="w-full" />}
                </div>
            );
        })}
    </>
);

export default TwoColumnOptions;

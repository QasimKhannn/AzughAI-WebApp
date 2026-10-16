import React from "react";

const DefaultOptions: React.FC<{
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
}> = ({ options, value, onChange }) => (
    <div className="space-y-[3vw] sm:space-y-3">
        {options.map(opt => (
            <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`flex items-center w-full h-[52px] rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base md:text-lg
                    ${value === opt
                        ? "bg-[#DED8D4] text-[#4E2B25] border-[#F0EDEB] font-bold shadow"
                        : "bg-white/10 text-white border-white/10 hover:bg-white/20"}`}
                aria-pressed={value === opt}
            >
                <span className={`flex ml-3 items-center justify-center w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border mr-[3vw] sm:mr-4 transition-all duration-200
                    ${value === opt
                        ? "border-black bg-black"
                        : "border-[#F0EDEB] bg-transparent"}`}>
                    {value === opt && (
                        <span className="block w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-white" />
                    )}
                </span>
                <p className={`text-left font-manrope text-[16px] font-light transition-all duration-200
                    ${value === opt ? "text-[#4E2B25]" : "text-[#F0EDEB]"}`}>
                    {opt}
                </p>
            </button>
        ))}
    </div>
);

export default DefaultOptions;

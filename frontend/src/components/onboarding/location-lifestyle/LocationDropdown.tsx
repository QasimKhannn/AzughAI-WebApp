import React from "react";

const LOCATION_OPTIONS = [
    { label: "United States", flag: "🇺🇸" },
    { label: "United Kingdom", flag: "🇬🇧" },
    { label: "Canada", flag: "🇨🇦" },
    { label: "Australia", flag: "🇦🇺" },
    { label: "Germany", flag: "🇩🇪" },
    { label: "France", flag: "🇫🇷" },
    { label: "India", flag: "🇮🇳" },
    { label: "Singapore", flag: "🇸🇬" },
    { label: "Other", flag: "🌍" }
];

const LocationDropdown: React.FC<{
    value: string | null;
    onChange: (value: string) => void;
}> = ({ value, onChange }) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!dropdownOpen) return;
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [dropdownOpen]);

    const selectedOption = LOCATION_OPTIONS.find(opt => opt.label === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="flex items-center justify-between w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border bg-white/10 border-white/10 text-white font-medium text-sm sm:text-base transition hover:bg-white/20"
                onClick={() => setDropdownOpen(open => !open)}
                style={{ minHeight: 48 }}
            >
                {selectedOption ? (
                    <>
                        <span className="text-xl sm:text-2xl mr-3">{selectedOption.flag}</span>
                        <span className="flex-1 text-left">{selectedOption.label}</span>
                    </>
                ) : (
                    <span className="flex-1 text-left opacity-60">Select your location</span>
                )}
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
                    <path d="M6 8l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            {dropdownOpen && (
                <div className="absolute z-10 left-0 right-0 mt-2 bg-[#F5F2F0] rounded-xl shadow-lg border border-[#E4DFDC] max-h-56 overflow-y-auto scrollbar-hide">
                    {LOCATION_OPTIONS.map(opt => (
                        <button
                            key={opt.label}
                            type="button"
                            className={`w-full flex items-center px-4 py-3 text-[#4E2B25] hover:bg-[#EDEAE8] transition text-sm sm:text-base ${value === opt.label ? "font-bold" : ""}`}
                            onClick={e => {
                                e.stopPropagation();
                                onChange(opt.label);
                                setDropdownOpen(false);
                            }}
                        >
                            <span className="text-xl sm:text-2xl mr-3">{opt.flag}</span>
                            <span className="flex-1 text-left">{opt.label}</span>
                            {value === opt.label && <span className="text-base">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationDropdown;

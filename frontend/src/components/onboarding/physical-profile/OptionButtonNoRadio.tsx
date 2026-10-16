const OptionButtonNoRadio: React.FC<{
    option: string;
    imgSrc?: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ option, imgSrc, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-between w-full h-16 px-3 sm:px-5 py-3 sm:py-4 rounded-xl border transition font-medium text-sm sm:text-base
            border-white
            ${isSelected
                ? "bg-[#DED8D4] text-[#000] border-[#DED8D4] font-bold shadow"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
        aria-pressed={isSelected}
    >
        <span className="flex-1 text-left">{option}</span>
        {imgSrc && (
            <img
                src={imgSrc}
                alt={option}
                className="w-12 h-12 object-contain ml-4"
                style={isSelected ? { filter: "brightness(0) saturate(100%)" } : undefined}
            />
        )}
    </button>
);

export default OptionButtonNoRadio;
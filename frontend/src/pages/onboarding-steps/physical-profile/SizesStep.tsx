import React from "react";
import CustomDropdown from "@/components/onboarding/physical-profile/CustomDropdown";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { SIZE_OPTIONS } from "@/data/OnboardingData";

const SizesStep: React.FC = () => {
    const [topSize, setTopSize] = React.useState<string | null>(null);
    const [bottomSize, setBottomSize] = React.useState<string | null>(null);
    const [shoeSize, setShoeSize] = React.useState<string | null>(null);
    const [shoeUnit, setShoeUnit] = React.useState<"EU" | "US">("EU");
    const [shoeDropdownOpen, setShoeDropdownOpen] = React.useState(false);
    const [topDropdownOpen, setTopDropdownOpen] = React.useState(false);
    const [bottomDropdownOpen, setBottomDropdownOpen] = React.useState(false);

    const shoeDropdownRef = React.useRef<HTMLDivElement>(null);
    const topDropdownRef = React.useRef<HTMLDivElement>(null);
    const bottomDropdownRef = React.useRef<HTMLDivElement>(null);

    const { goToNext, goToPrev } = useRoutesContext();

    React.useEffect(() => {
        if (!shoeDropdownOpen && !topDropdownOpen && !bottomDropdownOpen) return;
        function handleClick(e: MouseEvent) {
            if (shoeDropdownOpen && shoeDropdownRef.current && !shoeDropdownRef.current.contains(e.target as Node)) {
                setShoeDropdownOpen(false);
            }
            if (topDropdownOpen && topDropdownRef.current && !topDropdownRef.current.contains(e.target as Node)) {
                setTopDropdownOpen(false);
            }
            if (bottomDropdownOpen && bottomDropdownRef.current && !bottomDropdownRef.current.contains(e.target as Node)) {
                setBottomDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [topDropdownOpen, bottomDropdownOpen, shoeDropdownOpen]);

    const handleContinue = () => {
        if (topSize && bottomSize && shoeSize) {
            const sizes = {
                top: topSize,
                bottom: bottomSize,
                shoe: shoeSize,
                shoe_unit: shoeUnit
            };
            localStorage.setItem("sizes", JSON.stringify(sizes));
            goToNext();
        }
    };

    const shoeLabel = shoeSize ? `Shoe Size - ${shoeSize} ${shoeUnit}` : "Shoe Size";
    const topLabel = topSize ? `Top Size - ${topSize}` : "Top Size";
    const bottomLabel = bottomSize ? `Bottom Size - ${bottomSize}` : "Bottom Size";

    return (
        <QuizStepLayout
            bgImage="/assets/physical-mb-bg.png"
            progress={{ current: 3, total: 6 }}
            questionLabel="What sizes should I shop for?"
            onBack={goToPrev}
            onContinue={handleContinue}
        >
            <div className="space-y-[3vw] sm:space-y-3">
                <CustomDropdown
                    label={topLabel}
                    value={topSize}
                    options={SIZE_OPTIONS.TOP}
                    onSelect={setTopSize}
                    isOpen={topDropdownOpen}
                    onToggle={() => setTopDropdownOpen(open => !open)}
                    dropdownRef={topDropdownRef}
                />
                <CustomDropdown
                    label={bottomLabel}
                    value={bottomSize}
                    options={SIZE_OPTIONS.BOTTOM}
                    onSelect={setBottomSize}
                    isOpen={bottomDropdownOpen}
                    onToggle={() => setBottomDropdownOpen(open => !open)}
                    dropdownRef={bottomDropdownRef}
                />
                <CustomDropdown
                    label={shoeLabel}
                    value={shoeSize}
                    options={SIZE_OPTIONS.SHOE}
                    onSelect={setShoeSize}
                    isOpen={shoeDropdownOpen}
                    onToggle={() => setShoeDropdownOpen(open => !open)}
                    dropdownRef={shoeDropdownRef}
                    width="220px"
                    renderOptionExtra={() => (
                        <div className="flex px-2 py-2 border-b border-[#E4DFDC] gap-2 justify-center">
                            {["EU", "US"].map(unit => (
                                <button
                                    key={unit}
                                    type="button"
                                    className={`px-3 py-1 text-sm rounded-full font-semibold transition
                                                    ${shoeUnit === unit
                                            ? "bg-[#4E2B25] text-white"
                                            : "bg-[#E4DFDC] text-[#4E2B25]"
                                        }`}
                                    onClick={e => {
                                        e.stopPropagation();
                                        setShoeUnit(unit as "EU" | "US");
                                    }}
                                >
                                    {unit}
                                </button>
                            ))}
                        </div>
                    )}
                />
            </div>
        </QuizStepLayout>
    );
};

export default SizesStep;

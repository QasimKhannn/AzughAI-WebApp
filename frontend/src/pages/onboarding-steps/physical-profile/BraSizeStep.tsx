import React from "react";
import CustomDropdown from "@/components/onboarding/physical-profile/CustomDropdown";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { BRA_SIZE_OPTIONS } from "@/data/OnboardingData";

const BraSizeStep: React.FC = () => {
    const [braBand, setBraBand] = React.useState<string | null>(null);
    const [braCup, setBraCup] = React.useState<string | null>(null);
    const [bandDropdownOpen, setBandDropdownOpen] = React.useState(false);
    const [cupDropdownOpen, setCupDropdownOpen] = React.useState(false);
    const bandDropdownRef = React.useRef<HTMLDivElement>(null);
    const cupDropdownRef = React.useRef<HTMLDivElement>(null);

    const { goToNext, goToPrev } = useRoutesContext();

    React.useEffect(() => {
        if (!bandDropdownOpen && !cupDropdownOpen) return;
        function handleClick(e: MouseEvent) {
            if (bandDropdownOpen && bandDropdownRef.current && !bandDropdownRef.current.contains(e.target as Node)) {
                setBandDropdownOpen(false);
            }
            if (cupDropdownOpen && cupDropdownRef.current && !cupDropdownRef.current.contains(e.target as Node)) {
                setCupDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [bandDropdownOpen, cupDropdownOpen]);

    const handleContinue = () => {
        if (braBand && braCup) {
            const braSize = {
                band: braBand,
                cup: braCup
            };
            localStorage.setItem("braSize", JSON.stringify(braSize));
            goToNext();
        }
    };

    const canContinue = !!braBand && !!braCup;
    const bandLabel = braBand ? `Band Size (cm) - ${braBand}` : "Band Size (cm)";
    const cupLabel = braCup ? `Cup Size - ${braCup}` : "Cup Size";

    return (
        <QuizStepLayout
            bgImage="/assets/physical-mb-bg.png"
            progress={{ current: 5, total: 6 }}
            questionLabel="Do you know your bra size (EU)?"
            onBack={goToPrev}
            onContinue={handleContinue}
        >
            <div className="space-y-[3vw] sm:space-y-3">
                <CustomDropdown
                    label={bandLabel}
                    value={braBand}
                    options={BRA_SIZE_OPTIONS.BAND}
                    onSelect={setBraBand}
                    isOpen={bandDropdownOpen}
                    onToggle={() => setBandDropdownOpen(open => !open)}
                    dropdownRef={bandDropdownRef}
                />
                <CustomDropdown
                    label={cupLabel}
                    value={braCup}
                    options={BRA_SIZE_OPTIONS.CUP}
                    onSelect={setBraCup}
                    isOpen={cupDropdownOpen}
                    onToggle={() => setCupDropdownOpen(open => !open)}
                    dropdownRef={cupDropdownRef}
                />
            </div>
        </QuizStepLayout>
    );
};

export default BraSizeStep;

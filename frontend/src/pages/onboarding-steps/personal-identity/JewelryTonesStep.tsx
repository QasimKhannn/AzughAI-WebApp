import React from "react";
import JewelleryOptions from "@/components/onboarding/personal-identity/JewelleryOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { JEWELRY_TONES_OPTIONS, JEWELLERY_IMGS } from "@/data/OnboardingData";

const JewelryTonesStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    // Group options: 3 per row, last row: "Don't wear" and "Open to anything"
    const optionRows = [];
    if (JEWELRY_TONES_OPTIONS.length === 8) {
        optionRows.push(JEWELRY_TONES_OPTIONS.slice(0, 3));
        optionRows.push(JEWELRY_TONES_OPTIONS.slice(3, 6));
        optionRows.push(JEWELRY_TONES_OPTIONS.slice(6, 8));
    }

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("jewelryTones", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 9, total: 9 }}
            questionLabel="What jewelry tones do you vibe with?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/person-identity-1.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 py-1 overflow-y-auto max-h-[50vh]">
                <JewelleryOptions
                    options={JEWELRY_TONES_OPTIONS}
                    value={value}
                    onChange={setValue}
                    jewelleryImages={JEWELLERY_IMGS}
                    optionRows={optionRows}
                />
            </div>
        </QuizStepLayout>
    );
};

export default JewelryTonesStep;

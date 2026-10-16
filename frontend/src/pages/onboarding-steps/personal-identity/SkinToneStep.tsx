import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import SkinToneOptions from "@/components/onboarding/personal-identity/SkinToneOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { SKIN_TONE_OPTIONS, SKIN_TONE_COLORS } from "@/data/OnboardingData";

const SkinToneStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    // Group options into rows of 4
    const optionRows = [];
    for (let i = 0; i < SKIN_TONE_OPTIONS.length; i += 4) {
        optionRows.push(SKIN_TONE_OPTIONS.slice(i, i + 4));
    }

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("skinTone", value);
            goToNext();
        }
    };

    return (
                <QuizStepLayout
                    progress={{ current: 6, total: 9 }}
                    questionLabel="What's your skin tone magic?"
                    showBack={true}
                    onBack={goToPrev}
                    onContinue={handleContinue}
                    disabledContinue={!value}
                    bgImage="/assets/person-identity-1.png"
                >
                    <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto py-1 max-h-[50vh]">
                        <SkinToneOptions
                            options={SKIN_TONE_OPTIONS}
                            value={value}
                            onChange={setValue}
                            skinToneColors={SKIN_TONE_COLORS}
                            optionRows={optionRows}
                        />
                    </div>
                </QuizStepLayout>
    );
};

export default SkinToneStep;

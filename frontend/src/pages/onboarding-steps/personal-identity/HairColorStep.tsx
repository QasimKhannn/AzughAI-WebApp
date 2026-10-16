import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import HairColorOptions from "@/components/onboarding/personal-identity/HairColorOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { HAIR_COLOR_OPTIONS, HAIR_COLORS } from "@/data/OnboardingData";

const HairColorStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    // Group options into rows of 4
    const optionRows = [];
    for (let i = 0; i < HAIR_COLOR_OPTIONS.length; i += 4) {
        optionRows.push(HAIR_COLOR_OPTIONS.slice(i, i + 4));
    }

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("hairColor", value);
            goToNext();
        }
    };

    return (
                <QuizStepLayout
                    progress={{ current: 8, total: 9 }}
                    questionLabel="What's your hair color right now?"
                    showBack={true}
                    onBack={goToPrev}
                    onContinue={handleContinue}
                    disabledContinue={!value}
                    bgImage="/assets/person-identity-1.png"
                >
                    <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                        <HairColorOptions
                            options={HAIR_COLOR_OPTIONS}
                            value={value}
                            onChange={setValue}
                            hairColorColors={HAIR_COLORS}
                            optionRows={optionRows}
                        />
                    </div>
                </QuizStepLayout>
    );
};

export default HairColorStep;

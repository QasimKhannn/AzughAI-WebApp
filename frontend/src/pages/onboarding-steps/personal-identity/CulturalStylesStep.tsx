import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { CULTURAL_STYLES_OPTIONS } from "@/data/OnboardingData";

const CulturalStylesStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("culturalStyles", value);
            goToNext();
        }
    };

    return (
                <QuizStepLayout
                    progress={{ current: 5, total: 9 }}
                    questionLabel="Would you love to see styles inspired by your culture?"
                    showBack={true}
                    onBack={goToPrev}
                    onContinue={handleContinue}
                    disabledContinue={!value}
                    bgImage="/assets/person-identity-1.png"
                >
                    <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                        <DefaultOptions
                            options={CULTURAL_STYLES_OPTIONS}
                            value={value}
                            onChange={setValue}
                        />
                    </div>
                </QuizStepLayout>
    );
};

export default CulturalStylesStep;

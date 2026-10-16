import React from "react";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
import { WARDROBE_STRATEGY_OPTIONS } from "@/data/OnboardingData";

const WardrobeStrategyStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("wardrobeStrategy", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 3, total: 3 }}
            questionLabel="What's your wardrobe style strategy?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/location-bg.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                <div className="space-y-[3vw] sm:space-y-3">
                    <DefaultOptions
                        options={WARDROBE_STRATEGY_OPTIONS}
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>
        </QuizStepLayout>
    );
};

export default WardrobeStrategyStep;

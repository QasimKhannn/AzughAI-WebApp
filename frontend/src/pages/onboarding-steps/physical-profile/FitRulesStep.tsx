import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import OptionButtonNoRadio from "@/components/onboarding/physical-profile/OptionButtonNoRadio";
import { FIT_RULES_OPTIONS } from "@/data/OnboardingData";

const FitRulesStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("fitRules", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 6, total: 6 }}
            questionLabel="What fit rules do you live by?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/physical-mb-bg.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                <div className="space-y-[3vw] sm:space-y-3">
                {FIT_RULES_OPTIONS.map((option, i) => (
                    <OptionButtonNoRadio
                    key={option}
                    option={option}
                    // imgSrc={BODY_SHAPE_IMAGES[i]}
                    isSelected={value === option}
                    onClick={() => setValue(option)}
                    />
                ))}
                </div>
            </div>
        </QuizStepLayout>
    );
};

export default FitRulesStep;

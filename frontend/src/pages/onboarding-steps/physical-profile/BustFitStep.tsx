import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
// import QuizStepWrapper from "@/components/onboarding/QuizStepWrapper";
import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { BUST_FIT_OPTIONS } from "@/data/OnboardingData";

const BustFitStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("bustFit", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 4, total: 6 }}
            questionLabel="Want to share your bust fit?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/physical-mb-bg.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                <DefaultOptions
                    options={BUST_FIT_OPTIONS}
                    value={value}
                    onChange={setValue}
                />
            </div>
        </QuizStepLayout>
    );
};

export default BustFitStep;

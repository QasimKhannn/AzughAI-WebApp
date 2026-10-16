import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import TwoColumnOptions from "@/components/onboarding/personal-identity/TwoColumnOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { AGE_GROUP_OPTIONS } from "@/data/OnboardingData";

const AgeGroupStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    // Group options into rows of 2
    const optionRows = [];
    for (let i = 0; i < AGE_GROUP_OPTIONS.length; i += 2) {
        optionRows.push(AGE_GROUP_OPTIONS.slice(i, i + 2));
    }

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("ageGroup", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 2, total: 2 }}
            questionLabel="What's your age group?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/onboarding-bg-mb-quiz.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                <TwoColumnOptions
                    options={AGE_GROUP_OPTIONS}
                    value={value}
                    onChange={setValue}
                    optionRows={optionRows}
                />
            </div>
        </QuizStepLayout>
    );
};

export default AgeGroupStep;

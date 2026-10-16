import React from "react";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
import { BRAND_OPTIONS } from "@/data/OnboardingData";

const BrandStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("brandPreference", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 2, total: 3 }}
            questionLabel="What kind of brands speak to you?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/brand-budget.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                <div className="space-y-[3vw] sm:space-y-3">
                    <DefaultOptions
                        options={BRAND_OPTIONS}
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>
        </QuizStepLayout>
    );
};

export default BrandStep;

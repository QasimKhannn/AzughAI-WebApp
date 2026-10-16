import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { STYLING_VOICE_OPTIONS } from "@/data/OnboardingData";

const StylingVoiceStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("stylingVoice", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 2, total: 9 }}
            questionLabel="How should your styling voice lean?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/person-identity-1.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                <DefaultOptions
                    options={STYLING_VOICE_OPTIONS}
                    value={value}
                    onChange={setValue}
                />
            </div>
        </QuizStepLayout>
    );
};

export default StylingVoiceStep;

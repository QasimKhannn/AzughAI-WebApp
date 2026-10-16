import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import HairOptions from "@/components/onboarding/personal-identity/HairOptions";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { HAIR_TYPE_OPTIONS, HAIR_IMAGES } from "@/data/OnboardingData";

const HairTypeStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    // Group first N-1 options into rows of 3, last option is special
    const optionRows = [];
    for (let i = 0; i < HAIR_TYPE_OPTIONS.length - 1; i += 3) {
        if (i + 3 >= HAIR_TYPE_OPTIONS.length - 1) {
            optionRows.push(HAIR_TYPE_OPTIONS.slice(i, HAIR_TYPE_OPTIONS.length - 1));
            break;
        }
        optionRows.push(HAIR_TYPE_OPTIONS.slice(i, i + 3));
    }
    const lastHairOption = HAIR_TYPE_OPTIONS[HAIR_TYPE_OPTIONS.length - 1];

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("hairType", value);
            goToNext();
        }
    };

    return (
                <QuizStepLayout
                    progress={{ current: 7, total: 9 }}
                    questionLabel="What's your hair right now?"
                    showBack={true}
                    onBack={goToPrev}
                    onContinue={handleContinue}
                    disabledContinue={!value}
                    bgImage="/assets/person-identity-1.png"
                >
                    <div className="flex flex-col py-1 overflow-y-auto max-h-[50vh]">
                        <HairOptions
                            options={HAIR_TYPE_OPTIONS}
                            value={value}
                            onChange={setValue}
                            hairImages={HAIR_IMAGES}
                            optionRows={optionRows}
                            lastHairOption={lastHairOption}
                        />
                    </div>
                </QuizStepLayout>
    );
};

export default HairTypeStep;

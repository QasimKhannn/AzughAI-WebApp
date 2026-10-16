import React from "react";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import OptionButtonNoRadio from "@/components/onboarding/physical-profile/OptionButtonNoRadio";
import { BODY_SHAPE_OPTIONS, BODY_SHAPE_IMAGES } from "@/data/OnboardingData";

const BodyShapeStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("bodyShape", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 2, total: 6 }}
            questionLabel="Which body shapes feel most like you?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/physical-mb-bg.png"
        >
            <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
                <div className="space-y-[3vw] sm:space-y-3">
                    {BODY_SHAPE_OPTIONS.map((option, i) => (
                        <OptionButtonNoRadio
                            key={option}
                            option={option}
                            imgSrc={BODY_SHAPE_IMAGES[i]}
                            isSelected={value === option}
                            onClick={() => setValue(option)}
                        />
                    ))}
                </div>
            </div>
        </QuizStepLayout>
    );
};

export default BodyShapeStep;

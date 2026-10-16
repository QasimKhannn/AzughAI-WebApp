import React from "react";
import OnboardingLayout from "@/layout/OnboardingLayout";
import LocationDropdown from "@/components/onboarding/location-lifestyle/LocationDropdown";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";

const LocationStep: React.FC = () => {
    const [value, setValue] = React.useState<string | null>(null);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (value) {
            localStorage.setItem("location", value);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 1, total: 3 }}
            questionLabel="Where are you based?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={!value}
            bgImage="/assets/location-bg.png"
            childrenClassName="h-[50vh]"
        >
            <LocationDropdown
                value={value}
                onChange={setValue}
            />
        </QuizStepLayout>
    );
};

export default LocationStep;

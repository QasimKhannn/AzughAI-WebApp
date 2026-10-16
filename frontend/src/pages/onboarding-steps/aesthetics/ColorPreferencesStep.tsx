import React from "react";
import CarouselStep from "@/components/onboarding/CarouselStep";
import QuizCarouselCard from "@/components/onboarding/QuizCarouselCard";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { COLOR_PREFERENCE_OPTIONS } from "@/data/OnboardingData";

const ColorPreferencesStep: React.FC = () => {
    const { goToNext, goToPrev } = useRoutesContext();
    const [currentIdx, setCurrentIdx] = React.useState(0);
    const [votes, setVotes] = React.useState<{ [label: string]: "up" | "down" | null }>({});

    const handleNext = (selected: any[]) => {
        const likedColors = selected.map(item => item.label);
        localStorage.setItem("likedColors", JSON.stringify(likedColors));
        goToNext();
    };
    const allCardsSwiped = currentIdx >= COLOR_PREFERENCE_OPTIONS.length;

    return (
        <QuizStepLayout
            bgImage="/assets/asthetics-mb-bg.png"
            progress={{ current: 3, total: 3 }}
            questionLabel="What colors speak to you?"
            childrenClassName="!px-0"
            disabledContinue={!allCardsSwiped}
            onContinue={() => handleNext(COLOR_PREFERENCE_OPTIONS.filter(opt => votes[opt.label] === "up"))}
            onBack={goToPrev}
            hideBottomButtons={!allCardsSwiped}
        >
            <CarouselStep
                items={COLOR_PREFERENCE_OPTIONS}
                onNext={handleNext}
                onBack={goToPrev}
                currentIdx={currentIdx}
                setCurrentIdx={setCurrentIdx}
                votes={votes}
                setVotes={setVotes}
                renderItem={(item, idx, isActive) => (
                    <QuizCarouselCard
                        item={item}
                        idx={idx}
                        isActive={isActive}
                        carouselStep={2}
                    />
                )}
                cardWidth={window.innerWidth < 640 ? Math.min(240, window.innerWidth * 0.75) : 280}
                height={window.innerWidth < 640 ? 350 : 420}
            />
        </QuizStepLayout>
    );
};

export default ColorPreferencesStep;

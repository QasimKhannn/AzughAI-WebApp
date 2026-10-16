import React from "react";
import CarouselStep from "@/components/onboarding/CarouselStep";
import QuizCarouselCard from "@/components/onboarding/QuizCarouselCard";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { STYLE_MOOD_OPTIONS } from "@/data/OnboardingData";

const StyleMoodsStep: React.FC = () => {
    const { goToNext, goToPrev } = useRoutesContext();
    const [currentIdx, setCurrentIdx] = React.useState(0);
    const [votes, setVotes] = React.useState<{ [label: string]: "up" | "down" | null }>({});

    const handleNext = (selected: any[]) => {
        const likedMoods = selected.map(item => item.label);
        localStorage.setItem("likedMoods", JSON.stringify(likedMoods));
        goToNext();
    };

    const allCardsSwiped = currentIdx >= STYLE_MOOD_OPTIONS.length;

    return (
        <QuizStepLayout
            progress={{ current: 2, total: 3 }}
            questionLabel="What moods do you love?"
            bgImage="/assets/asthetics-mb-bg.png"
            childrenClassName="!px-0"
            disabledContinue={!allCardsSwiped}
            onContinue={() => handleNext(STYLE_MOOD_OPTIONS.filter(opt => votes[opt.label] === "up"))}
            onBack={goToPrev}
            hideBottomButtons={!allCardsSwiped}
        >
            <CarouselStep
                items={STYLE_MOOD_OPTIONS}
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
                        carouselStep={1}
                    />
                )}
                cardWidth={window.innerWidth < 640 ? Math.min(240, window.innerWidth * 0.75) : 280}
                height={window.innerWidth < 640 ? 350 : 420}
            />
        </QuizStepLayout>
    );
};

export default StyleMoodsStep;

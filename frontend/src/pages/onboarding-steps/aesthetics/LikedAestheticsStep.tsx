import React from "react";
import CarouselStep from "@/components/onboarding/CarouselStep";
import QuizCarouselCard from "@/components/onboarding/QuizCarouselCard";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { AESTHETIC_STYLE_OPTIONS } from "@/data/OnboardingData";

export interface LikedAestheticsStepProps {
    className?: string;
}

const LikedAestheticsStep: React.FC<LikedAestheticsStepProps> = ({ className }) => {
    const { goToNext, goToPrev } = useRoutesContext();
    const [currentIdx, setCurrentIdx] = React.useState(0);
    const [votes, setVotes] = React.useState<{ [label: string]: "up" | "down" | null }>({});

    const handleNext = (selected: any[]) => {
        const likedAesthetics = selected.map(item => item.label);
        localStorage.setItem("likedAesthetics", JSON.stringify(likedAesthetics));
        goToNext();
    };
    const allCardsSwiped = currentIdx >= AESTHETIC_STYLE_OPTIONS.length;

    return (
        <QuizStepLayout
            bgImage="/assets/asthetics-mb-bg.png"
            progress={{ current: 1, total: 3 }}
            questionLabel="What aesthetics call to you?"
            childrenClassName="!px-0"
            disabledContinue={!allCardsSwiped}
            onContinue={() => handleNext(AESTHETIC_STYLE_OPTIONS.filter(opt => votes[opt.label] === "up"))}
            onBack={goToPrev}
            hideBottomButtons={!allCardsSwiped}
            className={className}
        >
            <CarouselStep
                items={AESTHETIC_STYLE_OPTIONS}
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
                        carouselStep={0}
                    />
                )}
                cardWidth={window.innerWidth < 640 ? Math.min(240, window.innerWidth * 0.75) : 280}
                height={window.innerWidth < 640 ? 350 : 420}
            />
        </QuizStepLayout>
    );
};

export default LikedAestheticsStep;

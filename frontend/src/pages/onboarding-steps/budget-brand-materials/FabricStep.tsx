import React from "react";
import CarouselStep from "@/components/onboarding/CarouselStep";
import FabricCard from "@/components/onboarding/budget-brand-materials/FabricCard";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { FABRIC_OPTIONS } from "@/data/OnboardingData";

const FabricStep: React.FC = () => {
    const { goToNext, goToPrev } = useRoutesContext();
    const [currentIdx, setCurrentIdx] = React.useState(0);
    const [votes, setVotes] = React.useState<{ [label: string]: "up" | "down" | null }>({});

    const handleNext = (selected: any[]) => {
        const likedFabrics = selected.map(item => item.label);
        localStorage.setItem("likedFabrics", JSON.stringify(likedFabrics));
        goToNext();
    };

    const allCardsSwiped = currentIdx >= FABRIC_OPTIONS.length;


    return (
        <QuizStepLayout
            bgImage="/assets/brand-budget.png"
            progress={{ current: 3, total: 3 }}
            questionLabel="What fabrics feel good on you?"
            childrenClassName="!px-0"
            hideBottomButtons={!allCardsSwiped}
            disabledContinue={!allCardsSwiped}
            onContinue={() => handleNext(FABRIC_OPTIONS.filter(opt => votes[opt.label] === "up"))}
            onBack={goToPrev}
        >
            <CarouselStep
                items={FABRIC_OPTIONS}
                onNext={handleNext}
                onBack={goToPrev}
                currentIdx={currentIdx}
                setCurrentIdx={setCurrentIdx}
                votes={votes}
                setVotes={setVotes}
                renderItem={(item, idx, isActive) => (
                    <FabricCard
                        item={item}
                        idx={idx}
                        isLiked={votes[item.label] === "up"}
                    />
                )}
                cardWidth={window.innerWidth < 640 ? Math.min(220, window.innerWidth * 0.75) : 260}
                height={window.innerWidth < 640 ? 300 : 350}
            />
        </QuizStepLayout>
    );
};

export default FabricStep;

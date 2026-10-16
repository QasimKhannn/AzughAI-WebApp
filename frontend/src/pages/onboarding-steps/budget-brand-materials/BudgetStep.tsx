import React from "react";
import BudgetSlider from "@/components/onboarding/budget-brand-materials/BudgetSlider";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { BUDGET_OPTIONS } from "@/data/OnboardingData";

const BudgetStep: React.FC = () => {
    const [selected, setSelected] = React.useState<number>(0);
    const { goToNext, goToPrev } = useRoutesContext();

    const handleContinue = () => {
        if (selected !== null) {
            localStorage.setItem("budgetRange", BUDGET_OPTIONS[selected]);
            goToNext();
        }
    };

    return (
        <QuizStepLayout
            progress={{ current: 1, total: 3 }}
            questionLabel="What's your usual spend per item?"
            showBack={true}
            onBack={goToPrev}
            onContinue={handleContinue}
            disabledContinue={selected === null}
            bgImage="/assets/brand-budget.png"
        >
            <BudgetSlider
                options={BUDGET_OPTIONS}
                selected={selected}
                onChange={setSelected}
            />
        </QuizStepLayout>
    );
};

export default BudgetStep;

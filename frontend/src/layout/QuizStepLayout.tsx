import React from "react";
import QuizProgressBar from "@/components/onboarding/QuizProgressBar";
import NavigationButtons from "@/components/onboarding/physical-profile/NavigationButtons";
import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";

interface QuizStepLayoutProps {
    progress?: { current: number; total: number };
    questionLabel?: string;
    showBack?: boolean;
    onBack?: () => void;
    onContinue?: () => void;
    continueLabel?: string;
    disabledContinue?: boolean;
    children: React.ReactNode;
    bgImage: string;
    childrenClassName?: string;
    hideBottomButtons?: boolean;
    hideProgressBar?: boolean;
    className?: string;
}

const NAV_BUTTONS_HEIGHT = 100; // px

const QuizStepLayout: React.FC<QuizStepLayoutProps> = ({
    progress,
    questionLabel,
    showBack = true,
    onBack,
    onContinue,
    continueLabel = "continue",
    disabledContinue,
    children,
    bgImage,
    childrenClassName,
    hideBottomButtons = false,
    hideProgressBar = false,
    className,
}) => (
    <OnboardingLayout bgImage={'/assets/backgrounds/light_gradient_bg.svg'} className={className}>
        {!hideProgressBar && <QuizProgressBar progress={progress} questionLabel={questionLabel} />}
        <div
            className={`w-full border-box flex flex-col justify-start gap-[3vw] sm:gap-4 py-[4vw] px-4 sm:py-4 overflow-y-auto ${childrenClassName ?? ""}`}        >
            {children}
        </div>
        <div className="w-full mb-1 px-4 !pb-safe fixed bottom-0">
            {!hideBottomButtons && (
                <NavigationButtons
                    onBack={onBack}
                    onContinue={onContinue}
                    disabledContinue={disabledContinue}
                    continueLabel={continueLabel}
                    showBack={showBack}
                />
            )}
        </div>
    </OnboardingLayout>
);

export default QuizStepLayout;

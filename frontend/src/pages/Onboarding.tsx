import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";
import OnboardingPageComp from "../features/onboarding/components/OnboardingPage";

const OnboardingPage = () => {
    return (
        <OnboardingLayout
            hideTopBackButton={true}
            className="flex flex-col items-center min-h-[80dvh] h-[80dvh] max-h-[100dvh] text-white z-10 pt-8 sm:pt-16 pb-8 sm:pb-12 px-3 sm:px-6"
        >
            <OnboardingPageComp />
        </OnboardingLayout>
    );
};

export default OnboardingPage;

import OnboardingTopBar from "@/components/onboarding/TopBar";
import PageLayout from "@/layout/PageLayout";
import React from "react";

interface OnboardingLayoutProps {
    children: React.ReactNode;
    bgImage?: string;
    bgVideo?: string; // Add this prop
    onBack?: () => void;
    hideTopBackButton?: boolean;
    className?: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    children,
    bgImage = "/assets/backgrounds/light_gradient_bg.svg",
    // bgVideo = "/waves-bg.mp4", // Add this prop
    hideTopBackButton = true,
    className,
}) => {
    return (
        <PageLayout bgImage={bgImage} className="">
            {/* Black overlay */}
            <div className="fixed inset-0 bg-black/30 z-0 pointer-events-none" />
            <OnboardingTopBar hideTopBackButton={hideTopBackButton} />
            <div className={`relative z-10 w-full md:w-1/2 h-full flex flex-col items-center overflow-auto ${className ?? ""}`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "calc(100% - 60px)", // Account for header
                }}
            >
                {children}
            </div>
        </PageLayout>
    );
};

export default OnboardingLayout;

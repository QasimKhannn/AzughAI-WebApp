// import OnboardingTopBar from "@/components/onboarding/TopBar";
// import React from "react";
// import PageLayout from "./PageLayout";

// interface OnboardingLayoutProps {
//     children: React.ReactNode;
//     bgImage?: string;
//     onBack?: () => void;
//     hideTopBackButton?: boolean;
//     className?: string;
// }

// const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
//     children,
//     bgImage = "/assets/onboarding-bg-mb-quiz.png",
//     hideTopBackButton = true,
//     className,
// }) => {
//     return (
//         <PageLayout bgImage={bgImage}>
//             {/* Black overlay */}
//             <div className="fixed inset-0 bg-black/30 z-0 pointer-events-none" />
//             <OnboardingTopBar hideTopBackButton={hideTopBackButton} />
//             <div className={`relative z-10 w-full h-full flex flex-col items-center overflow-auto ${className ?? ""}`}
//                 style={{
//                     display: "flex", 
//                     flexDirection: "column",
//                     minHeight: "calc(100% - 60px)", // Account for header
//                 }}
//             >
//                 {children}
//             </div>
//         </PageLayout>
//     );
// };

// export default OnboardingLayout;

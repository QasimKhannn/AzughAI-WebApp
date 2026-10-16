// import React from "react";
// import DefaultOptions from "@/components/onboarding/personal-identity/DefaultOptions";
// import { useRoutesContext } from "@/context/RoutesContext";
// import QuizStepLayout from "@/layout/QuizStepLayout";
// import { GENDER_IDENTITY_OPTIONS } from "@/data/OnboardingData";

// const GenderIdentityStep: React.FC = () => {
//     const [value, setValue] = React.useState<string | null>(null);
//     const { goToNext, goToPrev } = useRoutesContext();

//     const handleContinue = () => {
//         if (value) {
//             // Save to localStorage or context
//             localStorage.setItem("genderIdentity", value);
//             goToNext();
//         }
//     };

//     return (
//         <QuizStepLayout
//             progress={{ current: 1, total: 1 }}
//             questionLabel="How do you identify?"
//             showBack={true}
//             onBack={goToPrev}
//             onContinue={handleContinue}
//             disabledContinue={!value}
//             bgImage="/assets/onboarding-bg-mb-quiz.png"
//         >
//             <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto max-h-[50vh]">
//                 <DefaultOptions
//                     options={GENDER_IDENTITY_OPTIONS}
//                     value={value}
//                     onChange={setValue}
//                 />
//             </div>
//         </QuizStepLayout>
//     );
// };

// export default GenderIdentityStep;

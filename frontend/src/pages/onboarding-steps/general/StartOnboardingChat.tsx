// import { useNavigate } from "react-router-dom";
// import { useRoutesContext } from "@/context/RoutesContext";
// import { motion } from "framer-motion";
// import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";


// const StartChatOnboarding = () => {
//     const navigate = useNavigate();
//     const { goToNext } = useRoutesContext();

//     return (
//         <OnboardingLayout hideTopBackButton>
//             <div className="flex-1 flex flex-col justify-between w-full max-w-lg mx-auto">
//                 <p className="font-manrope font-semibold text-md mt-20 sm:text-lg leading-[1.4] text-[#EFECEA] text-center mb-[20vw] sm:mb-[8vw] px-[4vw] sm:px-[10vw] w-[100%] max-w-2xl mx-auto">
//                     Let’s find your signature style. First, we’ll get to know your fit, your vibe, and what makes you YOU.
//                 </p>
//                 <div className="mt-8 sm:mt-0 justify-center align-center flex flex-col items-center w-full px-2">
//                         <motion.button
//                             type="button"
//                             className={`flex-1 py-3 w-2/3 rounded-full bg-[#DED8D4CC] text-[#292929] font-semibold transition mb-28`}
//                             onClick={goToNext}
//                         >
//                             Start chatting with Azugh
//                         </motion.button>
//                 </div>
//             </div>
//         </OnboardingLayout>
//     );

// }

// export default StartChatOnboarding;
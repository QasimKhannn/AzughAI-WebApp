import { useRoutesContext } from "@/context/RoutesContext";
import { motion } from "framer-motion";
import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";
import MotionText from "@/components/animations/MotionText";


const StartChatOnboarding = () => {
    const { goToNext } = useRoutesContext();

    return (
        <OnboardingLayout hideTopBackButton>
            <div className="flex-1 flex flex-col justify-between w-full max-w-lg mx-auto">
                <p className="font-manrope font-semibold text-md mt-20 sm:text-lg leading-[1.4] text-[#EFECEA] text-center mb-[20vw] sm:mb-[8vw] mx-auto">
                    <MotionText text="Let’s find your signature style. First, we’ll get to know your fit, your vibe, and what makes you YOU."/>
                </p>
                <div className="mt-8 sm:mt-0 justify-center align-center flex flex-col items-center w-full px-2">
                        <motion.button
                            type="button"
                            className={`flex-1 py-3 w-2/3 rounded-full bg-[#DED8D4CC] text-[#292929] font-light transition mb-28`}
                            onClick={goToNext}
                        >
                            start chatting with Azugh
                        </motion.button>
                </div>
            </div>
        </OnboardingLayout>
    );

}

export default StartChatOnboarding;
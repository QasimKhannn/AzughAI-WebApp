import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRoutesContext } from "@/context/RoutesContext";
import MotionText from "@/components/animations/MotionText";

const introText = `Hey love, I’m Azugh, your AI stylist and go-to bestie for everything style & fashion. I’m here to help you shop smarter, plan outfits (yes, even for travel), make the most of your wardrobe, and show up as you, effortlessly.`;

const OnboardingPageComp = () => {
    const { goToNext } = useRoutesContext();

    return (
        <div className="flex-1 flex flex-col justify-between w-full max-w-lg mx-auto">
            <p
                className="text-[#F0EDEB] sm:text-lg w-[65%] sm:w-[60%] md:w-full self-end text-right md:text-center mt-12 mr-0 sm:mr-2 px-1 sm:px-0"
            >
                <MotionText text={introText} />
            </p>
            <motion.div
                className="self-end md:self-center mt-8 sm:mt-0"
                initial={false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Button
                    className="w-24 h-12 mb-28 rounded-full bg-[#DED8D4CC] flex items-center justify-center"
                    style={{ minWidth: "96px" }}
                    onClick={goToNext}
                >
                    <ArrowRight className="text-black" style={{ height: "24px", width: "24px" }} />
                </Button>
            </motion.div>
        </div>
    )
}

export default OnboardingPageComp;
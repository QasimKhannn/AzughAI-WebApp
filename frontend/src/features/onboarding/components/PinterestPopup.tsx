import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRoutesContext } from "@/context/RoutesContext";
import PinterestBox from "@/components/onboarding/PinterestBox";
import OnboardingLayout from "./OnboardingLayout";

const PinterestPopup = () => {
    const [connected, setConnected] = React.useState(false);
    const { goToNext } = useRoutesContext()

    return (
        <OnboardingLayout
        hideTopBackButton={false}
        className="justify-center items-center overflow-hidden">
            <AnimatePresence mode="wait">
                {!connected ? (
                    <motion.div
                        key="connect"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center justify-center w-full"
                    >
                        <PinterestBox
                            showSkip={true}
                            text="Got a Pinterest board? Let me peek at your pins — it's strictly for aesthetic intel, promise. "
                            connectText="connect"
                            connectButtonProps={{
                                onClick: () => {
                                    setConnected(true);
                                    // updateQuizData({ pinterest_connected: true });
                                }
                            }}
                            skipButtonProps={{
                                onClick: () => {
                                    // updateQuizData({ pinterest_connected: false });
                                    goToNext()
                                }
                            }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="synced"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center justify-center w-full"
                    >
                        <PinterestBox
                            showSkip={false}
                            text="We've synced your inspiration to bring you a more personalized and stylish experience."
                            connectText=""
                            connectIcon={ <ArrowRight className="cursor-pointer" style={{height:"20px", width:"20px"}} /> }
                            connectButtonProps={{
                                onClick: goToNext
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </OnboardingLayout>
    );
};

export default PinterestPopup;

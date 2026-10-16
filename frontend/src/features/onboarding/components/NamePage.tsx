import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRoutesContext } from "@/context/RoutesContext";
import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";
import MotionText from "@/components/animations/MotionText";
import StepInput from "@/features/onboarding/components/common/StepInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUpdateUserProfile } from "@/features/auth/hooks/useAuthQueries";

const NamePage: React.FC = () => {
    const [name, setName] = useState("");
    const [showGreet, setShowGreet] = useState(false);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const { goToNext } = useRoutesContext();
    const { user } = useAuth();
    const { mutate: updateUserProfile, isPending } = useUpdateUserProfile();

    // Show greeting after user stops typing for 1s and input is not empty
    useEffect(() => {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        if (!name) {
            setShowGreet(false);
            return;
        }
        typingTimeout.current = setTimeout(() => {
            setShowGreet(true);
        }, 1000);
        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [name]);

    useEffect(() => {
        // if there is a user first name, set it as default name
        if (user?.nickname) {
            setName(user.nickname);
        }
    }, [user]);

    const handleContinue = async () => {
        if (name.trim()) {
            await updateUserProfile({ nickname: name.trim() }, {
                onSuccess: () => {
                    // toast.success("Nickname updated successfully!"); no need to notify as it's part of onboarding
                    goToNext();
                },
                onError: (error) => {
                    console.error("Failed to update user profile:", error);
                    toast.error("Failed to update nickname. Please try again.");
                }
            });
        } else {
            toast.error("Nickname cannot be empty.");
            console.warn("Nickname is empty, cannot continue.");
        }
    };

    return (
        <OnboardingLayout
        hideTopBackButton={false}
         className="flex flex-col items-center min-h-[80dvh] h-[80dvh] max-h-[100dvh] text-white z-10 pt-8 sm:pt-16 pb-8 sm:pb-12 px-3 sm:px-6">
            <div className="flex-1 flex flex-col justify-between w-full max-w-lg mx-auto">
                <p className="text-[#F0EDEB] sm:text-lg w-[65%] sm:w-[60%] md:w-full md:text-center self-end text-right mt-12 mr-0 sm:mr-2 px-1 sm:px-0">
                    <MotionText text="How should I address you? Drop a name, a nickname, or whatever feels most you."/>
                </p>
                <div className="flex flex-col items-center justify-center w-full md:w-full px-2">
                    <StepInput
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={`Call me ${user?.first_name || "by my name"}`}
                        onKeyDown={e => {
                            if (e.key === "Enter" && name) {
                                handleContinue();
                            }
                        }}
                        autoFocus
                        inputMode="text"
                        maxLength={50}
                    />
                    <AnimatePresence>
                        {showGreet && (
                            <motion.p
                                className="mt-3 text-center text-white text-base"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                Nice to meet you, {name} ♡
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
                <motion.div
                    className="self-end md:self-center mt-8 sm:mt-0"
                    initial={false}
                    animate={name ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                >
                    <Button
                        className="w-24 h-12 mb-28 rounded-full bg-[#DED8D4CC] flex items-center justify-center"
                        style={{ minWidth: "96px" }}
                        disabled={!name}
                        onClick={handleContinue}
                    >
                        <ArrowRight className="text-black" style={{ height: "24px", width: "24px" }} />
                    </Button>
                </motion.div>
            </div>
        </OnboardingLayout>
    );
};

export default NamePage;

import React from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NavigationButtons: React.FC<{
    onBack: () => void;
    onContinue: () => void;
    disabled?: boolean;
    continueLabel?: string;
    disabledContinue?: boolean;
    showBack?: boolean;
}> = ({
    onBack,
    onContinue,
    disabled = false,
    continueLabel = "continue",
    showBack = true,
    disabledContinue,
}) => (
        <div className="flex w-full space-x-[4vw] sm:space-x-4 max-w-full md:w-1/2 mx-auto md:mb-10">
            {showBack && (
                <motion.button
                    type="button"
                    className="flex-1 flex justify-center items-center py-3 bg-transparent text-[#DED8D4] font-semibold transition hover:bg-white/20 border-none rounded-full outline-none shadow-none"
                    style={{
                        borderRadius: "50px",
                        border: "1.5px solid #DED8D4",
                        boxShadow: "none",
                    }}
                    onClick={onBack}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <ArrowLeft />
                </motion.button>
            )}
            <motion.button
                type="button"
                className={`flex-1 py-3 rounded-full bg-[#DED8D4CC] text-[#292929] font-light transition
                            ${disabledContinue ? "opacity-60 cursor-not-allowed" : "opacity-100"}`}
                onClick={onContinue}
                disabled={disabledContinue}
                whileTap={{ scale: 0.96 }}
                whileHover={!disabledContinue ? { scale: 1.04 } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {continueLabel}
            </motion.button>
        </div>
    );

export default NavigationButtons;

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingShell from "@/components/animations/LoadingShell";
import BackgroundLayout from "@/layout/backgrounds/BackgroundLayout";
import Logo, {LogoType} from "@/components/logos/Logo";
import { cn } from "@/lib/utils";

const defaultMessages = [
    "Analyzing your style preferences",
    "Interpreting your fashion profile",
    "Understanding your aesthetic direction",
    "Preparing your personalized recommendations",
    "Finalizing your look experience",
];

interface FinishLoaderProps {
    showBackground?: boolean;
    messages?: string[];
    loop?: boolean;
    className?: string;
    messageDelay?: number;
}

const FinishLoader: React.FC<FinishLoaderProps> = ({
    showBackground = true,
    messages = defaultMessages,
    loop = false,
    className = "",
    messageDelay = 2000,
}) => {
    const [index, setIndex] = useState(0);
    const shellProgress = ((index + 1) / messages.length) * 100;

    useEffect(() => {
        if (!loop && index === messages.length - 1) return;

        const timer = setTimeout(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, messageDelay);

        return () => clearTimeout(timer);
    }, [index, loop, messages.length, messageDelay]);

    const content = (
        <div className={cn("flex flex-col items-center justify-center h-screen z-[9999]", className)}>
            {/* LOGO */}
            <Logo type={LogoType.WHITE} width={48} height={48} className="-mt-12" />

            {/* SHELL ANIMATION */}
            <div className="mt-20">
                <LoadingShell
                    height={300}
                    fillColor="#303a2f80"
                    strokeColor="#303A2FB2"
                    bgColor="#303a2f4d"
                    progress={shellProgress}
                />
            </div>

            {/* TYPING MESSAGE */}
            <div className="text-center px-10 -mt-10 min-h-[32px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg lowercase text-white leading-relaxed font-light"
                    >
                        {messages[index]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <BackgroundLayout className="fixed inset-0 w-full h-full z-[9999]">
            <div
                className={cn(
                    "w-screen min-h-screen overflow-hidden",
                    showBackground ? "bg-transparent" : "bg-white"
                )}
            >
                {content}
            </div>
        </BackgroundLayout>
    );
};

export default FinishLoader;

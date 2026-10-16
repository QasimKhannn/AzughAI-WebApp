import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Mic, AudioLines } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceMorphingSVG from "../voice"; // Adjust the import path as necessary

export interface HelpButtonsProps {
    text: string;
    onClick: () => void;
}

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    loading: boolean;
    onSend: (text: string) => void;
    showHelpButton: boolean;
    setShowHelpButton: (val: boolean) => void;
    helpText?: string;
    helpButtons?: HelpButtonsProps[];
    showHelpButtons?: boolean;
    showFinalItemsWidget: boolean;
    isOnboarding?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    input,
    setInput,
    loading,
    onSend,
    showHelpButton = true,
    setShowHelpButton,
    helpButtons = [],
    showHelpButtons = false,
    helpText = "I don’t know where to start...",
    showFinalItemsWidget,
    isOnboarding = false,
}) => {
    const [showVoiceModal, setShowVoiceModal] = useState(false);

    const handleInputSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput(""); // <-- Clear input after send
    };

    return (
        <>
            {/* Voice Modal */}
            <AnimatePresence>
                {showVoiceModal && (
                    <motion.div
                        className="fixed inset-0 z-30 flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Background image from HomePage */}
                        <div className="absolute inset-0 w-full h-full z-0">
                            <img
                                src="/assets/backgrounds/green_bg.png"
                                alt="Background"
                                className="w-full h-full object-cover"
                            />
                            {/* Tiny overlay for background */}
                            <div className="absolute inset-0 bg-black bg-opacity-20" />
                        </div>
                        {/* Centered AI voice image with slight darkening */}
                        <div className="flex flex-1 items-center justify-center z-20 relative">
                            <VoiceMorphingSVG
                                colors={["#ddbe8c", "#d4ac6b", "#b58435", "#946c2b"]}
                                backColor="#735422"
                            
                            />
                        </div>
                        {/* Header remains */}
                        <div className="relative z-20">
                            {/* You may want to import and use your AppHeader here if needed */}
                        </div>
                        {/* Close button at bottom right */}
                        <motion.button
                            className="fixed bottom-8 right-8 z-30 bg-transparent border border-white text-white rounded-full shadow-lg p-3 transition"
                            onClick={() => setShowVoiceModal(false)}
                            aria-label="Close voice modal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
            <div
                className={`fixed left-0 md:left-1/4 right-0 bottom-8 px-3 w-full md:w-1/2 ${showFinalItemsWidget ? 'z-5' : 'z-10'}`}
            >
                {/* {showHelpButton && (
                    <div className="flex justify-center mb-2">
                        <button
                            className="mb-2 px-4 py-2 bg-chat-assistant rounded-full text-gray-800 shadow hover:bg-chat-assistant"
                            onClick={() => {
                                setShowHelpButton(false);
                                onSend(helpText);
                            }}
                        >
                            {helpText}
                        </button>
                    </div>
                )} */}
                {showHelpButtons && helpButtons.length > 0 && (
                    <div className="flex justify-center mb-2 space-x-3">
                        {helpButtons.map((button, index) => (
                            <motion.button
                                key={index}
                                className="mb-2 px-4 py-2 bg-chat-assistant rounded-full font-light text-gray-800 shadow hover:bg-chat-assistant"
                                onClick={button.onClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                {button.text}
                            </motion.button>
                        ))}
                    </div>
                )}
                <form className="w-full" onSubmit={handleInputSend}>
                    <div className="flex items-center bg-white rounded-xl shadow px-3 py-2">
                        <Input
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:border-none shadow-none px-2 py-1 placeholder:text-gray-500"
                            style={{
                                boxShadow: "none",
                            }}
                            placeholder={isOnboarding ? "talk about myself" : "style me for ..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button
                            variant="ghost"
                            type="button"
                            className="ml-2 p-2 w-9 h-9 rounded-full bg-transparent transition"
                            onClick={() => { /* void function */ }}
                            aria-label="Voice input"
                        >
                            <Mic className="text-black" style={{ width: '20px', height: '20px' }} />
                        </Button>
                        {input.trim() === "" ? (
                            <Button
                                type="button"
                                className="ml-2 p-2 w-9 h-9 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] focus:bg-[#303A2FB2] active:bg-[#303A2FB2] focus-visible:ring-0 transition"
                                tabIndex={-1}
                                disabled={loading}
                                aria-label="Voice input"
                                onClick={() => setShowVoiceModal(true)}
                            >
                                {/* <img src="/assets/voice.svg" alt="Voice" className="w-6 h-6" /> */}
                                <AudioLines className="w-6 h-6 text-white"  style={{ width: '20px', height: '20px' }}/>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                className="ml-2 p-2 w-9 h-9 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] focus:bg-[#303A2FB2] active:bg-[#303A2FB2] focus-visible:ring-0 transition"
                                disabled={loading}
                                aria-label="Send"
                                onClick={handleInputSend}
                            >
                                <ArrowUp className="text-white" style={{ width: '22px', height: '22px' }} />
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChatInput;

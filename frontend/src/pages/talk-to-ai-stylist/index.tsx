import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VoiceMorphingSVG from "../azugh/components/voice";
import CarouselStep from "@/components/onboarding/CarouselStep";
import QuizCarouselCard from "@/components/onboarding/QuizCarouselCard";
import PhotoUploadStep from "@/pages/onboarding-steps/physical-profile/PhotoUploadStep";
import QuizStepLayout from "@/layout/QuizStepLayout";
import PinterestBox from "@/components/onboarding/PinterestBox";

// Move aesthetic options to constants since we're removing take-quiz data
const AESTHETIC_STYLE_OPTIONS = [
    { label: "Old Money", image: "/assets/old-money.png" },
    { label: "Pilates Girl", image: "/assets/old-money.png" },
    { label: "Clean Fit", image: "/assets/clean-fit.png" },
    { label: "Street Style", image: "/assets/street-style.png" },
    { label: "Retro Baddie", image: "/assets/old-money.png" },
    { label: "Cottage Core", image: "/assets/cottage-core.png" },
    { label: "Dark Academia", image: "/assets/old-money.png" },
    { label: "Y2K", image: "/assets/y2k.png" },
    { label: "Afro-Futurism", image: "/assets/old-money.png" },
    { label: "Scandi Minimalist", image: "/assets/scandi-minimalist.png" },
    { label: "Glam Rock", image: "/assets/glam-rock.png" },
    { label: "Boho Chic", image: "/assets/boho-chic.png" },
    { label: "Techwear", image: "/assets/teachwear.png" },
    { label: "Genderless Core", image: "/assets/old-money.png" },
    { label: "Artsy Eclectic", image: "/assets/artsy-electic.png" },
    { label: "Quiet Luxury", image: "/assets/old-money.png" }
];

const TalkToAIStylist = () => {
    const navigate = useNavigate();
    const [likedAesthetics, setLikedAesthetics] = React.useState<any[]>([]);
    const [showCarousel, setShowCarousel] = React.useState(false);
    const [showBigVoiceMorph, setShowBigVoiceMorph] = React.useState(false);
    const [showPinterest, setShowPinterest] = React.useState(false);
    const [showUploader, setShowUploader] = React.useState(false);
    const [showStyleButton, setShowStyleButton] = React.useState(false);
    const [pinterestStep, setPinterestStep] = React.useState(0);
    const [currentIdx, setCurrentIdx] = React.useState(0);
    const [votes, setVotes] = React.useState<{ [label: string]: "up" | "down" | null }>({});

    // Timeout refs for cleanup
    const timeoutRefs = React.useRef<NodeJS.Timeout[]>([]);

    // Cleanup function for timeouts
    const clearTimeouts = React.useCallback(() => {
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current = [];
    }, []);

    // Clean up timeouts on unmount
    React.useEffect(() => {
        return () => clearTimeouts();
    }, [clearTimeouts]);

    const handleBack = () => {
        clearTimeouts();
        navigate("/onboarding");
    };

    const handleAestheticsNext = React.useCallback((selected: any[]) => {
        setLikedAesthetics(selected);
        setShowCarousel(false);
        setShowBigVoiceMorph(true);

        const timeout = setTimeout(() => {
            setShowBigVoiceMorph(false);
            setShowPinterest(true);
            setPinterestStep(0);
        }, 5000);
        timeoutRefs.current.push(timeout);
    }, []);

    const handlePinterestConnect = React.useCallback(() => {
        if (pinterestStep === 0) {
            setPinterestStep(1);
        } else {
            setShowPinterest(false);
            setPinterestStep(0);
            setShowBigVoiceMorph(true);

            const timeout = setTimeout(() => {
                setShowBigVoiceMorph(false);
                setShowUploader(true);
            }, 5000);
            timeoutRefs.current.push(timeout);
        }
    }, [pinterestStep]);

    const handlePinterestSkip = React.useCallback(() => {
        setShowPinterest(false);
        setPinterestStep(0);
        setShowBigVoiceMorph(true);

        const timeout = setTimeout(() => {
            setShowBigVoiceMorph(false);
            setShowUploader(true);
        }, 5000);
        timeoutRefs.current.push(timeout);
    }, []);

    const handleUploaderContinue = React.useCallback(() => {
        setShowUploader(false);
        setShowBigVoiceMorph(true);

        const timeout = setTimeout(() => {
            setShowStyleButton(true);
        }, 5000);
        timeoutRefs.current.push(timeout);
    }, []);

    const handleStyleMeNow = React.useCallback(() => {
        clearTimeouts();
        console.log("Style Me Now clicked!", { likedAesthetics });
        // Save preferences to localStorage
        localStorage.setItem("aiStylistPreferences", JSON.stringify({
            likedAesthetics,
            completedAt: new Date().toISOString()
        }));
        // Navigate to main app
        navigate("/home");
    }, [likedAesthetics, clearTimeouts, navigate]);

    // Auto-progress carousel when all cards are swiped
    React.useEffect(() => {
        if (currentIdx >= AESTHETIC_STYLE_OPTIONS.length && showCarousel) {
            const liked = AESTHETIC_STYLE_OPTIONS.filter(opt => votes[opt.label] === "up");

            const timeout = setTimeout(() => {
                handleAestheticsNext(liked);
            }, 5000);
            timeoutRefs.current.push(timeout);
        }
    }, [currentIdx, showCarousel, votes, handleAestheticsNext]);

    // Initial carousel show timer
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowCarousel(true);
        }, 5000);
        timeoutRefs.current.push(timer);

        return () => clearTimeout(timer);
    }, []);

    // Voice morph size calculation with mobile responsiveness
    const getVoiceMorphSize = React.useMemo(() => {
        const isMobile = window.innerWidth < 640;

        if (showCarousel || showPinterest || showUploader) {
            return {
                width: isMobile ? 70 : 95,
                height: isMobile ? 52 : 70
            };
        }
        return {
            width: isMobile ? 280 : 380,
            height: isMobile ? 206 : 278
        };
    }, [showCarousel, showPinterest, showUploader]);

    // Container flex calculation
    const getContainerFlex = React.useMemo(() => {
        if (showCarousel || showPinterest || showUploader) {
            return "0 0 auto";
        }
        return 1;
    }, [showCarousel, showPinterest, showUploader]);

    // Reset Pinterest step when component unmounts or when moving to different phases
    React.useEffect(() => {
        if (!showPinterest) {
            setPinterestStep(0);
        }
    }, [showPinterest]);

    return (
        <QuizStepLayout
            onBack={handleBack}
            bgImage="/assets/asthetics-mb-bg.png"
        >
            <motion.div
                className="flex items-center justify-center w-full"
                animate={{
                    flex: getContainerFlex,
                    paddingTop: getContainerFlex === "0 0 auto" ? 12 : 0,
                    paddingBottom: getContainerFlex === "0 0 auto" ? 6 : 0
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <VoiceMorphingSVG
                    width={getVoiceMorphSize.width}
                    height={getVoiceMorphSize.height}
                />
            </motion.div>

            {/* Aesthetics Carousel */}
            <AnimatePresence mode="wait">
                {showCarousel && (
                    <motion.div
                        className="flex-1 w-full overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <CarouselStep
                            items={AESTHETIC_STYLE_OPTIONS}
                            onNext={handleAestheticsNext}
                            onBack={handleBack}
                            className="h-auto mt-2 sm:mt-6"
                            hideNavigationButtons={true}
                            currentIdx={currentIdx}
                            setCurrentIdx={setCurrentIdx}
                            votes={votes}
                            setVotes={setVotes}
                            renderItem={(item, idx, isActive) => (
                                <QuizCarouselCard
                                    item={item}
                                    idx={idx}
                                    isActive={isActive}
                                    carouselStep={0}
                                />
                            )}
                            cardWidth={window.innerWidth < 640 ? Math.min(240, window.innerWidth * 0.75) : 280}
                            height={window.innerWidth < 640 ? 350 : 420}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pinterest Step */}
            <AnimatePresence mode="wait">
                {showPinterest && (
                    <motion.div
                        key={`pinterest-${pinterestStep}`}
                        className="w-full flex items-center justify-start px-4 sm:px-0"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <div className="flex items-center justify-center w-full max-w-sm">
                            {pinterestStep === 0 ? (
                                <PinterestBox
                                    key="pinterest-step-0"
                                    showSkip={true}
                                    text="Got a Pinterest board? Let me peek at your pins — it's strictly for aesthetic intel, promise."
                                    connectText="Connect"
                                    connectButtonProps={{
                                        onClick: handlePinterestConnect
                                    }}
                                    skipButtonProps={{
                                        onClick: handlePinterestSkip
                                    }}
                                />
                            ) : (
                                <PinterestBox
                                    key="pinterest-step-1"
                                    showSkip={false}
                                    text="Great! Now I can see your style preferences. This will help me give you more personalized recommendations."
                                    connectText="Continue"
                                    connectIcon={<span>→</span>}
                                    connectButtonProps={{
                                        onClick: handlePinterestConnect
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Photo Upload Step - Use our new standalone component */}
            <AnimatePresence mode="wait">
                {showUploader && (
                    <motion.div
                        className="w-full px-2 sm:px-0 mt-10"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <div className="flex items-center justify-center">
                            <PhotoUploadStep />
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleUploaderContinue}
                                className="px-6 py-3 bg-[#DED8D4] text-[#292929] rounded-full font-semibold hover:bg-[#D0C8C4] transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Style Me Now Button */}
            <AnimatePresence>
                {showStyleButton && (
                    <motion.div
                        className="flex justify-center items-center w-full mt-4 sm:mt-8 px-4"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <button
                            onClick={handleStyleMeNow}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-[#DED8D4] text-[#292929] font-bold text-base sm:text-lg rounded-full shadow-lg hover:bg-[#D0C8C4] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#AA9C64] focus:ring-opacity-50 w-full max-w-xs"
                        >
                            Style Me Now
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </QuizStepLayout>
    );
};

export default TalkToAIStylist;

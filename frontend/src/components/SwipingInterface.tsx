import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Heart, X } from "lucide-react"

export interface SwipingElementProps {
    url: string;
}

export interface SwipingInterfaceProps {
    elements: SwipingElementProps[];
    onLike: (index: number) => void;
    onDislike: (index: number) => void;
    showTutorial?: boolean;
    tutorialTitle?: string;
    tutorialDescription?: string;
    onContinue?: () => void;
}

const SwipingElement: React.FC<SwipingElementProps> = ({ url }) => {
    return (
        <Card className="w-full h-full bg-transparent overflow-hidden shadow-lg">
            <CardContent className="p-0 overflow-hidden h-full">
                <img src={url} alt="Swiping Element" className="w-full h-full object-cover" />
            </CardContent>
        </Card>
    );
}

// Tutorial card for swiping interface
const TutorialCard: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    return (
        <Card className="w-full h-full bg-transparent border-azugh-highlight/10 hover:border-azugh-highlight/30 overflow-hidden shadow-lg flex flex-col items-center justify-center text-center">
            <CardContent className="flex flex-col items-center justify-center h-full p-8">
                <CardTitle className="text-2xl font-semibold mb-4 text-azugh-accent">{title}</CardTitle>
                <CardDescription className="mb-6 text-azugh-text">{description}</CardDescription>

                <div className="flex flex-col gap-6 w-full max-w-xs pl-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full border-2 bg-transparent shadow-md flex items-center justify-center">
                            <X className="h-4 w-4 text-azugh-text" />
                        </div>
                        <p className="text-[14px] text-left text-azugh-text">Swipe left or tap to dislike</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full border-2 bg-azugh-accent shadow-md flex items-center justify-center">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-[14px] text-left text-azugh-text">Swipe right or tap to like</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const SwipingInterface: React.FC<SwipingInterfaceProps> = ({
    elements,
    onLike,
    onDislike,
    showTutorial = true,
    tutorialTitle = "How it Works",
    tutorialDescription = "Swipe or tap to find your style",
    onContinue,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<string | null>(null);
    const [exiting, setExiting] = useState(false);
    const [tutorialSeen, setTutorialSeen] = useState(!showTutorial);
    const [showClosingAnimation, setShowClosingAnimation] = useState(false);

    // Check if we still have cards to show
    const canSwipe = (tutorialSeen ? currentIndex < elements.length : true);
    // Check if this is the last card
    const isLastCard = tutorialSeen && currentIndex === elements.length - 1;

    // Handle continuing after all cards are swiped
    // const handleContinue = useCallback(() => {
    //     // You can implement navigation or any action when the user clicks Continue
    //     console.log("Continue clicked after all cards swiped");
    // }, []);

    const handleContinue = useCallback(() => {
        if (onContinue) {
            onContinue();
        }
    }, [onContinue]);

    const handleLike = () => {
        if (!canSwipe || exiting) return;

        if (!tutorialSeen) {
            setTutorialSeen(true);
            return;
        }

        setDirection('right');
        setExiting(true);
        onLike(currentIndex);

        // Reset and move to next card after animation completes
        // setTimeout(() => {
        //     setCurrentIndex(currentIndex + 1);
        //     setDirection(null);
        //     setExiting(false);
        // }, 300);
        // Check if this is the last card
        if (isLastCard) {
            // Begin closing animation after the card exits
            setTimeout(() => {
                setShowClosingAnimation(true);
                setCurrentIndex(currentIndex + 1);
                setDirection(null);
                setExiting(false);
            }, 300);
        } else {
            // Reset and move to next card after animation completes
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setDirection(null);
                setExiting(false);
            }, 300);
        }
    };

    const handleDislike = () => {
        if (!canSwipe || exiting) return;

        if (!tutorialSeen) {
            setTutorialSeen(true);
            return;
        }

        setDirection('left');
        setExiting(true);
        onDislike(currentIndex);

        // Reset and move to next card after animation completes
        // setTimeout(() => {
        //     setCurrentIndex(currentIndex + 1);
        //     setDirection(null);
        //     setExiting(false);
        // }, 300);
        // Check if this is the last card
        if (isLastCard) {
            // Begin closing animation after the card exits
            setTimeout(() => {
                setShowClosingAnimation(true);
                setCurrentIndex(currentIndex + 1);
                setDirection(null);
                setExiting(false);
            }, 300);
        } else {
            // Reset and move to next card after animation completes
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setDirection(null);
                setExiting(false);
            }, 300);
        }
    };

    // Animation variants for the cards
    const cardVariants = {
        enter: { scale: 0.95, opacity: 0, y: 50 },
        center: { scale: 1, opacity: 1, y: 0, rotate: 0, x: 0 },
        exitLeft: {
            x: -300,
            opacity: 0,
            scale: 0.8,
            rotate: -20,
            transition: { duration: 0.3 }
        },
        exitRight: {
            x: 300,
            opacity: 0,
            scale: 0.8,
            rotate: 20,
            transition: { duration: 0.3 }
        },
    };


    const closeSwipingButtonVariants = {
        exit : {
            opacity: 0,
            y: 20,
            transition: { duration: 0.3,
                ease: "easeInOut" 
             }
        }
    }

    const finalMessageTitleVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 1, ease: "easeInOut" }
        },
    }

    const finalMessageDescriptionVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.5, duration: 1, ease: "easeInOut" }
        },
    }

    const continueButtonVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.7, duration: 1, ease: "easeInOut" }
        },
    }


    return (
        <div className="relative w-full h-auto aspect-[9/16] flex flex-col items-center">
            {/* Card stack with animations */}
            <div className="relative w-full h-3/4 mt-0 mb-auto">
                <AnimatePresence>
                    {!tutorialSeen ? (
                        <motion.div
                            key="tutorial"
                            className="absolute inset-0 w-full"
                            initial="enter"
                            animate="center"
                            exit={direction === 'left' ? 'exitLeft' : 'exitRight'}
                            variants={cardVariants}
                        >
                            <TutorialCard title={tutorialTitle} description={tutorialDescription} />
                        </motion.div>
                    ) : canSwipe && (
                        <motion.div
                            key={currentIndex}
                            className="absolute inset-0 w-full"
                            initial="enter"
                            animate="center"
                            exit={direction === 'left' ? 'exitLeft' : 'exitRight'}
                            variants={cardVariants}
                        >
                            <SwipingElement url={elements[currentIndex].url} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Show the next card behind for stack effect */}
                {tutorialSeen && currentIndex + 1 < elements.length && !exiting && (
                    <div className="absolute inset-0 w-full scale-[0.95] -z-10 opacity-70 translate-y-[10px]">
                        <SwipingElement url={elements[currentIndex + 1].url} />
                    </div>
                )}
            </div>

            {/* Controls */}
            <AnimatePresence>
                {!showClosingAnimation && (<motion.div className="flex gap-8 mt-auto mb-14 justify-center"
                    animate={showClosingAnimation ? 'animate' : ''}
                    exit='exit'
                    variants={closeSwipingButtonVariants}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDislike}
                        disabled={!canSwipe || exiting}
                        className="h-16 w-16 rounded-full border-2 bg-transparent  shadow-md hover:bg-azugh-highlight hover:scale-110 transition-all"
                    >
                        <X className="h-10 w-10 text-azugh-text" />
                    </Button>
                    <Button
                        variant="outline"
                        size={showClosingAnimation ? "default" : "icon"}
                        onClick={showClosingAnimation ? handleContinue : handleLike}
                        disabled={!canSwipe || exiting}
                        className="h-16 w-16 rounded-full border-2 bg-azugh-accent shadow-md hover:bg-azugh-accent hover:scale-110 transition-all"
                    >
                        <Heart className="h-10 w-10 text-white" />
                    </Button>
                </motion.div>
            )}
            </AnimatePresence>

            {/* End of deck message */}
            {tutorialSeen && !canSwipe && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.h1
                        className="text-2xl font-semibold text-azugh-accent"
                        initial="initial"
                        animate="animate"
                        variants={finalMessageTitleVariants}
                    >
                        Nice, now I know your style!
                    </motion.h1>
                    <motion.p
                        className="mt-2 text-sm text-azugh-text/50"
                        initial="initial"
                        animate="animate"
                        variants={finalMessageDescriptionVariants}
                    >
                        Click continue to finish the onboarding process
                    </motion.p>
                    <AnimatePresence>
                        {showClosingAnimation && (
                            <motion.div
                                className="flex gap-2 mt-6"
                                initial="initial"
                                animate="animate"
                                variants={continueButtonVariants}
                            >
                                <Button
                                    variant="outline"
                                    onClick={handleContinue}
                                    className="px-4 py-2 bg-azugh-accent text-white rounded-md shadow-md hover:bg-azugh-accent/90 hover:text-white transition-all"
                                >
                                    Continue
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default SwipingInterface;

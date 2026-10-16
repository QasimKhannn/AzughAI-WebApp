import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoiceAgent from '@/components/Agent';
import { config, onboardingAgentSettings } from '@/lib/voice_agent';
import Agent from '@/lib/voice_agent/libs/agent';
import { OnboardingModeCards, VoiceOnboardingMode, TextOnboardingMode, OnboardingUserDetails, OnboardingSkinColor, OnboardingSwipingInterface, OnboardingConnectPinterest } from '@/components/OnboardingCards';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import { UserProfileService } from '@/services/UserProfileService'
import { set } from 'date-fns';
// import { set } from 'date-fns';

// setup the url for retrieving token
// config.sessionEndPoint = import.meta.env.VITE_SESSION_TOKEN_ENDPOINT;
const onboardingAgent = new Agent(onboardingAgentSettings.instructions, onboardingAgentSettings.model, onboardingAgentSettings.voice,);

const OnboardingPage = () => {
    const { mode } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [agentConnected, setAgentConnected] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState<'userDetails' | 'skinColor' | 'connectPinterest' | 'aesthetics'>('userDetails');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [animate, setAnimate] = useState<'fadeIn' | 'fadeOut' | null>(null);

    const handleNavigation = (mode: string) => {
        // fade out animation
        setFadeIn(false);

        setTimeout(() => {
            navigate(`/onboarding/${mode}`);
        }, 1000);
    }

    const controlOnboardingAgent = () => {
        // Check if the agent is already connected
        if (agentConnected) {
            // If connected, stop the connection
            onboardingAgent.stopConnection();
            setAgentConnected(false);
        } else {
            // If not connected, start the connection
            onboardingAgent.init();
            setAgentConnected(true);
        }
    }

    const handleUserDetailsSubmit = () => {
        console.log('Saved user details');
        
        // Start fade out animation
        setAnimate('fadeOut');
        
        // After animation completes, change step and fade in the next component
        setTimeout(() => {
            setOnboardingStep('skinColor');
            setCurrentStepIndex(1);
            setAnimate('fadeIn');
        }, 300);
    }
    
    const handleSkinColorSubmit = (skinColor: string) => {
        console.log('Selected skin color:', skinColor);
        // Here you could navigate to next step or finalize onboarding
        // Start fade out animation
        setAnimate('fadeOut');
        // For now, just log the selection
        setTimeout(() => {
            setOnboardingStep('connectPinterest');
            setCurrentStepIndex(2);
            setAnimate('fadeIn');
        }, 300);
    }

    const handlePinterestSubmit = () => {
        console.log('Connected to Pinterest');
        // Start fade out animation
        setAnimate('fadeOut');
        // After animation completes, change step and fade in the next component
        setTimeout(() => {
            setOnboardingStep('aesthetics');
            setCurrentStepIndex(3);
            setAnimate('fadeIn');
        }, 300);
    }

    const handleStepClick = (stepIndex: number) => {
        // Start fade out animation
        setAnimate('fadeOut');
        // After animation completes, change step and fade in the next component
        setTimeout(() => {
            switch (stepIndex) {
                case 0:
                    setOnboardingStep('userDetails');
                    break;
                case 1:
                    setOnboardingStep('skinColor');
                    break;
                case 2:
                    setOnboardingStep('connectPinterest');
                    break;
                case 3:
                    setOnboardingStep('aesthetics');
                    break;
                default:
                    break;
            }
            setCurrentStepIndex(stepIndex);
            setAnimate('fadeIn');
        }, 300);
    }

    const handleLike = (index: number) => {
        console.log('Liked');
        // Logic for liking the current element
    }
    const handleDislike = (index: number) => {
        console.log('Disliked');
        // Logic for disliking the current element
    }

    useEffect(() => {
        // if it is the choose mode page, the user details are being saved so simulate loading
        if ( mode !== 'voice' && mode !== 'text') {
            setTimeout(() => {
                setIsLoading(false);
                // Trigger fade-in animation after loading completes
                setTimeout(() => {
                    setFadeIn(true);
                }, 100);
            }, 1000);
        }

        if (mode === 'voice') {
            // Initialize the agent connection
            // onboardingAgent.init();
            // setAgentConnected(true);
        }
        
        // When in text mode, automatically start with fade in animation
        if (mode === 'text') {
            setAnimate('fadeIn');
        }
    }, [mode]);

    

    if (mode === 'text') {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-azugh-bg">
                {onboardingStep === 'userDetails' && (
                    <div className={`transition-all duration-300 ${
                        animate === 'fadeIn' ? 'opacity-100 scale-100' : 
                        animate === 'fadeOut' ? 'opacity-0 scale-95' : ''
                    }`}>
                        <OnboardingUserDetails 
                            {...UserProfileService.getInstance().getProfile()} 
                            onClick={handleUserDetailsSubmit}
                        />
                    </div>
                )}
                
                {onboardingStep === 'skinColor' && (
                    <div className={`transition-all duration-300 ${
                        animate === 'fadeIn' ? 'opacity-100 scale-100' : 
                        animate === 'fadeOut' ? 'opacity-0 scale-95' : 'opacity-0 scale-95'
                    }`}>
                        <OnboardingSkinColor
                            selectedSkinColor={UserProfileService.getInstance().getProfile().skinColor}
                            onClick={handleSkinColorSubmit}
                        />
                    </div>
                )}

                {onboardingStep === 'connectPinterest' && (
                    <div className={`transition-all duration-300 ${
                        animate === 'fadeIn' ? 'opacity-100 scale-100' : 
                        animate === 'fadeOut' ? 'opacity-0 scale-95' : 'opacity-0 scale-95'
                    }`}>
                        <OnboardingConnectPinterest onClick={handlePinterestSubmit} />
                    </div>
                )}

                {onboardingStep === 'aesthetics' && (
                    <div className={`transition-all duration-300 w-1/2 ${
                        animate === 'fadeIn' ? 'opacity-100 scale-100' : 
                        animate === 'fadeOut' ? 'opacity-0 scale-95' : 'opacity-0 scale-95'
                    }`}>
                        <OnboardingSwipingInterface onLike={handleLike} onDislike={handleDislike}/>
                    </div>
                )}
                
                {/* Progress bar */}
                <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center">
                    <OnboardingProgressBar 
                        currentStep={currentStepIndex}
                        steps={['User Details', 'Skin Color', 'Connect Pinterest', 'Aesthetics']}
                        onStepClick={handleStepClick}
                    />
                </div>
            </div>
        )
    } 

    else if (mode === 'voice') {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-azugh-bg">
                <VoiceAgent className='mb-8 h-32' onClick={controlOnboardingAgent}/>
            </div>
        )
    }
    
    else {
        console.log('Onboarding mode:', mode);
        // return the onboarding mode selection
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-azugh-bg">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-azugh-accent border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-azugh-accent font-manrope">Loading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center max-w-4xl w-full px-4">
                        <div 
                            className={`flex items-center justify-center mb-16 mt-10 border-none transition-all duration-1000 ease-in-out ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <h1 className="text-3xl md:text-4xl font-manrope text-azugh-accent tracking-wide text-center leading-relaxed">
                                Ready to style?
                            </h1>
                        </div>
                        <div 
                            className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full transition-all duration-1000 delay-300 ease-out ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        >
                            <OnboardingModeCards 
                                {...TextOnboardingMode} 
                                onClick={() => handleNavigation('text')} 
                                className='md:mr-2 transform transition-all duration-500'
                                delay={0} 
                            />
                            <OnboardingModeCards 
                                {...VoiceOnboardingMode} 
                                onClick={() => handleNavigation('voice')} 
                                className='md:ml-2 transform transition-all duration-500'
                                delay={200}
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default OnboardingPage;
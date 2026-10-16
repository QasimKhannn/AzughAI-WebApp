import Logo, {LogoType} from '@/components/logos/Logo';
import { config, onboardingAgentSettings } from '@/lib/voice_agent';
import Agent from '@/lib/voice_agent/libs/agent';
import { OnboardingUserDetails } from '@/components/OnboardingCards';
import { useEffect, useState } from 'react';
import { UserProfile, UserProfileService } from '@/services/UserProfileService';
import { set } from 'date-fns';

// setup the url for retrieving token
config.sessionEndPoint = import.meta.env.VITE_SESSION_TOKEN_ENDPOINT;
const onboardingAgent = new Agent(onboardingAgentSettings.instructions, onboardingAgentSettings.model, onboardingAgentSettings.voice,);


// this is the voice agetnt component
// it is composed by a sign only logo that is animated according to the voice agent state
// it is used in the voice agent page

interface VoiceAgentProps {
    logoType?: LogoType;
    className?: string;
    alt?: string;
    onClick?: () => void;
}


const VoiceAgent: React.FC<VoiceAgentProps> = ({ logoType = LogoType.SIGN_BRIGHT, className = 'h-12', alt = 'Azugh Logo', onClick }) => {
    const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [state, setState] = useState<'waiting' | 'speaking' | 'listening'>(onboardingAgent.state);

    // for testing purposes set up a click function to change the state
    const handleClick = () => {
        if (state === 'waiting') {
            setState('listening');
        } else if (state === 'speaking') {
            setState('listening');
        } else {
            setState('waiting');
        }
    };
    // test displaying user details
    // const handleClick = () => {
    //     console.log('Displaying user details');
    //     const storedUserDetails = UserProfileService.getInstance().getProfile();
    //     setUserDetails(storedUserDetails);
    //     setShowDetails(true);
    // }

    useEffect(() => {
        const handleDisplayUserDetails = (event: Event) => {
            const customEvent = event as CustomEvent<UserProfile>;
            setUserDetails(customEvent.detail);
            setShowDetails(true);
        };

        // Handle agent state changes
        const handleAgentStateChange = (event: Event) => {
            const customEvent = event as CustomEvent<{state: 'waiting' | 'speaking' | 'listening'}>;
            setState(customEvent.detail.state);
        };

        document.addEventListener('displayUserDetails', handleDisplayUserDetails);
        document.addEventListener('agentStateChanged', handleAgentStateChange);

        // Initial state sync
        setState(onboardingAgent.state);

        return () => {
            document.removeEventListener('displayUserDetails', handleDisplayUserDetails);
            document.removeEventListener('agentStateChanged', handleAgentStateChange);
        };
    }, []);

    const getAnimationClass = () => {
        switch (state) {
            case 'speaking':
                return 'animate-agent-speaking';
            case 'listening':
                return 'animate-agent-listening';
            case 'waiting':
                return 'animate-agent-waiting';
            default:
                return '';
        }
    };

    const handleConfirmDetails = () => {
        setShowDetails(false);
        // Add any additional logic for when user confirms details
    };

    return (
        <div className='flex flex-col items-center justify-center w-auto h-auto'>
            <div 
                className={`flex items-center justify-center ${getAnimationClass()} ${className} 
                rounded-3xl bg-azugh-highlight aspect-square p-4 hover:cursor-pointer ease-in-out
                ${showDetails ? 'transfrom translate-y-8' : ''}`} 
                onClick={onClick}
            >
                <Logo type={logoType} alt={alt} className={`w-auto h-full`} />
            </div>
            <div className="flex flex-col items-center justify-center w-auto h-auto mt-2 overflow-hidden">
                {showDetails && userDetails && (
                    <div 
                        className="mt-2 w-full max-w-md opacity-0 animate-fadeIn"
                        style={{
                            animation: 'fadeIn 0.5s ease-in-out forwards',
                            animationDelay: '0.2s'
                        }}
                    >
                        <OnboardingUserDetails
                            name={userDetails.name}
                            gender={userDetails.gender}
                            age={userDetails.age}
                            spending={userDetails.spending}
                            title="Your Details"
                            description="Please confirm your information"
                            hideHeader={true}
                            onClick={handleConfirmDetails}
                            className="transform transition-all duration-500"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
export default VoiceAgent;
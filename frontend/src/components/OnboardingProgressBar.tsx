import React from 'react';

interface OnboardingProgressBarProps {
    currentStep: number;
    steps: string[];
    className?: string;
    onStepClick?: (stepIndex: number) => void;
}

const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
    currentStep,
    steps,
    className = "",
    onStepClick
}) => {
    return (
        <div className={`fixed bottom-12 left-0 right-0 flex justify-center ${className}`}>
            <div className="flex items-center space-x-1">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        {/* Step Indicator */}
                        <div 
                            className={`
                                flex items-center justify-center 
                                w-2 h-2 rounded-full
                                transition-all duration-300
                                ${index === currentStep 
                                    ? 'bg-azugh-text cursor-default w-4 h-4' 
                                    : index < currentStep 
                                        ? 'bg-azugh-accent cursor-pointer hover:opacity-80' 
                                        : 'bg-azugh-text/50 cursor-pointer hover:opacity-80'
                                }
                                ${index <= currentStep ? 'scale-110' : 'scale-100'}
                            `}
                            onClick={() => {
                                if (index !== currentStep && onStepClick) {
                                    onStepClick(index);
                                }
                            }}
                            title={step}
                        >
                            {/* Check mark for completed steps */}
                            {index < currentStep && (
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-2 w-2" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                            )}
                        </div>
                        
                        {/* Connecting Line */}
                        {index < steps.length - 1 && (
                            <div 
                                className={`
                                    h-[2px] w-12 
                                    transition-all duration-300
                                    ${index < currentStep 
                                        ? 'bg-azugh-accent' 
                                        : 'bg-transparent'
                                    }
                                `}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default OnboardingProgressBar;
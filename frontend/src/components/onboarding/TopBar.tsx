import { useRoutesContext } from "@/context/RoutesContext";

const OnboardingTopBar = ({
    hideTopBackButton,
    logo = "/assets/logo.svg",
}: {
    hideTopBackButton?: boolean;
    logo?: string;
}) => {
    const { goToPrev } = useRoutesContext();
    return (
        <div className="w-full flex items-center justify-between px-4 pt-safe mt-4 md:mt-20 md:px-20 h-20 sm:h-20 relative z-20">
            {!hideTopBackButton && (
                <button
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-white bg-transparent hover:bg-white/10 transition"
                    onClick={goToPrev}
                    type="button"
                    aria-label="Go back"
                    style={{ zIndex: 30 }}
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                        <path d="M18 22L10 14L18 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}
            <div className="flex-1 flex justify-center">
                <img src={logo} alt="Azugh Logo" className="h-full sm:h-full object-contain" />
            </div>
            {/* Spacer to keep logo centered when back button is visible */}
            {!hideTopBackButton ? <div className="w-12 h-12" /> : <div className="w-0 h-0" />}
        </div>
    );
};

export default OnboardingTopBar;
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

interface PinterestBoxProps {
    showSkip?: boolean;
    text?: React.ReactNode;
    connectText?: React.ReactNode;
    connectIcon?: React.ReactNode;
    connectButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    skipButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    topIcon?: React.ReactNode; // New prop for custom icon/image at the top
}

const PinterestBox: React.FC<PinterestBoxProps> = ({
    showSkip = true,
    text = "Got a Pinterest board? Let me peek at your pins — it’s strictly for aesthetic intel, promise.",
    connectText = "connect",
    connectIcon,
    connectButtonProps,
    skipButtonProps,
    topIcon,
}) => (
    <div className="relative bg-[#F0EDEB] rounded-2xl shadow-lg p-4 sm:p-6 max-w-xs sm:max-w-md w-full flex flex-col items-center mx-2 sm:mx-4">
        {/* Top Icon - overlap half outside the box */}
        <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 z-10">
            {topIcon ? (
                <div className="flex items-center justify-center w-16 h-16">
                    {topIcon}
                </div>
            ) : (
                <img
                    src="/assets/pinterest.svg"
                    alt="Pinterest"
                    className="w-16 h-16"
                />
            )}
        </div>
        {/* Add padding top to make space for the overlapping icon */}
        <div className="pt-5 w-full flex flex-col items-center mb-2" />
        <p className="text-[#292929] text-center text-md mb-6 font-manrope">
            {text}
        </p>
        <Button
            className="rounded-full flex items-center justify-center gap-3 bg-[#303A2FB2] text-[#F0EDEB] font-light font-manrope text-base h-12 w-32"
            {...connectButtonProps}
        >
            {connectIcon}
            {connectText}
        </Button>
        {showSkip && (
            <Button
                className="mt-1 font-manrope text-[#4F4F4F] font-light bg-transparent border-none shadow-none text-base"
                {...skipButtonProps}
            >
                skip
            </Button>
        )}
    </div>
);

export default PinterestBox;

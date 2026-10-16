import React from 'react';
import { cn } from "@/lib/utils"

export enum LogoType {
    DEFAULT = '/assets/logos/logo-black.svg',
    WHITE= '/assets/logos/logo-white.svg',
    ALTERNATIVE = '/logos/logo_dark_alternative.png',
    SIGN = '/logos/logo_dark_sign.png',
    TEXT = '/logos/logo_dark_text.png',
    SIGN_BRIGHT = '/logos/logo_bright_sign.png',
}

interface LogoProps {
    type?: LogoType;
    className?: string;
    width?: number
    height?: number
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ type = LogoType.DEFAULT, className, width, height, onClick }) => {
    return (
        <img
            src={type}
            alt="Azugh Logo"
            className={cn(className, "object-contain")}
            width={width}
            height={height}
            onClick={onClick}
        />
    );
};

export default Logo;
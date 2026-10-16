import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps {
    onClick?: () => void;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    variant?: "primary" | "outline";
    size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    label,
    icon,
    disabled = false,
    className,
    variant = "primary",
    size = "medium",
}) => {
    // Base styles that apply to all buttons
    const baseStyles = "rounded-full font-semibold transition flex justify-center items-center";

    // Variant styles
    const variantStyles = {
        primary: "bg-[#DED8D4CC] text-[#292929]",
        outline: "bg-transparent text-[#DED8D4] border-[1.5px] border-[#DED8D4] hover:bg-white/20",
    };

    // Size styles
    const sizeStyles = {
        small: "py-2 px-4 text-sm",
        medium: "py-3 px-6",
        large: "py-4 px-8 text-lg",
    };

    // State styles
    const stateStyles = disabled ? "opacity-60 cursor-not-allowed" : "opacity-100";

    return (
        <motion.button
            type="button"
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                stateStyles,
                className
            )}
            onClick={onClick}
            disabled={disabled}
            whileTap={!disabled ? { scale: 0.96 } : undefined}
            whileHover={!disabled ? { scale: 1.04 } : undefined}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <span className="flex items-center">
                {label}
                {icon && <span className="ml-2">{icon}</span>}
            </span>
        </motion.button>
    );
};

export default Button;

import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthButtonProps {
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary' | 'google' | 'apple';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  type = 'button',
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  loading = false,
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'w-full bg-white text-gray-900 hover:bg-white/90 font-light py-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 h-12 sm:h-auto text-base ios-tap-highlight-none';
      case 'secondary':
        return 'w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl py-3 font-manrope font-light text-white hover:bg-white/20 transition-all duration-300 shadow-lg h-12 sm:h-auto text-sm sm:text-base ios-tap-highlight-none';
      case 'google':
        return 'w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl py-3 font-manrope font-light text-white hover:bg-white/20 transition-all duration-300 shadow-lg h-12 sm:h-auto text-sm sm:text-base ios-tap-highlight-none';
      case 'apple':
        return 'w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl py-3 font-manrope font-light text-white hover:bg-white/20 transition-all duration-300 shadow-lg h-12 sm:h-auto text-sm sm:text-base ios-tap-highlight-none';
      default:
        return '';
    }
  };

  return (
    <Button
      type={type}
      className={`${getVariantStyles()} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

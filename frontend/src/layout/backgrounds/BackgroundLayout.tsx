import type { ReactNode } from 'react';
import backgroundSvg from '../../assets/backgrounds/background.svg';
import underbackgroundSvg from '../../assets/backgrounds/underbackground.svg';
import { cn } from '@/lib/utils';

interface BackgroundLayoutProps {
  children: ReactNode;
  imagePath?: string;
  className?: string;
}

const BackgroundLayout = ({ children, imagePath="/assets/backgrounds/light_gradient_bg.svg", className="" }: BackgroundLayoutProps) => {
  return (
    <div className={cn("w-screen min-h-screen max-h-screen bg-gradient-to-b from-[#3a412e] to-[#535d42] backdrop-blur-md bg-opacity-80", className)}>
      <div className="absolute inset-0 z-0 top-0 left-0">
        <img 
          src={imagePath} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
      </div>

      <div className="relative z-30 min-h-screen min-w-screen">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;
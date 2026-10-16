import { useState, useEffect } from 'react';
import { ANIMATION_DELAYS } from '@/utils/constants';

interface UseAnimationOptions {
  delay?: number;
  trigger?: boolean;
}

export const useAnimation = ({ 
  delay = ANIMATION_DELAYS.FAST, 
  trigger = true 
}: UseAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, trigger]);

  const resetAnimation = () => setIsVisible(false);

  return { isVisible, resetAnimation };
};

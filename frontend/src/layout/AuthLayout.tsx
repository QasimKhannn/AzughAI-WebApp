import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/layout/PageLayout';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  const isMobile = useIsMobile()
  return (
    <PageLayout
      bgImage={'/assets/backgrounds/light_gradient_bg.svg'}
      className='px-4 md:px-0 flex flex-col items-center min-h-screen justify-center'
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 md:mb-10"
      >
        <h1 className="text-[8vw] md:text-[2.5vw] font-manrope text-white tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="my-2 text-[3.5vw] sm:text-[1.2vw] md:text-[1vw] text-white/80 font-manrope">
            {subtitle}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-black/25 backdrop-blur-md rounded-2xl p-[4vw] sm:p-[3vw] md:p-10 shadow-xl border border-white/20 w-full md:max-w-md md:w-[28rem]"
      >
        {children}
      </motion.div>
    </PageLayout>
  );
};

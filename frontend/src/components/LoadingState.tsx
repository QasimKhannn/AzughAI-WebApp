
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

const loadingMessages = [
  "Styling in progress... grab a matcha.",
  "Curating your look with care...",
  "Finding pieces that speak to your style...",
  "Making fashion effortless for you...",
  "Sifting through thousands of options...",
  "Creating harmony in your wardrobe..."
];

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  const [currentMessage, setCurrentMessage] = React.useState(message || loadingMessages[0]);
  
  React.useEffect(() => {
    if (!message) {
      const intervalId = setInterval(() => {
        setCurrentMessage(prevMessage => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [message]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gradient-moody"></div>
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-24 h-24 rounded-full border-4 border-azugh-highlight mb-8 mx-auto relative"
        >
          <motion.div 
            className="absolute inset-2 rounded-full bg-azugh-highlight/30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </motion.div>
        
        <motion.div
          key={currentMessage} // Key ensures animation reruns when message changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-white font-manrope text-xl md:text-2xl max-w-md mx-auto"
        >
          {currentMessage}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingState;

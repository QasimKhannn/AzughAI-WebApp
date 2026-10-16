import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import  Logo from '@/components/logos/Logo';
import Loader from "@/components/ui/loader";
import VoiceMorphingSVG from '@/components/animations/VoiceAnimation';
import  BackgroundLayout from '@/layout/backgrounds/BackgroundLayout';
import { useVoiceStore } from '../store/voiceStore';
import { useVoice } from '../hooks/useVoice';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS, useGenerateThreadTitleMutation } from '@/features/agent/hooks/useChatQueries';

const VoiceAgentModal = () => {
  const { 
    isVoiceModalOpen, 
    isListening, 
    isPlaying,
    isPaused,
    connectionState,
    setConnectionState,
    error,
    closeVoiceModal, 
    togglePause 
  } = useVoiceStore();

  const { connect, disconnect, interrupt, isConnected } = useVoice();
  const queryClient = useQueryClient();
  const { threadId } = useVoiceStore();
  const [closing, setClosing] = useState(false);
  const generateTitleMutation = useGenerateThreadTitleMutation();

  // Connect when modal opens
  useEffect(() => {
    //console.log("Voice modal open state changed:", { isVoiceModalOpen, connectionState });
    if (isVoiceModalOpen && connectionState === 'connecting') {
      connect();
    }
  }, [isVoiceModalOpen, connectionState, connect]);

  useEffect(() => {
    console.log("Voice Modal State:", {
      isVoiceModalOpen,
      isListening,
      isPlaying,
      isPaused,
      connectionState,
      error,
    });
    // INVESTIGATE FURTHER LATER
    if (isVoiceModalOpen && connectionState === "idle") {
      setConnectionState("connecting");
    }
  }, [isVoiceModalOpen]);

  // Handle close - disconnect first and refresh messages
  const handleClose = async () => {
    setClosing(true);
    await disconnect();
    // Invalidate thread messages to refresh with voice transcripts
    if (threadId) {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.threadMessages(threadId),
      });
      
      // Check if we need to generate a title for this thread
      const currentThreads = queryClient.getQueryData(QUERY_KEYS.threads) as any[];
      const currentThread = currentThreads?.find(t => t.id === threadId);
      
      if (currentThread && (!currentThread.title || currentThread.title === 'New Conversation')) {
        // Generate title for the voice conversation
        generateTitleMutation.mutateAsync(threadId);
      }
    }
    closeVoiceModal();
    setClosing(false);
  };

  // Handle pause/play - interrupt if playing
  const handlePausePlay = () => {
    if (isPlaying) {
      interrupt();
    }
    togglePause();
  };

  // Get status text based on connection state
  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (connectionState === 'connecting') return 'Connecting...';
    if (connectionState === 'error') return 'Connection failed';
    if (isPaused) return 'Paused';
    if (isPlaying) return 'Speaking...';
    return 'Listening...';
  };

  return (
    <AnimatePresence>
      {isVoiceModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50"
        >
          <BackgroundLayout >
            <div className="w-screen min-h-screen bg-transparent overflow-hidden">
              <div className="flex flex-col items-center justify-center h-screen">
                {/* Logo Header */}
                {/* <motion.div 
                  className="flex items-center justify-center mb-12"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Logo width={44} height={44} />
                  <h1 
                    className="text-4xl font-bold text-white ml-2"
                    style={{ fontWeight: 400 }}
                  >
                  </h1>
                </motion.div> */}

                {/* Voice Animation */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                  className="mb-12"
                >
                  {connectionState === 'connecting' || closing ? (
                    <div className="w-[280px] h-[280px] flex flex-col items-center justify-center">
                      <Loader2 className="w-16 h-16 text-[#DED8D4] animate-spin" strokeWidth={1.5}/>
                      <span className="text-[#DED8D4] mt-4 font-light md:text-md">{closing ? "closing..." : "connecting..."}</span>
                    </div>
                  ) : (
                    <VoiceMorphingSVG 
                      //isListening={isListening && !isPaused && isConnected} 
                      //isPlaying={isPlaying} 
                      //size={280}  connectionState === 'connecting' connectionState === 'connecting' || closing
                      status={isPaused ? 'paused' : isPlaying ? 'speaking' : 'listening'}
                    />
                  )}
                </motion.div>

                {/* Status Text */}
                {/* <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className={`text-md font-light mb-8 ${error ? 'text-red-400' : 'text-white'}`}
                >
                  {getStatusText()}
                </motion.p> */}

                {/* Control Buttons */}
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  {/* Pause/Play Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePausePlay}
                    disabled={!isConnected}
                    className="w-16 h-16"
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      <Pause className="w-5 h-5" />
                    )}
                  </Button>

                  {/* Close Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClose}
                    className="w-16 h-16"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </BackgroundLayout>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceAgentModal;

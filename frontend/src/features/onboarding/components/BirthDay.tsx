import React, { useState, useEffect } from "react";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, ArrowLeft } from "lucide-react";
import MotionText from "@/components/animations/MotionText";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUpdateAzughAccount } from "@/features/auth/hooks/useAuthQueries";
import { toast } from "sonner";

const BirthDayStep: React.FC = () => {
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2000, 0));
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showAgeError, setShowAgeError] = useState(false);
  const { goToNext, goToPrev } = useRoutesContext();
  const { azughAccount } = useAuth();
  const { mutate: updateAzughAccount, isPending } = useUpdateAzughAccount();

  // Load existing date of birth from azughAccount
  useEffect(() => {
    if (azughAccount?.date_of_birth) {
      const existingDate = new Date(azughAccount.date_of_birth);
      setBirthday(existingDate);
      setCalendarMonth(existingDate);
    }
  }, [azughAccount]);

  const handleDateSelect = (date: Date | undefined) => {
    setBirthday(date);
    setIsConfirmed(false);
    setShowAgeError(false);
  };

  const handleMonthChange = (month: Date) => {
    setCalendarMonth(month);
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isValidAge = (birthDate: Date) => {
    const age = calculateAge(birthDate);
    return age >= 18;
  };

  const handleConfirm = () => {
    if (birthday && isValidAge(birthday)) {
      const dateOfBirth = birthday.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      updateAzughAccount(
        { date_of_birth: dateOfBirth },
        {
          onSuccess: () => {
            setIsConfirmed(true);
            
            // Auto-proceed after showing confirmation
            setTimeout(() => {
              goToNext();
            }, 1500);
          },
          onError: (error) => {
            console.error("Failed to update date of birth:", error);
            toast.error("Failed to save your birthday. Please try again.");
          }
        }
      );
    }
  };

  const handleContinue = () => {
    if (birthday) {
      const age = calculateAge(birthday);
      if (age < 18) {
        setShowAgeError(true);
        return;
      }
      handleConfirm();
    }
  };

  const handleBackFromError = () => {
    setShowAgeError(false);
  };

  const isValidBirthday = birthday && isValidAge(birthday);

  return (
    <QuizStepLayout
      progress={{ current: 3, total: 3 }}
      questionLabel="When's your birthday?"
      showBack={true}
      onBack={goToPrev}
      onContinue={handleContinue}
      disabledContinue={!birthday || isPending}
      bgImage="/assets/backgrounds/green_bg.png"
      hideBottomButtons={isConfirmed || showAgeError}
    >
      <div className="flex flex-col gap-6 sm:gap-8 max-h-[75vh] px-2">
        <div className="text-center space-y-3">
          <p className="text-white/90 text-base sm:text-lg leading-relaxed font-light">
            <MotionText text="There will be a nice birthday present for you!" />
          </p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!isConfirmed && !showAgeError && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm mx-auto"
              >
                <Calendar
                  mode="single"
                  selected={birthday}
                  onSelect={handleDateSelect}
                  month={calendarMonth}
                  onMonthChange={handleMonthChange}
                  className="w-full"
                  fromYear={1900}
                  toYear={new Date().getFullYear() + 10}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showAgeError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center border border-red-400/30"
                >
                  <AlertCircle className="w-8 h-8 text-red-300" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3 className="text-white text-md font-medium">
                    Age Requirement Not Met
                  </h3>
                  <p className="text-white/80 text-sm">
                    Sorry, you must be at least 18 years old to sign up
                  </p>
                  <p className="text-white/60 text-xs">
                    Please check our terms of service for more information
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleBackFromError}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isConfirmed && birthday && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto bg-[#303A2FB2] rounded-full flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <h3 className="text-white text-lg font-medium">
                    Got it!
                  </h3>
                  <p className="text-white/80 text-sm">
                    Your birthday has been saved
                  </p>
                  <p className="text-white/60 text-xs">
                    Proceeding to next step...
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </QuizStepLayout>
  );
};

export default BirthDayStep;

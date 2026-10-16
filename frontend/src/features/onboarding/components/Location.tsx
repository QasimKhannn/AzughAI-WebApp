import React, { useState, useEffect } from "react";
import { useRoutesContext } from "@/context/RoutesContext";
import QuizStepLayout from "@/layout/QuizStepLayout";
import AddressSearch from "@/features/google/components/AddressSearch";
import { LocationInfo } from "@/features/google/types";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check } from "lucide-react";
import MotionText from "@/components/animations/MotionText";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUpdateAzughAccount } from "@/features/auth/hooks/useAuthQueries";
import { mapCountryNameToCode } from "@/features/auth/utils/countryMapping";
import { toast } from "sonner";

const LocationStep: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { goToNext, goToPrev } = useRoutesContext();
  const { azughAccount } = useAuth();
  const { mutate: updateAzughAccount, isPending } = useUpdateAzughAccount();

  // Load existing location from azughAccount
  useEffect(() => {
    if (azughAccount?.city && azughAccount?.country) {
      setSelectedLocation({
        city: azughAccount.city,
        country: azughAccount.country.name,
        fullAddress: `${azughAccount.city}, ${azughAccount.country.name}`,
        placeId: '' // No place ID for existing data
      });
    }
    console.log("Loaded azughAccount location:", azughAccount);
  }, [azughAccount]);

  const handleLocationSelect = (location: LocationInfo) => {
    setSelectedLocation(location);
    setIsConfirmed(false);
  };

  const handleContinue = async () => {
    if (!selectedLocation) {
      toast.error("Please select your location");
      return;
    }

    const country = mapCountryNameToCode(selectedLocation.country);

    // Update location in backend
    await updateAzughAccount(
      {
        city: selectedLocation.city,
        country: { name: country.name, code: country.code }
      },
      {
        onSuccess: () => {
          setIsConfirmed(true);
          
          // Auto-proceed after showing confirmation
          setTimeout(() => {
            goToNext();
          }, 1500);
        },
        onError: (error) => {
          console.error("Failed to update location:", error);
          toast.error("Failed to save location. Please try again.");
        }
      }
    );
  };

  return (
    <QuizStepLayout
      progress={{ current: 2, total: 3 }}
      questionLabel="Where do you live?"
      showBack={true}
      onBack={goToPrev}
      onContinue={handleContinue}
      disabledContinue={!selectedLocation || isPending}
      bgImage="/assets/backgrounds/green_bg.png"
      hideBottomButtons={isConfirmed}
    >
      <div className="flex flex-col gap-6 sm:gap-8 max-h-[60vh] px-2">
        <div className="text-center space-y-3">
          <p className="text-white/90 text-base sm:text-lg leading-relaxed font-light">
            <MotionText text="Help us find the best fashion options in your area" />
          </p>
        </div>

        <div className="space-y-6">
          <AddressSearch
            onLocationSelect={handleLocationSelect}
            placeholder="Search for your city..."
            className="w-full max-w-md mx-auto"
            disabled={isPending || isConfirmed}
            initialLocation={selectedLocation}
          />

          <AnimatePresence>
            {selectedLocation && !isConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-md mx-auto"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-white/80" />
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">
                      {selectedLocation.city}
                    </div>
                    <div className="text-white/70 text-xs">
                      {selectedLocation.country}
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 text-xs mb-4 text-center">
                  We'll store your city and country for personalized recommendations
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isConfirmed && selectedLocation && (
              <motion.div
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
                    Perfect!
                  </h3>
                  <p className="text-white/80 text-sm">
                    Location set to <span className="font-medium">{selectedLocation.city}, {selectedLocation.country}</span>
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

export default LocationStep;
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type StepRoute = {
  path: string;
  label?: string;
};

interface RoutesContextType {
  steps: StepRoute[];
  currentStepIndex: number;
  goToNext: () => void;
  goToPrev: () => void;
  goToStep: (index: number) => void;
  setStepIndex: (index: number) => void;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider = ({
  children,
  steps = [],
}: {
  children: ReactNode;
  steps?: StepRoute[];
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const idx = steps.findIndex((step) => step.path === location.pathname);
    return idx >= 0 ? idx : 0;
  });

  // Sync index with route changes
  React.useEffect(() => {
    const idx = steps.findIndex((step) => step.path === location.pathname);
    if (idx !== -1 && idx !== currentStepIndex) setCurrentStepIndex(idx);
    // eslint-disable-next-line
  }, [location.pathname]);

  const goToNext = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(steps[currentStepIndex + 1].path);
    }
  };

  const goToPrev = () => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].path);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      navigate(steps[index].path);
    }
  };

  const setStepIndex = (index: number) => setCurrentStepIndex(index);

  return (
    <RoutesContext.Provider
      value={{
        steps,
        currentStepIndex,
        goToNext,
        goToPrev,
        goToStep,
        setStepIndex,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutesContext = () => {
  const ctx = useContext(RoutesContext);
  if (!ctx) throw new Error("useRoutesContext must be used within RoutesProvider");
  return ctx;
};

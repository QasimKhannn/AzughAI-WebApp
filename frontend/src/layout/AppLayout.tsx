import { Header } from "@/layout/header";
import { Outlet } from "react-router-dom";
import { useOnboardingModal } from "@/features/onboarding/store/onboardingStore";
import FinishLoader from "@/components/loading-screens/FinishLoader";
import BackgroundLayout from "./backgrounds/BackgroundLayout";
import React, { ReactNode, useState } from "react";

interface AppLayoutProps {
  children: ReactNode;
}
// Layout with header
const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };
  return (
    <BackgroundLayout>
      <Header
        isMobileMenuOpen={isMobileSidebarOpen}
        onMobileMenuClose={handleMobileSidebarClose}
      />
      <div className="h-[88vh] max-h-[88vh] overflow-y-auto flex-1 min-h-0">{children}</div>
    </BackgroundLayout>
  );
};

export default AppLayout;

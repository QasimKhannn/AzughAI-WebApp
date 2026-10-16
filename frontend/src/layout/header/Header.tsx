import { useNavigate, useLocation } from "react-router-dom";
import { createNavigationItems } from "./data/navigation";
import { DesktopHeader, MobileHeader } from "./components";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export default function Header({
  isMobileMenuOpen,
  onMobileMenuClose,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const useWhiteBackground = location.pathname !== '/chat' && !location.pathname.startsWith('/chat') && location.pathname !== '/';
  const isChatOnboarding = location.pathname === '/chat/onboarding';

  // Create navigation items using the data factory
  const navigationItems = createNavigationItems(
    navigate,
    location.pathname,
    onMobileMenuClose
  );
  return (
    <>
      <DesktopHeader navigationItems={navigationItems} useWhiteBackground={useWhiteBackground} isChatOnboarding={isChatOnboarding} />
      <MobileHeader
        isOpen={isMobileMenuOpen}
        navigationItems={navigationItems}
        onClose={onMobileMenuClose}
        useWhiteBackground={useWhiteBackground}
        isChatOnboarding={isChatOnboarding}
      />
    </>
  );
}

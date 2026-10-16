import AppHeader from "@/components/header";
import { Outlet } from "react-router-dom";
import { useOnboardingModal } from "@/features/onboarding/store/onboardingStore";
import FinishLoader from "@/components/loading-screens/FinishLoader";
import BackgroundLayout from "./backgrounds/BackgroundLayout";

// Layout with header
const MainLayout = () => {
  // const { showFinishLoader, closeFinishLoader, openSummaryPopup } =
  //   useOnboardingModal();

  // const handleLoaderFinished = () => {
  //   closeFinishLoader();
  //   setTimeout(() => {
  //     openSummaryPopup();
  //   }, 100);
  // };

  return (
    <BackgroundLayout>
      <AppHeader />
        <Outlet />
      {/* {showFinishLoader && <FinishLoader onFinished={handleLoaderFinished} />} */}
    </BackgroundLayout>
  );
};

export default MainLayout;

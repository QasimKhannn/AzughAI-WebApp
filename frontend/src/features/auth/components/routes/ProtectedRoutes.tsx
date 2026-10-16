import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from '@/components/loading-screens';
import {ChatScrollLoader} from "@/components/loading-screens";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Ensure minimum display time of 500ms
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || showLoading) {
    return <LoadingScreen showBackground={false} />;
  }

  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated but email not verified, allow only verify-email page
  // if (user && !user.email_verified && location.pathname !== '/auth/verify-email') {
  //   return <Navigate to="/auth/verify-email" replace />;
  // }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
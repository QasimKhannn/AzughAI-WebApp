import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // If authenticated, check if coming from signup and going to onboarding
  if (user) {
    const isFromSignup = location.pathname === "/auth/signup/password"
    
    // Allow access to onboarding if coming from signup
    if (isFromSignup) {
      return <Outlet />;
    }

    console.log("User is authenticated, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // If not authenticated, allow access to public routes
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Otherwise, render the public route (e.g., login)
  return <Outlet />;
};

export default PublicRoute;
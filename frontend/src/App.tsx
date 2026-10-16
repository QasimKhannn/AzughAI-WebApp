import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import AppHeader from "@/components/header";
import NotFound from "./pages/NotFound";
import HomePage, { ChatBotPageInner } from "./pages/home";
import TalkToAIStylist from "./pages/talk-to-ai-stylist";
import Account from "./pages/account/Account.tsx";
import SubscriptionPage from "@/pages/subscription";
import { CartProvider } from "@/features/cart/hooks/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Cart from "./pages/cart";
import { RoutesProvider } from "@/context/RoutesContext";
import { ONBOARDING_STEPS } from "./data/OnboardingData";
import SeasonClosetPage from "./pages/closet/SeasonCloset";
import ConversationsHistoryPage from "./pages/conversations/ConversationsHistory.tsx";
import ConversationsSummaryPage from "./pages/conversations/ConversationsSummary.tsx";
import WishlistPage from "./pages/wishlist/Wishlist.tsx";
import ClosetPage from "./pages/closet/Closet";
import CataloguePage from "./pages/catalogue/Catalogue.tsx";
import UploadClosetItem from "./pages/closet/UploadClosetItem";
import AddClosetManuallyPage from "./pages/closet/AddClosetManually";
import MatchedProductSuccess from "./features/closet/components/MatchedProductSuccess";
import LoginPage from "./pages/auth/SignIn";
import SignupPage from "./pages/auth/Signup";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import VerifyEmailPage from "./pages/auth/VerifyEmail";
import OnboardingPage from "./pages/Onboarding";
import GenderIdentityStep from "./features/onboarding/components/GenderIdentity";
import LocationStep from "./features/onboarding/components/Location";
import PinterestPopup from "./features/onboarding/components/PinterestPopup";
import NamePage from "./features/onboarding/components/NamePage";
import StartChatOnboarding from "./features/onboarding/components/StartChat";
import BirthDayStep from "./features/onboarding/components/BirthDay";
import PublicRoute from "./features/auth/components/routes/PublicRoutes.tsx";
import ProtectedRoute from "./features/auth/components/routes/ProtectedRoutes.tsx";
import ChatPage from "./pages/chat";
import ChatSession from "./pages/chat/[id]";
import MainLayout from "./layout/MainLayout";
import AppLayout from "./layout/AppLayout";


const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <CartProvider>
        <AuthProvider>
          <BrowserRouter>
            {/* For Onboarding Steps */}
            <RoutesProvider steps={ONBOARDING_STEPS}>
              <Routes>
                {/* Public auth routes */}
                <Route element={<PublicRoute />}>
                  <Route
                    path="/auth"
                    element={<Navigate to="/auth/login" replace />}
                  />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/signup" element={<SignupPage />} />
                  <Route path="/auth/signup/:step" element={<SignupPage />} />
                  <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email/:uidb64/:token" element={<VerifyEmailPage />} />
                </Route>

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route
                    path="/onboarding/gender-identity"
                    element={<GenderIdentityStep />}
                  />
                  <Route
                    path="/onboarding/location"
                    element={<LocationStep />}
                  />
                  <Route
                    path="/onboarding/pinterest"
                    element={<PinterestPopup />}
                  />
                  <Route path="/onboarding/name" element={<NamePage />} />
                  <Route
                    path="/onboarding/birthday"
                    element={<BirthDayStep />}
                  />
                  <Route
                    path="/onboarding/start-chat-onboarding"
                    element={<StartChatOnboarding />}
                  />

                  <Route>
                    <Route
                      path="/"
                      element={
                        <AppLayout>
                          <ChatPage />
                        </AppLayout>
                      }
                    />
                    {/* catch all route that are wrong and direct them to chat */}
                    {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
                    {/* Routes with header - protected */}
                    <Route
                      path="/chat"
                      element={
                        <AppLayout>
                          <ChatPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/chat/:id"
                      element={
                        <AppLayout>
                          <ChatSession />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/chat/onboarding"
                      element={
                        <AppLayout>
                          <ChatSession />
                        </AppLayout>
                      }
                    />

                    {/* Conversation routes */}
                    <Route
                      path="/convo-history"
                      element={
                        <AppLayout>
                          <ConversationsHistoryPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/convo-summary/:id"
                      element={
                        <AppLayout>
                          <ConversationsSummaryPage />
                        </AppLayout>
                      }
                    />

                    {/* Route for cart page */}
                    <Route
                      path="/cart"
                      element={
                        <AppLayout>
                          <Cart />
                        </AppLayout>
                      }
                    />
                    {/* Route for wishlist page */}
                    <Route
                      path="/wishlist"
                      element={
                        <AppLayout>
                          <WishlistPage />
                        </AppLayout>
                      }
                    />

                    {/* Closet routes */}
                    <Route
                      path="/closet"
                      element={
                        <AppLayout>
                          <ClosetPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/closet/upload-item"
                      element={
                        <AppLayout>
                          <UploadClosetItem />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/closet/matches"
                      element={
                        <AppLayout>
                          <UploadClosetItem />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/closet/add-manually"
                      element={
                        <AppLayout>
                          <AddClosetManuallyPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/matched-success"
                      element={
                        <AppLayout>
                          <MatchedProductSuccess />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/closet/:season"
                      element={
                        <AppLayout>
                          <SeasonClosetPage />
                        </AppLayout>
                      }
                    />

                    {/* Route for catalogue page */}
                    <Route
                      path="/catalogue"
                      element={
                        <AppLayout>
                          <CataloguePage />
                        </AppLayout>
                      }
                    />

                    {/* Route for account page */}
                    <Route
                      path="/account"
                      element={
                        <AppLayout>
                          <Account />
                        </AppLayout>
                      }
                    />

                    {/* Route for subscription page */}
                    <Route
                      path="/subscription"
                      element={
                        <AppLayout>
                          <SubscriptionPage />
                        </AppLayout>
                      }
                    />
                  </Route>

                  
                  {/* Catch all route - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </RoutesProvider>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </TooltipProvider>
  );
};

export default App;

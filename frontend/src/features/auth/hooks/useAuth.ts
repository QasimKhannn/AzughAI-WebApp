import { useCurrentUser, useAzughAccount, useLogout } from "./useAuthQueries";
//import { useAuthStore } from "../store/useAuthStore";


// Custom hook that combines both sources
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const { data: azughAccount, isLoading: isLoadingAccount, error: accountError } = useAzughAccount();
  const { mutate: logout } = useLogout();
  //const authStore = useAuthStore();
  
  return {
    // Server state
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    logout,

    // AzughAccount state
    azughAccount,
    hasAzughAccount: !!azughAccount,
    isLoadingAccount,
    accountError,
    isAccountReady: !isLoadingAccount && !!azughAccount,

    // Local state
    //user: authStore.user,
    // isAuthenticatedLocal: authStore.isAuthenticated,
    // firstName: authStore.firstName,
    // lastName: authStore.lastName,
    // email: authStore.email,
  };
};

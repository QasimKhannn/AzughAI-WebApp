import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getCurrentUser, 
  loginUser, 
  signupUser, 
  logoutUser,
  checkAccountExists,
  updateUserProfile,
  getAzughAccount,
  createAzughAccount,
  updateAzughAccount,
  verifyEmail,
  resetPassword,
  requestPasswordReset
} from "../api/authServices";
import type { User, AzughAccount } from "../types";

// Get current user
export const useCurrentUser = () => {
  
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['login'],
    mutationFn: loginUser,
    onSuccess: async () => {
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      // Clear user data on error
      queryClient.setQueryData(['user'], null);
    }
  });
};

// Check if account exists
export const useCheckAccountExists = () => {
  return useMutation({
    mutationKey: ['checkAccount'],
    mutationFn: checkAccountExists,
  });
};

// Signup mutation
export const useSignup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['signup'],
    mutationFn: signupUser,
    onSuccess: async () => {
      // Invalidate and refetch user data after signup
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      queryClient.setQueryData(['user'], null);
    }
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear auth state and invalidate user query
      queryClient.removeQueries({ queryKey: ['user'] });
    },
    onError: () => {
      console.error("Logout failed");
    }
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateUserProfile'],
    mutationFn: (updatedData: Partial<User>) => {
      return updateUserProfile(updatedData);
    },
    onSuccess: async (data) => {
      // Update the user query data with the updated profile
      queryClient.setQueryData(['user'], data);
    },
    onError: () => {
      console.error("Update user profile failed");
    }
  });
};

// Get AzughAccount for current user
export const useAzughAccount = () => {
  return useQuery({
    queryKey: ['azughAccount'],
    queryFn: getAzughAccount,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create AzughAccount mutation
export const useCreateAzughAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createAzughAccount'],
    mutationFn: (accountData: Partial<AzughAccount>) => {
      return createAzughAccount(accountData);
    },
    onSuccess: async (data) => {
      // Set the new AzughAccount in cache
      queryClient.setQueryData(['azughAccount'], data);
    },
    onError: (error) => {
      console.error("Create AzughAccount failed:", error);
    }
  });
};

// Update AzughAccount mutation
export const useUpdateAzughAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateAzughAccount'],
    mutationFn: (accountData: Partial<AzughAccount>) => {
      return updateAzughAccount(accountData);
    },
    onSuccess: async (data) => {
      // Update the AzughAccount query data
      queryClient.setQueryData(['azughAccount'], data);
    },
    onError: (error) => {
      console.error("Update AzughAccount failed:", error);
    }
  });
};

// Verify email mutation
export const useVerifyEmail = () => {
  return useMutation({
    mutationKey: ['verifyEmail'],
    mutationFn: ({ uidb64, token }: { uidb64: string; token: string }) => {
      return verifyEmail(uidb64, token);
    }
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: ({ uidb64, token, new_password }: { uidb64: string; token: string; new_password: string }) => {
      return resetPassword(uidb64, token, new_password);
    }
  });
};

// Request password reset mutation
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationKey: ['requestPasswordReset'],
    mutationFn: (email: string) => {
      return requestPasswordReset(email);
    }
  });
};
import { request } from "@/lib/axios";
import type { LoginCredentials, SignupCredentials, LoginResponse, User, AzughAccount } from "../types";

const baseAuthUrl = "/users";

// GET - Get current user profile
export async function getCurrentUser(): Promise<User> {
  const { data } = await request({
    url: `${baseAuthUrl}/profile/`,
    method: "GET"
  });
  return data;
}

// POST - Login with email and password
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await request({
    url: `${baseAuthUrl}/login/`,
    method: "POST",
    data: credentials
  });
  return data;
}

// POST - Register new user
export const checkAccountExists = async (email: string): Promise<{ exists: boolean }> => {
  const response = await fetch('/api/users/check-account-exists/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to check account');
  }

  return response.json();
};

export const signupUser = async (credentials: SignupCredentials) => {
  const response = await fetch('/api/users/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Signup failed');
  }

  return response.json();
};

// POST - Logout
export async function logoutUser(): Promise<{ message: string }> {
  const { data } = await request({
    url: `${baseAuthUrl}/logout/`,
    method: "POST"
  });
  return data;
}

export async function updateUserProfile(updatedData: Partial<User>): Promise<User> {
  const { data } = await request({
    url: `${baseAuthUrl}/profile/`,
    method: "PATCH",
    data: updatedData
  });
  return data;
}

// GET - Get AzughAccount for current user
export async function getAzughAccount(): Promise<AzughAccount> {
  const { data } = await request({
    url: `${baseAuthUrl}/azugh-account/`,
    method: "GET"
  });
  return data;
}

// POST - Create AzughAccount for current user
export async function createAzughAccount(accountData: Partial<AzughAccount>): Promise<AzughAccount> {
  const { data } = await request({
    url: `${baseAuthUrl}/azugh-account/`,
    method: "POST",
    data: accountData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return data;
}

// PATCH - Update AzughAccount for current user
export async function updateAzughAccount(accountData: Partial<AzughAccount>): Promise<AzughAccount> {
  const { data } = await request({
    url: `${baseAuthUrl}/azugh-account/`,
    method: "PATCH",
    data: accountData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return data;
}

// POST - Verify email with token
export async function verifyEmail(uidb64: string, token: string): Promise<{ message: string }> {
  const { data } = await request({
    url: `${baseAuthUrl}/verify-email/`,
    method: "POST",
    data: { uidb64, token }
  });
  return data;
}

// POST - Reset password with token
export async function resetPassword(uidb64: string, token: string, new_password: string): Promise<{ message: string }> {
  const { data } = await request({
    url: `${baseAuthUrl}/reset-password/`,
    method: "POST",
    data: { uidb64, token, new_password }
  });
  return data;
}

// POST - Request password reset email
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const { data } = await request({
    url: `${baseAuthUrl}/request-password-reset/`,
    method: "POST",
    data: { email }
  });
  return data;
}
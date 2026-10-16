export interface User {
  id: string; // UUID as string
  email: string;
  nickname: string;
  first_name: string;
  last_name: string;
  date_joined: string; // ISO date string
  email_verified: boolean;
  email_verified_at?: string | null; // ISO date string
}
export interface Country {
    id?: number | string; // Use number or string based on your API response
    name: string;
    code: string;
}

export type Gender = 'man' | 'woman' | 'non-binary' | 'gender-fluid' | 'prefer-not-to-say';
export type AestheticType = 'masculine' | 'feminine' | 'both';
export type Language = 'en-gb' | 'en-us' | 'it' | 'fr' | 'de' | 'es';

export interface AzughAccount {
    id: number | string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        nickname: string;
    };
    phone_number?: string | null;
    profile_picture?: string | null;
    gender?: Gender | null;
    // aesthetic_preference?: AestheticType | null; // TODO: Add when BE support is ready
    date_of_birth?: string | null; // ISO date string (YYYY-MM-DD)
    country?: Country | null;
    city?: string | null;
    created_at: string; // ISO datetime string
    updated_at: string; // ISO datetime string
    onboarding_completed: boolean;
    language: Language;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  nickname?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  create_azugh_account?: boolean;
}

export interface LoginResponse {
  message: string;
  user_id: string;
  email_verified?: boolean;
  hint?: string;
}

export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple' | 'Google' | 'Facebook' | 'Apple';

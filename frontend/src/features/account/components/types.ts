export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  address?: string;
  city: string;
  country: string;
  postalCode?: string;
  bio?: string;
}

export interface AzughAIPreferences {
  tone: 'professional' | 'friendly' | 'creative';
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova';
  behavior: string;
}

export interface ToneOption {
  id: 'professional' | 'friendly' | 'creative';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface VoiceOption {
  id: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova';
  name: string;
  description: string;
}

export interface AestheticsPreferences {
  selectedAesthetics: string[];
  sizing: {
    top: string;
    bottom: string;
    shoe: string;
    dress: string;
  };
}

export interface PaymentMethod {
  id: string;
  cardNumber: string; // Only last 4 digits stored
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  expirationMonth: string;
  expirationYear: string;
  isDefault: boolean;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string; // Last 4 digits
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category:string
}

export interface SupportRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Feedback {
  rating: number;
  comment: string;
}

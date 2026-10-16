export const QUIZ_STEPS = {
  PERSONAL: 'personal',
  PHYSICAL: 'physical', 
  LIFESTYLE: 'lifestyle',
  BUDGET: 'budget',
  SUMMARY: 'summary'
} as const;

export const ANIMATION_DELAYS = {
  FAST: 300,
  MEDIUM: 500,
  SLOW: 1000
} as const;

export const BUDGET_RANGES = {
  MIN: 100,
  MAX: 2000,
  STEP: 50,
  DEFAULT: 500
} as const;

export const ITEM_COUNT_LIMITS = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 3
} as const;

export const QUIZ_VALIDATION_MESSAGES = {
  REQUIRED_SELECTION: "Please make a selection",
  INVALID_INPUT: "Please provide valid input"
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP_EMAIL: '/auth/signup/email',
  SIGNUP_PASSWORD: '/auth/signup/password',
} as const;

export const APP_ROUTES = {
  HOME: '/home',
  ONBOARDING: '/onboarding',
  TAKE_QUIZ: '/take-quiz',
  TALK_TO_AI: '/talk-to-ai-stylist',
  CLOSET: '/closet',
  WISHLIST: '/wishlist',
  CART: '/cart',
  ACCOUNT: '/account',
  // Aesthetics Steps
  LIKED_AESTHETICS: '/liked-aesthetics-step',
  STYLE_MOODS: '/style-moods-step', 
  COLOR_PREFERENCES: '/color-preferences-step',
  // Physical Profile Steps
  PHOTO_UPLOAD: '/photo-upload-step',
  BODY_SHAPE: '/body-shape-step',
  SIZES: '/sizes-step',
  BUST_FIT: '/bust-fit-step',
  BRA_SIZE: '/bra-size-step',
  FIT_RULES: '/fit-rules-step',
  // Budget Brand Materials Steps
  BUDGET: '/budget-step',
  BRAND: '/brand-step',
  FABRIC: '/fabric-step',
  // Location Lifestyle Steps
  LOCATION: '/location-step',
  LIFESTYLE: '/lifestyle-step',
  WARDROBE_STRATEGY: '/wardrobe-strategy-step',
  // Summary Step
  SUMMARY: '/summary-step',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 1 character long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_AGE: 'Age must be between 16 and 120',
  INVALID_BUDGET: 'Budget must be between 1 and 10,000',
} as const;

export const UI_CONSTANTS = {
  AUTH_FORM_MAX_WIDTH: 'max-w-md',
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 4000,
} as const;

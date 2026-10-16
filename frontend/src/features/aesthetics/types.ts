export interface Aesthetic {
    id: string;
    label: string;
    description?: string;
    image: string;
    genre?: 'masculine' | 'feminine' | 'both';
}

/**
 * Keywords extracted from the onboarding summary
 * Matches the backend ConversationKeywords model
 */
export interface OnboardingKeywords {
    city: string;
    gender: string;
    age_group: string;
    lifestyle_1: string;
    lifestyle_2: string;
    style_1: string;
    style_2: string;
    fit_1: string;
    fit_2: string;
    budget: string;
}

/**
 * Response from the onboarding summary generation endpoint
 */
export interface OnboardingSummaryResponse {
    id: string;
    summary: string;
    keywords: OnboardingKeywords;
}

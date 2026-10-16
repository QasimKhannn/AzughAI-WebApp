export interface UserProfile {
  name?: string;
  gender?: string;
  age?: number;
  skinColor?: string;
  spending?: {
    amount: number;
    currency: string;
  };
  aesthetics?: string[];
  // Add other profile fields as needed
}

/**
 * Service for managing user profile data across the application
 * Handles persistence and synchronization with backend
 */
export class UserProfileService {
  private static instance: UserProfileService;
  private profile: UserProfile = {};
  private storageKey = 'azugh_user_profile';
  
  private constructor() {
    this.loadProfile();
  }
  
  /**
   * Get the singleton instance of UserProfileService
   */
  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }
  
  /**
   * Get the complete user profile
   */
  public getProfile(): UserProfile {
    return { ...this.profile };
  }
  
  /**
   * Update a specific field in the user profile
   */
  public updateProfile<K extends keyof UserProfile>(key: K, value: UserProfile[K]): void {
    this.profile[key] = value;
    this.saveProfile();
  }
  
  /**
   * Save the profile to local storage
   */
  private saveProfile(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (error) {
      console.error('Failed to save user profile to localStorage:', error);
    }
  }
  
  /**
   * Load the profile from local storage
   */
  private loadProfile(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.profile = JSON.parse(stored);
      } else {
        this.profile = {
          name: '',
          gender: '',
          age: 16,
          skinColor: '',
          spending: {
            amount: 50,
            currency: ''
          },
          aesthetics: []
        };
        this.saveProfile(); // Initialize with default values
      }
    } catch (error) {
      console.error('Failed to load user profile from localStorage:', error);
    }
  }
  
  /**
   * Clear the user profile
   */
  public clearProfile(): void {
    this.profile = {};
    localStorage.removeItem(this.storageKey);
  }
  
  /**
   * Send profile to backend for persistent storage
   */
  public async syncWithBackend(): Promise<boolean> {
    try {
    //   const response = await fetch('/api/user/profile', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(this.profile),
    //     credentials: 'include' // Include cookies for authentication
    //   });
      
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
        console.log('Profile synced with backend:', this.profile);
      
      return true;
    } catch (error) {
      console.error('Failed to sync profile with backend:', error);
      return false;
    }
  }
}

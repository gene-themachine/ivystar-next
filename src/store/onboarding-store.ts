import { create } from 'zustand';
import { useUserStore } from './user-store';

interface OnboardingState {
  // Whether the user has completed onboarding
  isOnboardingComplete: boolean;
  
  // Function to mark onboarding as complete
  completeOnboarding: () => void;
  
  // Function to reset onboarding status (for testing)
  resetOnboarding: () => void;
  
  // Function to check if user has completed onboarding based on their metadata
  checkOnboardingStatus: () => boolean;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  isOnboardingComplete: false,
  
  completeOnboarding: () => set({ isOnboardingComplete: true }),
  
  resetOnboarding: () => set({ isOnboardingComplete: false }),
  
  // Check user store for required metadata
  checkOnboardingStatus: () => {
    const { username, role, interests, isLoaded } = useUserStore.getState();
    
    // Only consider onboarding complete if we've loaded user data and have required fields
    const isComplete = isLoaded && 
                      !!username && 
                      !!role && 
                      Array.isArray(interests) && 
                      interests.length > 0;
    
    // Update state if needed
    if (isComplete !== get().isOnboardingComplete) {
      set({ isOnboardingComplete: isComplete });
    }
    
    return isComplete;
  }
}));

// In a real application, you might want to:
// 1. Persist this state to localStorage or another storage mechanism
// 2. Initialize the state by checking user metadata from Clerk
// 3. Sync the state with your backend when changes occur 
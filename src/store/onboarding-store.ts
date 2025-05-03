import { create } from 'zustand';

interface OnboardingState {
  // Whether the user has completed onboarding
  isOnboardingComplete: boolean;
  
  // Function to mark onboarding as complete
  completeOnboarding: () => void;
  
  // Function to reset onboarding status (for testing)
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isOnboardingComplete: false,
  
  completeOnboarding: () => set({ isOnboardingComplete: true }),
  
  resetOnboarding: () => set({ isOnboardingComplete: false }),
}));

// In a real application, you might want to:
// 1. Persist this state to localStorage or another storage mechanism
// 2. Initialize the state by checking user metadata from Clerk
// 3. Sync the state with your backend when changes occur 
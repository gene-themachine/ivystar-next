import { create } from 'zustand';

// Define our own user type based on what we need
interface ClerkUser {
  username?: string | null;
  unsafeMetadata?: {
    username?: string | null;
    role?: 'mentor' | 'student' | null;
    interests?: string[];
    college?: string | null;
    gradeLevel?: string | null;
  };
}

type UserRole = 'mentor' | 'student' | null;

interface UserState {
  // General user data
  username: string | null;
  role: UserRole;
  interests: string[];
  profilePhoto: string | null;
  projectPhoto: string | null;
  projectDescription: string | null;
  college: string | null;
  gradeLevel: string | null;
  isLoaded: boolean;
  
  // Action to set user data
  setUserData: (userData: {
    username?: string;
    role?: UserRole;
    interests?: string[];
    profilePhoto?: string;
    projectPhoto?: string;
    projectDescription?: string;
    college?: string;
    gradeLevel?: string;
  }) => void;
  
  // Action to reset user data
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: null,
  role: null,
  interests: [],
  profilePhoto: null,
  projectPhoto: null,
  projectDescription: null,
  college: null,
  gradeLevel: null,
  isLoaded: false,
  
  setUserData: (userData) => set((state) => ({
    ...state,
    ...userData,
    isLoaded: true
  })),
  
  resetUser: () => set({
    username: null,
    role: null,
    interests: [],
    profilePhoto: null,
    projectPhoto: null,
    projectDescription: null,
    college: null,
    gradeLevel: null,
    isLoaded: false
  })
})); 
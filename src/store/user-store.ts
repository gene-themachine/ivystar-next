import { create } from 'zustand';

// Define our own user type based on what we need
interface ClerkUser {
  username?: string | null;
  unsafeMetadata?: {
    username?: string | null;
    role?: 'mentor' | 'student' | null;
    interests?: string[];
  };
}

interface UserState {
  username: string | null;
  role: 'mentor' | 'student' | null;
  interests: string[];
  isLoaded: boolean;
  setUser: (user: ClerkUser | null) => void;
  setUserData: (data: { username?: string; role?: 'mentor' | 'student' | null; interests?: string[] }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: null,
  role: null,
  interests: [],
  isLoaded: false,
  setUser: (user) => {
    if (!user) {
      set({ username: null, role: null, interests: [], isLoaded: true });
      return;
    }
    
    // First check unsafeMetadata.username, then fall back to user.username
    const username = user.unsafeMetadata?.username || user.username || null;
    
    set({ 
      username,
      role: user.unsafeMetadata?.role || null,
      interests: user.unsafeMetadata?.interests || [],
      isLoaded: true
    });
  },
  setUserData: (data) => set((state) => ({ ...state, ...data }))
})); 
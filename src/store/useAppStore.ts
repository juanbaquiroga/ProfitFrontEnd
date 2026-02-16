import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user.types';


interface AppState {
    // Auth
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    
    // UI Config
    theme: 'light' | 'dark';
    animationsEnabled: boolean;
    
    // Actions
    setAuth: (user: User, access: string, refresh: string) => void;
    updateAccessToken: (access: string) => void;
    logout: () => void;
    toggleAnimations: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

// Estado global de la app
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      theme: 'light',
      animationsEnabled: true,
      setAuth: (user, access, refresh) => set({ user, accessToken: access, refreshToken: refresh }),
      updateAccessToken: (accessToken) => 
        set({ accessToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'app-storage' }
  )
);
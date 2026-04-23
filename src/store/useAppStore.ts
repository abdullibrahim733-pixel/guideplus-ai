import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  // User
  user: { id: string; name: string; tier: 'free' | 'pro' | 'operator' | 'enterprise' } | null;
  isAuthenticated: boolean;
  
  // Network
  isOnline: boolean;
  lastSyncAt: number | null;
  
  // AI Models
  modelsDownloaded: {
    whisper: boolean;
    species: boolean;
    nmt: Record<string, boolean>; // {en: true, zh: false, ...}
  };
  
  // Actions
  setUser: (user: AppState['user']) => void;
  setOnline: (online: boolean) => void;
  setModelDownloaded: (model: string, downloaded: boolean) => void;
  setLastSync: (timestamp: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isOnline: false,
      lastSyncAt: null,
      modelsDownloaded: { whisper: false, species: false, nmt: {} },
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOnline: (isOnline) => set({ isOnline }),
      setModelDownloaded: (model, downloaded) => 
        set((state) => ({
          modelsDownloaded: {
            ...state.modelsDownloaded,
            [model === 'whisper' || model === 'species' ? model : 'nmt']:
              model === 'whisper' || model === 'species'
                ? downloaded
                : { ...state.modelsDownloaded.nmt, [model]: downloaded }
          }
        })),
      setLastSync: (timestamp) => set({ lastSyncAt: timestamp }),
    }),
    {
      name: 'guideplus-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

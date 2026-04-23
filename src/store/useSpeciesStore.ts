import { create } from 'zustand';

interface SpeciesState {
  isIdentifying: boolean;
  lastResult: {
    species: any;
    confidence: number;
    proFacts: string[];
    iucnStatus: string;
    scientificName: string;
  } | null;
  recentIdentifications: Array<{
    species: any;
    confidence: number;
    timestamp: number;
    imageUri: string;
  }>;
  
  // Actions
  setIdentifying: (identifying: boolean) => void;
  setLastResult: (result: SpeciesState['lastResult']) => void;
  addToRecent: (identification: Omit<SpeciesState['recentIdentifications'][0], 'timestamp'> & { timestamp?: number }) => void;
  clearRecent: () => void;
}

export const useSpeciesStore = create<SpeciesState>((set, get) => ({
  isIdentifying: false,
  lastResult: null,
  recentIdentifications: [],
  
  setIdentifying: (isIdentifying) => set({ isIdentifying }),
  setLastResult: (lastResult) => set({ lastResult }),
  
  addToRecent: (identification) => set((state) => ({
    recentIdentifications: [
      { ...identification, timestamp: identification.timestamp || Date.now() },
      ...state.recentIdentifications
    ].slice(0, 20) // Keep last 20 identifications
  })),
  
  clearRecent: () => set({ recentIdentifications: [] }),
}));

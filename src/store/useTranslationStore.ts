import { create } from 'zustand';

interface TranslationState {
  isRecording: boolean;
  isProcessing: boolean;
  originalText: string;
  translatedText: string;
  selectedLang: string;
  stage: string;
  history: Array<{
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    timestamp: number;
  }>;
  
  // Actions
  setRecording: (recording: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setOriginalText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  setSelectedLang: (lang: string) => void;
  setStage: (stage: string) => void;
  addToHistory: (entry: TranslationState['history'][0]) => void;
  clearHistory: () => void;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  isRecording: false,
  isProcessing: false,
  originalText: '',
  translatedText: '',
  selectedLang: 'en',
  stage: '',
  history: [],
  
  setRecording: (isRecording) => set({ isRecording }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setOriginalText: (originalText) => set({ originalText }),
  setTranslatedText: (translatedText) => set({ translatedText }),
  setSelectedLang: (selectedLang) => set({ selectedLang }),
  setStage: (stage) => set({ stage }),
  
  addToHistory: (entry) => set((state) => ({
    history: [entry, ...state.history].slice(0, 100) // Keep last 100 translations
  })),
  
  clearHistory: () => set({ history: [] }),
}));

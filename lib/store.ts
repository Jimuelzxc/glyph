import { create } from 'zustand';

interface ChunkState {
  originalText: string;
  chunks: string;
  isLoading: boolean;
  error: string | null;
  setOriginalText: (text: string) => void;
  setChunks: (chunks: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

export const useChunkStore = create<ChunkState>((set) => ({
  originalText: '',
  chunks: '',
  isLoading: false,
  error: null,
  setOriginalText: (text) => set({ originalText: text }),
  setChunks: (chunks) => set({ chunks }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearAll: () => set({ 
    originalText: '', 
    chunks: '', 
    isLoading: false, 
    error: null 
  }),
}));
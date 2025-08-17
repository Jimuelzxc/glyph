import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Keyword {
    chunk_id: number
    original_text: string
    type: 'keyword' | 'phrase'
    value: string
}

interface ChunkState {
    originalText: string
    chunks: string
    keywords: Keyword[]
    isLoading: boolean
    isAnalyzing: boolean
    error: string | null
    setOriginalText: (text: string) => void
    setChunks: (chunks: string) => void
    setKeywords: (keywords: Keyword[]) => void
    setLoading: (loading: boolean) => void
    setAnalyzing: (analyzing: boolean) => void
    setError: (error: string | null) => void
    clearAll: () => void
}

export const useChunkStore = create<ChunkState>()(
    persist(
        (set) => ({
            originalText: '',
            chunks: '',
            keywords: [],
            isLoading: false,
            isAnalyzing: false,
            error: null,
            setOriginalText: (text) => set({ originalText: text }),
            setChunks: (chunks) => set({ chunks }),
            setKeywords: (keywords) => set({ keywords }),
            setLoading: (loading) => set({ isLoading: loading }),
            setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
            setError: (error) => set({ error }),
            clearAll: () =>
                set({
                    originalText: '',
                    chunks: '',
                    keywords: [],
                    isLoading: false,
                    isAnalyzing: false,
                    error: null,
                }),
        }),
        {
            name: 'glyph-script-context', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                originalText: state.originalText,
                keywords: state.keywords,
            }),
        }
    )
)

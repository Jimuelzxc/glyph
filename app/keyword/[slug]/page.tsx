'use client'

import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useChunkStore } from '@/lib/store'

// Import TipTap styles to match the editor
import '@/components/tiptap-templates/simple/simple-editor.scss'

interface KeywordPageProps {
    params: Promise<{
        slug: string
    }>
}

interface VisualIdeas {
    concept: string
    visuals: {
        literal: string[]
        metaphorical: string[]
        characters: string[]
        objects: string[]
        icons: string[]
    }
}

export default function KeywordPage({ params }: KeywordPageProps) {
    const resolvedParams = use(params)
    const keyword = decodeURIComponent(resolvedParams.slug)
    const router = useRouter()
    const { originalText } = useChunkStore()
    
    const [visualIdeas, setVisualIdeas] = useState<VisualIdeas | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchVisualIdeas = async () => {
            try {
                setIsLoading(true)
                setError(null) // Clear any previous errors
                const response = await fetch('/api/visualize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        keyword,
                        scriptContext: originalText
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch visual ideas')
                }

                const data = await response.json()
                setVisualIdeas(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        fetchVisualIdeas()
    }, [keyword, originalText])

    const allIdeas = visualIdeas ? [
        ...visualIdeas.visuals.literal,
        ...visualIdeas.visuals.metaphorical,
        ...visualIdeas.visuals.characters,
        ...visualIdeas.visuals.objects,
        ...visualIdeas.visuals.icons
    ] : []

    return (
        <div style={{ 
            minHeight: '100vh',
            backgroundColor: 'var(--tt-bg-color)',
            fontFamily: '"Inter", sans-serif',
            color: 'var(--tt-theme-text)'
        }}>
            {/* Match TipTap editor layout */}
            <div style={{
                maxWidth: '648px',
                width: '100%',
                margin: '0 auto',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                <div style={{
                    flex: 1,
                    padding: '3rem 3rem 30vh'
                }}>
                    {/* Header - matches TipTap editor typography */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '2.25rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            color: 'var(--tt-theme-text)',
                            lineHeight: '1.2'
                        }}>
                            {keyword}
                        </h1>
                        
                        <button 
                            onClick={() => router.back()}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--tt-theme-text)',
                                opacity: 0.6,
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontFamily: '"Inter", sans-serif',
                                transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                        >
                            ← Back to Editor
                        </button>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 0',
                            color: 'var(--tt-theme-text)',
                            opacity: 0.6,
                            fontFamily: '"Inter", sans-serif'
                        }}>
                            Generating visual ideas...
                        </div>
                    )}

                    {/* Error State - only show if we have an error AND no successful data */}
                    {error && !visualIdeas && !isLoading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 0',
                            fontFamily: '"Inter", sans-serif'
                        }}>
                            <div style={{
                                color: 'var(--tt-theme-text)',
                                opacity: 0.6,
                                marginBottom: '1rem'
                            }}>
                                Failed to generate ideas
                            </div>
                            <button
                                onClick={() => {
                                    setError(null)
                                    setIsLoading(true)
                                    // Trigger the useEffect to refetch
                                    const fetchVisualIdeas = async () => {
                                        try {
                                            setIsLoading(true)
                                            setError(null)
                                            const response = await fetch('/api/visualize', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    keyword,
                                                    scriptContext: originalText
                                                }),
                                            })

                                            if (!response.ok) {
                                                throw new Error('Failed to fetch visual ideas')
                                            }

                                            const data = await response.json()
                                            setVisualIdeas(data)
                                        } catch (err) {
                                            setError(err instanceof Error ? err.message : 'An error occurred')
                                        } finally {
                                            setIsLoading(false)
                                        }
                                    }
                                    fetchVisualIdeas()
                                }}
                                style={{
                                    background: 'none',
                                    border: '1px solid var(--tt-gray-light-a-200)',
                                    borderRadius: '0.375rem',
                                    color: 'var(--tt-theme-text)',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontFamily: '"Inter", sans-serif',
                                    transition: 'all 0.2s ease',
                                    opacity: 0.8
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '1'
                                    e.currentTarget.style.backgroundColor = 'var(--tt-gray-light-a-50)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '0.8'
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Visual Ideas Grid */}
                    {visualIdeas && !isLoading && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '0.75rem',
                            marginTop: '1rem'
                        }}>
                            {allIdeas.map((idea, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: 'var(--tt-bg-color-contrast)',
                                        border: '1px solid var(--tt-gray-light-a-100)',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.4',
                                        color: 'var(--tt-theme-text)'
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(idea)
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--tt-gray-light-a-50)'
                                        e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-200)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--tt-bg-color-contrast)'
                                        e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-100)'
                                    }}
                                >
                                    {idea}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {allIdeas.length === 0 && !isLoading && !error && (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 0',
                            color: 'var(--tt-theme-text)',
                            opacity: 0.6,
                            fontFamily: '"Inter", sans-serif'
                        }}>
                            No ideas generated
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
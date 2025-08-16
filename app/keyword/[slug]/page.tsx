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
    const keywordType = keyword.includes(' ') ? 'phrase' : 'keyword'
    const router = useRouter()
    const { originalText } = useChunkStore()
    
    const [visualIdeas, setVisualIdeas] = useState<VisualIdeas | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('literal')

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

    const categories = visualIdeas ? Object.keys(visualIdeas.visuals) : []
    const ideasForSelectedCategory = visualIdeas
        ? visualIdeas.visuals[
              selectedCategory as keyof typeof visualIdeas.visuals
          ]
        : []

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
                            <span
                                style={{
                                    fontSize: '1.25rem',
                                    opacity: 0.6,
                                    marginLeft: '0.5rem',
                                    fontWeight: 'normal',
                                }}
                            >
                                ({keywordType})
                            </span>
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
                            padding: '3rem 0',
                            fontFamily: '"Inter", sans-serif'
                        }}>
                            {/* Loading Animation */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--tt-theme-text)',
                                    opacity: 0.3,
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    animationDelay: '0s'
                                }} />
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--tt-theme-text)',
                                    opacity: 0.3,
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    animationDelay: '0.2s'
                                }} />
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--tt-theme-text)',
                                    opacity: 0.3,
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                    animationDelay: '0.4s'
                                }} />
                            </div>
                            <div style={{
                                color: 'var(--tt-theme-text)',
                                opacity: 0.6,
                                fontSize: '0.875rem'
                            }}>
                                Generating visual ideas...
                            </div>
                            
                            {/* CSS Animation */}
                            <style jsx>{`
                                @keyframes pulse {
                                    0%, 80%, 100% {
                                        opacity: 0.3;
                                        transform: scale(1);
                                    }
                                    40% {
                                        opacity: 1;
                                        transform: scale(1.2);
                                    }
                                }
                            `}</style>
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

                    {/* Category Filters */}
                    {visualIdeas && !isLoading && (
                        <div
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                borderBottom:
                                    '1px solid var(--tt-gray-light-a-100)',
                                paddingBottom: '1rem',
                            }}
                        >
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '0.5rem 0',
                                        cursor: 'pointer',
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '0.875rem',
                                        color: 'var(--tt-theme-text)',
                                        opacity:
                                            selectedCategory === category
                                                ? 1
                                                : 0.5,
                                        fontWeight:
                                            selectedCategory === category
                                                ? '600'
                                                : '400',
                                        textTransform: 'capitalize',
                                        position: 'relative',
                                        transition: 'opacity 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedCategory !== category) {
                                            e.currentTarget.style.opacity = '0.8'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedCategory !== category) {
                                            e.currentTarget.style.opacity = '0.5'
                                        }
                                    }}
                                >
                                    {category}
                                    {selectedCategory === category && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '-17px',
                                                left: 0,
                                                right: 0,
                                                height: '2px',
                                                backgroundColor:
                                                    'var(--tt-theme-text)',
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Visual Ideas Grid */}
                    {visualIdeas && !isLoading && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '0.75rem',
                                marginTop: '1rem',
                            }}
                        >
                            {ideasForSelectedCategory.map((idea, index) => (
                                <div
                                    key={index}
                                    className={`idea-card-${index}`}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor:
                                            'var(--tt-bg-color-contrast)',
                                        border: '2px solid var(--tt-gray-light-a-100)',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer',
                                        transition:
                                            'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        fontFamily: '"Inter", sans-serif',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.4',
                                        color: 'var(--tt-theme-text)',
                                        transform: 'scale(1)',
                                        transformOrigin: 'center',
                                        boxShadow:
                                            '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onClick={() => {
                                        setSelectedIdea(idea)
                                        setShowPopup(true)
                                        // Add a subtle click animation
                                        const element = document.querySelector(
                                            `.idea-card-${index}`
                                        ) as HTMLElement
                                        if (element) {
                                            element.style.transform =
                                                'scale(0.95)'
                                            setTimeout(() => {
                                                element.style.transform =
                                                    'scale(1.05)'
                                            }, 100)
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            'var(--tt-gray-light-a-50)'
                                        e.currentTarget.style.borderColor =
                                            'var(--tt-gray-light-a-300)'
                                        e.currentTarget.style.transform =
                                            'scale(1.05)'
                                        e.currentTarget.style.boxShadow =
                                            '0 8px 16px rgba(0, 0, 0, 0.15)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            'var(--tt-bg-color-contrast)'
                                        e.currentTarget.style.borderColor =
                                            'var(--tt-gray-light-a-100)'
                                        e.currentTarget.style.transform =
                                            'scale(1)'
                                        e.currentTarget.style.boxShadow =
                                            '0 2px 4px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div
                                        style={{
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                        }}
                                    >
                                        {idea}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '-0.5rem',
                                                right: '0',
                                                fontSize: '0.75rem',
                                                opacity: 0,
                                                color: 'var(--tt-theme-text)',
                                                transition: 'opacity 0.3s ease',
                                                pointerEvents: 'none',
                                            }}
                                            className={`copy-hint-${index}`}
                                        >
                                            click to search
                                        </div>
                                    </div>

                                    {/* Add hover effect for copy hint */}
                                    <style jsx>{`
                                        .idea-card-${index}:hover
                                            .copy-hint-${index} {
                                            opacity: 0.5;
                                        }
                                    `}</style>
                                </div>
                            ))}
                        </div>
                    )}

                    {ideasForSelectedCategory.length === 0 &&
                    !isLoading &&
                    !error && (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '2rem 0',
                                color: 'var(--tt-theme-text)',
                                opacity: 0.6,
                                fontFamily: '"Inter", sans-serif',
                            }}
                        >
                            No ideas generated for this category
                        </div>
                    )}
                </div>
            </div>

            {/* Search Options Popup */}
            {showPopup && selectedIdea && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}
                onClick={() => setShowPopup(false)}
                >
                    <div style={{
                        backgroundColor: 'var(--tt-bg-color)',
                        border: '2px solid var(--tt-gray-light-a-200)',
                        borderRadius: '0.75rem',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        transform: 'scale(1)',
                        animation: 'popupAppear 0.2s ease-out'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <h3 style={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--tt-theme-text)',
                                marginBottom: '0.5rem'
                            }}>
                                Search for Images
                            </h3>
                            <p style={{
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.875rem',
                                color: 'var(--tt-theme-text)',
                                opacity: 0.7,
                                backgroundColor: 'var(--tt-bg-color-contrast)',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid var(--tt-gray-light-a-100)'
                            }}>
                                "{selectedIdea}"
                            </p>
                        </div>

                        {/* Search Options */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            marginBottom: '1.5rem'
                        }}>
                            {/* Google Images */}
                            <button
                                onClick={() => {
                                    const query = encodeURIComponent(selectedIdea)
                                    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank')
                                    setShowPopup(false)
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--tt-bg-color-contrast)',
                                    border: '2px solid var(--tt-gray-light-a-100)',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.875rem',
                                    color: 'var(--tt-theme-text)',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--tt-gray-light-a-50)'
                                    e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-300)'
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--tt-bg-color-contrast)'
                                    e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-100)'
                                    e.currentTarget.style.transform = 'scale(1)'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#4285f4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    G
                                </div>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Google Images</div>
                                    <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>Search millions of images</div>
                                </div>
                            </button>

                            {/* Freepik */}
                            <button
                                onClick={() => {
                                    const query = encodeURIComponent(selectedIdea.replace(/\s+/g, '-'))
                                    window.open(`https://www.freepik.com/free-photos-vectors/${query}`, '_blank')
                                    setShowPopup(false)
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--tt-bg-color-contrast)',
                                    border: '2px solid var(--tt-gray-light-a-100)',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.875rem',
                                    color: 'var(--tt-theme-text)',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--tt-gray-light-a-50)'
                                    e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-300)'
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--tt-bg-color-contrast)'
                                    e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-100)'
                                    e.currentTarget.style.transform = 'scale(1)'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#00d4aa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    F
                                </div>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Freepik</div>
                                    <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>Free vectors and photos</div>
                                </div>
                            </button>

                            {/* Pinterest */}
                            <button
                                onClick={() => {
                                    const query = encodeURIComponent(selectedIdea)
                                    window.open(`https://ph.pinterest.com/search/pins/?q=${query}`, '_blank')
                                    setShowPopup(false)
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--tt-bg-color-contrast)',
                                    border: '2px solid var(--tt-gray-light-a-100)',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.875rem',
                                    color: 'var(--tt-theme-text)',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--tt-gray-light-a-50)'
                                    e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-300)'
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--tt-bg-color-contrast)'
                                    e.currentTarget.style.borderColor = 'var(--tt-gray-light-a-100)'
                                    e.currentTarget.style.transform = 'scale(1)'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e60023',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    P
                                </div>
                                <div>
                                    <div style={{ fontWeight: '500' }}>Pinterest</div>
                                    <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>Visual inspiration</div>
                                </div>
                            </button>
                        </div>

                        {/* Copy Option */}
                        <div style={{
                            borderTop: '1px solid var(--tt-gray-light-a-100)',
                            paddingTop: '1rem',
                            textAlign: 'center'
                        }}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedIdea)
                                    setShowPopup(false)
                                }}
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
                                Just copy text instead
                            </button>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--tt-theme-text)',
                                opacity: 0.5,
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                width: '2rem',
                                height: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1'
                                e.currentTarget.style.backgroundColor = 'var(--tt-gray-light-a-100)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0.5'
                                e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                        >
                            ×
                        </button>

                        {/* CSS Animation */}
                        <style jsx>{`
                            @keyframes popupAppear {
                                from {
                                    opacity: 0;
                                    transform: scale(0.9);
                                }
                                to {
                                    opacity: 1;
                                    transform: scale(1);
                                }
                            }
                        `}</style>
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { use, useEffect, useState } from 'react'
import { useChunkStore } from '@/lib/store'

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

    const renderVisualCategory = (title: string, ideas: string[]) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {ideas.map((idea, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                        {idea}
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        {keyword}
                    </h1>
                    <Button
                        onClick={() => router.back()}
                        data-style="ghost"
                        tooltip="Go back to the previous page"
                    >
                        ← Back to Editor
                    </Button>
                </div>

                {/* Visual Ideas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6">Visual Ideas</h2>
                    
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500">Generating visual ideas...</div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 mb-6">
                            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                        </div>
                    )}

                    {visualIdeas && !isLoading && (
                        <div className="space-y-6">
                            {renderVisualCategory('Literal', visualIdeas.visuals.literal)}
                            {renderVisualCategory('Metaphorical', visualIdeas.visuals.metaphorical)}
                            {renderVisualCategory('Characters', visualIdeas.visuals.characters)}
                            {renderVisualCategory('Objects', visualIdeas.visuals.objects)}
                            {renderVisualCategory('Icons', visualIdeas.visuals.icons)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
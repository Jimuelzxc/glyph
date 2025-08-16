'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { use } from 'react'

interface KeywordPageProps {
    params: Promise<{
        slug: string
    }>
}

export default function KeywordPage({ params }: KeywordPageProps) {
    const resolvedParams = use(params)
    const keyword = decodeURIComponent(resolvedParams.slug)
    const router = useRouter()

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(keyword)
            // You could add a toast notification here
            console.log('Copied to clipboard:', keyword)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleSearch = () => {
        // Open Google search in new tab
        window.open(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, '_blank')
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        {keyword}
                    </h1>
                    <p className="text-lg opacity-70">
                        Reference page for the highlighted keyword
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 mb-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Keyword Information</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Selected Text:</h3>
                            <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded border font-mono">
                                {keyword}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Actions:</h3>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    onClick={handleSearch}
                                    data-style="default"
                                    tooltip={`Search for "${keyword}" on Google`}
                                >
                                    Search for "{keyword}"
                                </Button>
                                <Button
                                    onClick={handleCopyToClipboard}
                                    data-style="ghost"
                                    tooltip="Copy keyword to clipboard"
                                >
                                    Copy to Clipboard
                                </Button>
                                <Button
                                    data-style="ghost"
                                    tooltip="Add to personal dictionary"
                                >
                                    Add to Dictionary
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
                    <p className="opacity-70">
                        This page was generated from a highlighted keyword in the Tiptap editor.
                        You can customize this page to show relevant information, search results,
                        or any other content related to the keyword "{keyword}".
                    </p>
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Button
                        onClick={() => router.back()}
                        data-style="ghost"
                        tooltip="Go back to the previous page"
                    >
                        ← Back to Editor
                    </Button>
                </div>
            </div>
        </div>
    )
}
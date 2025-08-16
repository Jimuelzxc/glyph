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

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Keyword Title */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        {keyword}
                    </h1>
                </div>

                {/* Back Button */}
                <div>
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
"use client";

import { useChunkStore } from '@/lib/store';

export function ChunkResults() {
  const { originalText, chunks, keywords, isLoading, isAnalyzing, error } = useChunkStore();
  
  // Debug logging
  console.log('ChunkResults render:', { 
    originalText: !!originalText, 
    chunks: !!chunks, 
    keywordsLength: keywords.length,
    keywords,
    isLoading, 
    isAnalyzing 
  });

  if (!originalText && !isLoading && !isAnalyzing) {
    return null;
  }

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">AI Analysis Results</h3>
      
      {(isLoading || isAnalyzing) && (
        <div className="flex items-center gap-2 text-blue-600 mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>
            {isLoading && 'Chunking text...'}
            {isAnalyzing && 'Extracting keywords...'}
          </span>
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200 mb-4">
          {error}
        </div>
      )}

      {originalText && !isLoading && !isAnalyzing && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Original Text:</h4>
            <div className="p-3 bg-white border rounded text-sm text-gray-600">
              {originalText}
            </div>
          </div>

          {chunks && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Chunked Text:</h4>
              <div className="p-3 bg-white border rounded text-sm">
                <pre className="whitespace-pre-wrap font-sans">{chunks}</pre>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Keywords & Phrases: ({keywords.length} found)</h4>
            {keywords.length === 0 ? (
              <div className="p-3 bg-white border rounded text-sm text-gray-500">
                No keywords extracted yet. Click "🔍 Extract Keywords" to analyze the text.
              </div>
            ) : (
              <div className="p-3 bg-white border rounded">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((chunk, index) => {
                    const isKeywords = chunk.type === 'keywords';
                    const items = isKeywords ? chunk.data : [chunk.data];
                    
                    return items.map((item: string, itemIndex: number) => (
                      <span
                        key={`${index}-${itemIndex}`}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                          isKeywords
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                        title={`${chunk.type}: "${chunk.original_text}"`}
                      >
                        {isKeywords ? '🔑' : '💬'} {item}
                      </span>
                    ));
                  }).flat()}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  🔑 Keywords • 💬 Phrases • Click for visual ideas (coming soon)
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useChunkStore } from '@/lib/store';

export function ChunkResults() {
  const { originalText, chunks, isLoading, error } = useChunkStore();

  if (!originalText && !isLoading) {
    return null;
  }

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Story Beat Editor Results</h3>
      
      {isLoading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Chunking text...</span>
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      {originalText && !isLoading && (
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
        </div>
      )}
    </div>
  );
}
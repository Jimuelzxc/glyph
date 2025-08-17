"use client";

import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Button } from '@/components/tiptap-ui-primitive/button';
import { Toolbar, ToolbarGroup } from '@/components/tiptap-ui-primitive/toolbar';
import { useChunkStore } from '@/lib/store';

interface ChunkBubbleMenuProps {
  editor: Editor;
}

export function ChunkBubbleMenu({ editor }: ChunkBubbleMenuProps) {
  const { 
    setOriginalText, 
    setChunks, 
    setKeywords,
    setLoading, 
    setAnalyzing,
    setError, 
    isLoading,
    isAnalyzing,
    chunks,
    originalText
  } = useChunkStore();

  const highlightKeywordsInEditor = (chunks: any[]) => {
    if (!editor || editor.isDestroyed) return

    // Get the current document content
    const doc = editor.state.doc;
    const tr = editor.state.tr;

    // Alternating colors for visual contrast
    const colors = [
      'var(--tt-color-highlight-purple)',
      'var(--tt-color-highlight-blue)',
      'var(--tt-color-highlight-green)',
      'var(--tt-color-highlight-yellow)',
      'var(--tt-color-highlight-pink)',
    ];

    let colorIndex = 0;

    chunks.forEach((chunk) => {
      const isKeywords = chunk.type === 'keywords';
      const currentColor = colors[colorIndex % colors.length];
      
      if (isKeywords) {
        // For keywords: highlight each individual keyword, but only within this chunk's original text
        const chunkText = chunk.original_text;
        
        // First find where this chunk appears in the document
        const chunkRegex = new RegExp(chunkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        
        doc.descendants((node, pos) => {
          if (node.isText && node.text) {
            let chunkMatch;
            while ((chunkMatch = chunkRegex.exec(node.text)) !== null) {
              const chunkStart = pos + chunkMatch.index;
              const chunkTextContent = chunkMatch[0];
              
              // Now find each keyword within this specific chunk
              chunk.data.forEach((keyword: string) => {
                const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                
                let keywordMatch;
                while ((keywordMatch = keywordRegex.exec(chunkTextContent)) !== null) {
                  const from = chunkStart + keywordMatch.index;
                  const to = from + keywordMatch[0].length;
                  
                  tr.addMark(from, to, editor.schema.marks.highlight.create({
                    color: currentColor
                  }));
                }
                // Reset regex lastIndex for next iteration
                keywordRegex.lastIndex = 0;
              });
            }
          }
        });
      } else {
        // For phrases: highlight the entire phrase as one unit
        const phraseText = chunk.data;
        const phraseRegex = new RegExp(phraseText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        
        doc.descendants((node, pos) => {
          if (node.isText && node.text) {
            let match;
            while ((match = phraseRegex.exec(node.text)) !== null) {
              const from = pos + match.index;
              const to = from + match[0].length;
              
              tr.addMark(from, to, editor.schema.marks.highlight.create({
                color: currentColor
              }));
            }
          }
        });
      }
      
      // Move to next color for next chunk
      colorIndex++;
    });

    // Apply the transaction
    if (tr.docChanged || tr.steps.length > 0) {
      editor.view.dispatch(tr);
    }
  };

  const handleChunkText = async () => {
    if (!editor) return;

    // Get selected text and selection range
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (!selectedText.trim()) return;

    setLoading(true);
    setError(null);
    setOriginalText(selectedText);

    try {
      const response = await fetch('/api/chunk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedText }),
      });

      if (!response.ok) {
        throw new Error('Failed to chunk text');
      }

      const data = await response.json();
      setChunks(data.chunks);

      // Replace the selected text with the chunked version
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(data.chunks)
        .run();

    } catch (error) {
      console.error('Error chunking text:', error);
      setError('Failed to chunk text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractKeywords = async () => {
    if (!editor) return;

    // Get selected text or use existing chunks
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    const textToAnalyze = chunks || selectedText;
    const originalTextForContext = originalText || selectedText;

    if (!textToAnalyze.trim()) return;

    setAnalyzing(true);
    setError(null);

    // If we don't have original text stored, store the selected text
    if (!originalText) {
      setOriginalText(selectedText);
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chunkedText: textToAnalyze,
          originalText: originalTextForContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract keywords');
      }

      const data = await response.json();
      console.log('Keywords received:', data.keywords);
      console.log('Detailed analysis:');
      data.keywords.forEach((chunk: any, index: number) => {
        console.log(`Chunk ${index + 1}:`, {
          type: chunk.type,
          original: chunk.original_text,
          data: chunk.data
        });
      });
      setKeywords(data.keywords);

      // Highlight the extracted keywords/phrases in the editor
      highlightKeywordsInEditor(data.keywords);

    } catch (error) {
      console.error('Error extracting keywords:', error);
      setError('Failed to extract keywords. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => {
        // Only show when text is selected
        return !editor.state.selection.empty;
      }}
    >
      <Toolbar variant="floating">
        <ToolbarGroup>
          <Button
            onClick={handleChunkText}
            data-style="ghost"
            disabled={isLoading || isAnalyzing}
            className="cursor-pointer"
          >
            {isLoading ? '⏳ Chunking...' : '✨ Chunk Text'}
          </Button>
          <Button
            onClick={handleExtractKeywords}
            data-style="ghost"
            disabled={isLoading || isAnalyzing}
            className="cursor-pointer"
          >
            {isAnalyzing ? '⏳ Analyzing...' : '🔍 Extract Keywords'}
          </Button>
        </ToolbarGroup>
      </Toolbar>
    </BubbleMenu>
  );
}

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
  const { setOriginalText, setChunks, setLoading, setError, isLoading } = useChunkStore();

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
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? '⏳ Chunking...' : '✨ Chunk Text'}
          </Button>
        </ToolbarGroup>
      </Toolbar>
    </BubbleMenu>
  );
}
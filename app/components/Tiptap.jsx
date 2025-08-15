"use client";


import { EditorContent, EditorContext, useEditor } from '@tiptap/react'

import { StarterKit } from '@tiptap/starter-kit'
import { Highlight } from '@tiptap/extension-highlight'

import { ColorHighlightButton } from '@/components/tiptap-ui/color-highlight-button'

import { ButtonGroup } from '@/components/tiptap-ui-primitive/button'

const Tiptap = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Highlight.configure({ multicolor: true })],
    content: `
             <h2>Color Highlight Button Demo</h2>
      <p>Welcome to the color highlight button! This demo showcases functionality.</p>
      
      <h3>How to Use:</h3>
      <p>1. <strong>Select any text</strong> you want to highlight</p>
      <p>2. <strong>Click a color button</strong> to apply that <mark data-color="oklch(88.5% 0.062 18.334)" style="background-color: oklch(88.5% 0.062 18.334); color: inherit">highlight</mark></p>
`,
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <ButtonGroup orientation="horizontal">
        <ColorHighlightButton
          tooltip="Red"
          highlightColor="oklch(88.5% 0.062 18.334)"
        />
        <ColorHighlightButton
          editor={editor}
          tooltip="Orange"
          highlightColor="oklch(90.1% 0.076 70.697)"
          text="Highlight"
          hideWhenUnavailable={true}
          showShortcut={true}
          onApplied={({ color, label }) =>
            console.log(`Applied ${label} highlight: ${color}`)
          }
        />
      </ButtonGroup>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  );
};

export default Tiptap;

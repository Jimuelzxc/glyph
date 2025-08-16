import { Highlight } from '@tiptap/extension-highlight'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface ClickableHighlightOptions {
  multicolor: boolean
  HTMLAttributes: Record<string, any>
  onHighlightClick?: (text: string, color?: string) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlight: {
      /**
       * Set a highlight mark
       */
      setHighlight: (attributes?: { color: string }) => ReturnType
      /**
       * Toggle a highlight mark
       */
      toggleHighlight: (attributes?: { color: string }) => ReturnType
      /**
       * Unset a highlight mark
       */
      unsetHighlight: () => ReturnType
    }
  }
}

export const ClickableHighlight = Highlight.extend<ClickableHighlightOptions>({
  name: 'highlight',

  addOptions() {
    return {
      ...this.parent?.(),
      onHighlightClick: undefined,
    }
  },

  addProseMirrorPlugins() {
    const plugins = this.parent?.() || []
    
    plugins.push(
      new Plugin({
        key: new PluginKey('clickableHighlight'),
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement
              
              // Check if the clicked element or its parent has highlight styling
              const highlightElement = target.closest('mark[data-type="highlight"]') as HTMLElement
              
              if (highlightElement && this.options.onHighlightClick) {
                event.preventDefault()
                event.stopPropagation()
                
                const text = highlightElement.textContent || ''
                const color = highlightElement.style.backgroundColor || 
                             highlightElement.getAttribute('data-color') ||
                             undefined
                
                this.options.onHighlightClick(text, color)
                return true
              }
              
              return false
            },
          },
        },
      })
    )
    
    return plugins
  },

  renderHTML({ node, HTMLAttributes }) {
    const { color, ...rest } = HTMLAttributes
    
    return [
      'mark',
      {
        ...rest,
        'data-type': 'highlight',
        'data-color': color,
        style: color ? `background-color: ${color}; cursor: pointer;` : 'cursor: pointer;',
        class: 'clickable-highlight',
      },
      0,
    ]
  },
})
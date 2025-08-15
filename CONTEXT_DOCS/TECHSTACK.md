
# Glyph – Project Tech Stack & Setup

## Overview
Glyph is a Notion-like markdown editor with highlight-based AI suggestions.
Users can type in markdown, highlight text, and instantly get AI-generated visual ideas.
The app is built with **Next.js**, styled with **TailwindCSS**, and uses **Zustand** for global state.

---

## Core Technologies
- **Framework:** [Next.js](https://nextjs.org/) – SSR, API routes, deployment-ready.
- **Styling:** [TailwindCSS](https://tailwindcss.com/) – utility-first, fast UI building.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) – lightweight global state for script, highlights, and suggestions.

---

## Editor & Parsing
- **Markdown Parsing:** [marked.js](https://marked.js.org/) – live preview & markdown syntax (`# heading`, `**bold**`).
- **Sanitization:** [DOMPurify](https://github.com/cure53/DOMPurify) – prevent XSS from markdown HTML.
- **Selection Handling:** [range-selection-utils](https://www.npmjs.com/package/range-selection-utils) *(optional)* – helper functions for working with text selections inside `contenteditable`.

---

## UI & Components
- **Tooltip & Popovers:** [Headless UI](https://headlessui.dev/) – accessible popovers, modals, dropdowns.
- **Animation:** [Framer Motion](https://www.framer.com/motion/) *(optional)* – smooth fade/scale animations for highlights & tooltips.

---

## API & AI
- **AI Calls:** Direct calls to **OpenAI API** from Next.js API routes.
    - `/api/chunk` → Story Beat Editor Agent
    - `/api/analyze` → Visual Hook Analyst Agent
    - `/api/visualize` → Visualization Ideator Agent

---

## Storage
- **MVP:** Browser `localStorage` for script + highlights.
- **Later:** [Supabase](https://supabase.com/) if cloud storage, auth, or multi-user support is needed.

---

## Testing & Dev Tools
- **Linting:** ESLint (Next.js default)
- **Formatting:** Prettier
- **Type Safety:** TypeScript

---

## Suggested Folder Structure

```
/src
  /components
    Editor.tsx
    HighlightTooltip.tsx
  /lib
    markdownParser.ts
    selectionUtils.ts
  /store
    useEditorStore.ts
  /pages
    index.tsx
    /api
      chunk.ts
      analyze.ts
      visualize.ts
  /styles
    globals.css
```

---

## Build Plan

1. **Scaffold Project**
    - `npx create-next-app glyph --ts`
    - Install TailwindCSS, Zustand, marked.js, DOMPurify

2. **Editor MVP**
    - Create markdown editor component (contenteditable or textarea)
    - Live preview using marked.js
    - Highlight selection handling

3. **Tooltip UI**
    - Implement hover tooltip with dummy suggestions
    - Style with TailwindCSS

4. **API Integration**
    - Add `/api/chunk`, `/api/analyze`, `/api/visualize`
    - Connect to OpenAI API

5. **State Management**
    - Store script, highlights, suggestions in Zustand

6. **Persistence**
    - Save to localStorage (MVP)
    - Later add Supabase for cloud sync

---

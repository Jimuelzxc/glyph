
# Glyph – Product Vision

## Overview
Glyph is a modern, minimalist tool that transforms text into visual inspiration.
It is designed for writers, storytellers, content creators, and creative professionals who want to bridge the gap between written ideas and visual concepts.

The core experience of Glyph feels like a **Notion-like markdown editor** with a twist: 
users can write, highlight text, and instantly get **AI-powered visual suggestions** for their highlighted words or phrases.

---

## Target Users
- Writers & authors
- Screenwriters & filmmakers
- Content creators & marketers
- Designers seeking visual references
- Educators & presenters

---

## Core Workflow
1. **Write Freely** – The editor supports markdown so users can type naturally (`# headings`, `**bold**`).
2. **Highlight** – Users can highlight any word or phrase that they want visual ideas for.
3. **Get Suggestions** – AI instantly generates categorized visual suggestions:
    - Literal
    - Metaphorical
    - Characters
    - Objects
    - Icons
4. **Refine & Use** – Users can keep writing, gather more visual ideas, and export or screenshot suggestions.

---

## MVP Features
- **Markdown Editing** – Heading syntax (`#`), bold, italic.
- **Highlighting** – Select text, apply highlight styling, store the highlight in state.
- **Tooltip Suggestions** – On hover or click, show AI-generated suggestions in the 5 categories.
- **Local Persistence** – Save script, highlights, and AI suggestions in `localStorage`.
- **Responsive UI** – Works on desktop and mobile.

---

## AI Agents
1. **Story Beat Editor Agent** – Cleans and splits text into meaningful chunks.
2. **Visual Hook Analyst Agent** – Extracts keywords or phrases from chunks.
3. **Visualization Ideator Agent** – Generates visual suggestions based on context.

---

## Design & UX Principles
- Minimalist, modern interface (similar to Notion).
- Fast, distraction-free writing environment.
- Highlights feel natural and non-intrusive.
- Suggestions are quick to access and easy to scan.

---

## Out of Scope (for MVP)
- User accounts / authentication
- Cloud storage
- Real-time collaboration
- Image generation
- Export to PDF/Word

---

## Success Criteria for MVP
- Users can type in markdown and see live formatting.
- Users can highlight text and receive AI suggestions without page reloads.
- Suggestions appear in 5 categories and are context-aware.
- App feels fast and fluid with minimal latency between highlight and suggestion.

---


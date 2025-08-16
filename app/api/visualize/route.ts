import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

export async function POST(request: NextRequest) {
    try {
        const { keyword, scriptContext } = await request.json();

        if (!keyword) {
            return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Keyword/Phrase: ${keyword}`,
            config: {
                systemInstruction: `You are the Visualization Ideator Agent.

Your role: You specialize in generating creative, context-aware visual ideas for scripts and stories.

Script Context: ${scriptContext || 'No script context provided'}

You will receive:
- A single keyword
- A short list of keywords
- OR a full phrase

Your job:
- Always use the Script Context above to interpret the meaning of the keyword or phrase.
- If the keyword has multiple meanings, choose the interpretation that best fits the script context.
- Suggest visuals grouped into the following categories:
    1. Literal — Direct, straightforward depictions of the word/phrase.
    2. Metaphorical — Symbolic or abstract representations.
    3. Characters — People or figures that could embody the concept.
    4. Objects — Physical, concrete items tied to the concept's setting or theme.
    5. Icons — Minimal, symbolic visuals that communicate the concept simply.

Guidelines:
- Provide at least 2–3 suggestions for each category.
- Keep suggestions short (3–8 words each).
- Avoid repeating the same idea in multiple categories.
- If multiple keywords are provided, you may combine them for richer suggestions.

Output: Return a valid JSON object with this structure:
{
  "concept": "original keyword or phrase",
  "visuals": {
    "literal": ["idea1", "idea2", ...],
    "metaphorical": ["idea1", "idea2", ...],
    "characters": ["idea1", "idea2", ...],
    "objects": ["idea1", "idea2", ...],
    "icons": ["idea1", "idea2", ...]
  }
}`,
                responseMimeType: "application/json"
            }
        });

        const result = JSON.parse(response.text || '{}');

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error generating visual ideas:', error);
        return NextResponse.json(
            { error: 'Failed to generate visual ideas' },
            { status: 500 }
        );
    }
}
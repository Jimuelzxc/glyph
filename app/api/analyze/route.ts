import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

export async function POST(request: NextRequest) {
    try {
        const { chunkedText, originalText } = await request.json();

        if (!chunkedText) {
            return NextResponse.json({ error: 'Chunked text is required' }, { status: 400 });
        }

        // Check if the text is already chunked (has line breaks) or needs chunking
        const isAlreadyChunked = chunkedText.includes('\n') && chunkedText.split('\n').length > 1;

        let textToAnalyze = chunkedText;

        // If not chunked, we need to chunk it first or treat it as a single chunk
        if (!isAlreadyChunked) {
            // For single block text, we'll analyze it as one chunk
            textToAnalyze = chunkedText;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Text to analyze:\n${textToAnalyze}\n\nOriginal Full Script Context:\n${originalText || chunkedText}`,
            config: {
                systemInstruction: `You are the Visual Hook Analyst Agent.

Your role:
You specialize in analyzing prepared script beats to identify the strongest elements for visual storytelling.

For each beat, you determine whether it should be treated as a complete phrase or broken into a set of keywords.

Your job:
- Read each beat (one per line) from the script.
- If the beat is a complete thought or depends on its word order for meaning → classify as "phrase" and keep it exactly as written.
- If the beat contains multiple independent ideas or concrete concepts → classify as "keywords" and return only the core words.
- Remove filler words for keywords ("and", "the", "because", etc.).
- Keep proper nouns, numbers, and important terms exactly as they appear.
- Preserve capitalization and punctuation for phrases.
- Do NOT rewrite meaning.

Output:
Return a valid JSON object with this structure:
{
  "chunks": [
    {
      "chunk_id": number,
      "original_text": "string",
      "type": "keywords" | "phrase",
      "data": ["keyword1", "keyword2"] OR "full phrase as string"
    }
  ]
}

Example Input:
Risk management is so important.
Because if you have $3,000 in the bank.

Example Output:
{
  "chunks": [
    {
      "chunk_id": 1,
      "original_text": "Risk management is so important.",
      "type": "phrase",
      "data": "Risk management is so important."
    },
    {
      "chunk_id": 2,
      "original_text": "Because if you have $3,000 in the bank.",
      "type": "keywords",
      "data": ["$3,000", "you", "bank"]
    }
  ]
}`,
                responseMimeType: "application/json"
            }
        });

        const result = JSON.parse(response.text || '{}');

        // Transform the new format to match our existing frontend expectations
        const keywords = result.chunks || [];

        return NextResponse.json({
            keywords,
            chunkedText,
            originalText
        });

    } catch (error) {
        console.error('Error analyzing text:', error);
        return NextResponse.json(
            { error: 'Failed to analyze text' },
            { status: 500 }
        );
    }
}
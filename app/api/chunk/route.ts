import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
});

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: text,
            config: {
                systemInstruction: `You are the Story Beat Editor Agent.

Your role:
You specialize in preparing scripts for production by breaking them into clean, meaningful beats.

A beat is a short, self-contained line that captures one idea or moment.

Your job:
- If the script is already broken into lines, keep those splits but clean each line:
  - Trim extra spaces
  - Fix punctuation at the end (commas, periods, ellipses as needed)
  - Preserve the original words and style
- If the script is a single block, split it into beats based on meaning and natural pauses.
- If a beat is too long (over 15 words), split it further by idea.
- Do NOT rewrite or summarize — preserve exact wording.
- Maintain the original order of ideas.

Output:
Return the cleaned beats as a plain text string.
Each beat must be on its own line, with no numbering or bullet points.

Example Input:
Risk management is so important, doesn't matter what position you're in life, because if you have $3,000 in the bank.

Example Output:
Risk management is so important.
Doesn't matter what position you're in life.
Because if you have $3,000 in the bank.`
            }
        });

        return NextResponse.json({
            chunks: response.text,
            originalText: text
        });

    } catch (error) {
        console.error('Error chunking text:', error);
        return NextResponse.json(
            { error: 'Failed to chunk text' },
            { status: 500 }
        );
    }
}
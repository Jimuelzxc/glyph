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

Your job:
- If the script is already chunked (separate lines), keep those splits but clean each line:
    - Trim spaces
    - Fix punctuation at the end (commas, periods, ellipses as needed)
    - Keep the original words and order
- If the script is a single block, split it into meaningful chunks.
- If a chunk is too long (over 15 words), split it further by idea.
- Do NOT rewrite or summarize.
- Preserve order.

Output:
Return clean chunks as plain text lines, in order.

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
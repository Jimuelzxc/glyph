import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { keyword, scriptContext } = await request.json();

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    if (!scriptContext || scriptContext.trim().length === 0) {
      return NextResponse.json(
        { error: "Script context cannot be empty" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Keyword/Phrase: ${keyword}\n\nScript Context: ${scriptContext}`,
      config: {
        systemInstruction: `You are the Visualization Ideator Agent.

Your role: You specialize in generating creative, context-aware visual ideas for scripts and stories.


Your job:
- Always use the Script Context above to interpret the meaning of the keyword or phrase.
- If the keyword has multiple meanings, choose the interpretation that best fits the script context.
- Suggest visuals grouped into the following categories:
    1. Literal — Presenting visuals in a straightforward and direct manner without abstract interpretations. This can include showing real-life objects or scenes as they are.
    2. Metaphorical — Using symbols, metaphors, or abstract representations to convey ideas or concepts.
    3. Characters — Incorporating animated characters to convey emotions, actions, or narratives. These characters can be human, animal, or even abstract figures.

    4. Objects — respond with ONLY single keywords (not keyphrases or sentences), e.g., Clock/Time → Experience."
    5. Icons — Minimal, symbolic visuals that communicate the concept simply.

Guidelines:
- USE SIMPLE ENGLISH and EASY WORDS
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
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating visual ideas:", error);
    return NextResponse.json(
      { error: "Failed to generate visual ideas" },
      { status: 500 }
    );
  }
}

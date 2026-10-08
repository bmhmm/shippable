import { NextResponse } from "next/server";
import { openai } from "@/lib/ai/client";
import { SHIPPABLE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "A prompt is required." },
        { status: 400 }
      );
    }

    if (prompt.length > 10000) {
      return NextResponse.json(
        { error: "Prompt is too long." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      instructions: SHIPPABLE_SYSTEM_PROMPT,
      input: prompt.trim(),
    });

    return NextResponse.json({
      response: response.output_text,
    });
  } catch (error) {
    console.error("AI API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while contacting the AI." },
      { status: 500 }
    );
  }
}
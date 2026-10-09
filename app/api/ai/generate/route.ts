
import { NextResponse } from "next/server";
import { openai } from "@/lib/ai/client";
import { createClient } from "@/lib/supabase/server";
import { CODE_GENERATION_PROMPT } from "@/lib/ai/code-prompt";
import { GENERATED_CODE_JSON_SCHEMA } from "@/lib/ai/code-schema";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in before generating code." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const prompt = body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Describe the application you want to build." },
        { status: 400 }
      );
    }

    if (prompt.length > 8000) {
      return NextResponse.json(
        { error: "Your prompt must be 8,000 characters or fewer." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      instructions: CODE_GENERATION_PROMPT,
      input: prompt.trim(),
      text: {
        format: {
          type: "json_schema",
          name: "shippable_generated_code",
          strict: true,
          schema: GENERATED_CODE_JSON_SCHEMA,
        },
      },
    });

    if (!response.output_text) {
      return NextResponse.json(
        { error: "The AI did not return any code." },
        { status: 502 }
      );
    }

    const result = JSON.parse(response.output_text);

    if (
      !result ||
      typeof result.summary !== "string" ||
      !Array.isArray(result.files) ||
      result.files.length === 0 ||
      result.files.length > 8
    ) {
      return NextResponse.json(
        { error: "The AI returned an invalid file collection." },
        { status: 502 }
      );
    }

    const seenPaths = new Set<string>();

    for (const file of result.files) {
      if (
        !file ||
        typeof file.filename !== "string" ||
        typeof file.language !== "string" ||
        typeof file.content !== "string" ||
        !file.filename.trim() ||
        !file.content.trim() ||
        file.content.length > 50000
      ) {
        return NextResponse.json(
          { error: "The AI returned an invalid file." },
          { status: 502 }
        );
      }

      const path = file.filename.replace(/\\/g, "/");
      const parts = path.split("/");

      if (
        path.startsWith("/") ||
        /^[a-zA-Z]:/.test(path) ||
        parts.some((part: string) => !part || part === "." || part === "..") ||
        !/^[a-zA-Z0-9._/-]+$/.test(path) ||
        seenPaths.has(path)
      ) {
        return NextResponse.json(
          { error: "The AI returned an unsafe or duplicate filename." },
          { status: 502 }
        );
      }

      seenPaths.add(path);
      file.filename = path;
    }

    return NextResponse.json({
      summary: result.summary,
      files: result.files,
    });
  } catch (error) {
    console.error("Code generation API error:", error);

    return NextResponse.json(
      { error: "Code generation failed. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: versions, error } = await supabase
      .from("project_file_versions")
      .select("id, label, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load versions error:", error);
      return NextResponse.json(
        { error: "Could not load saved versions." },
        { status: 500 }
      );
    }

    return NextResponse.json({ versions: versions ?? [] });
  } catch (error) {
    console.error("Versions API error:", error);
    return NextResponse.json(
      { error: "Something went wrong while loading versions." },
      { status: 500 }
    );
  }
}

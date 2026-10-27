
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to preview this project." },
        { status: 401 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (projectError) {
      console.error("Preview project lookup failed:", projectError);
      return NextResponse.json(
        { error: "Could not load this project." },
        { status: 500 }
      );
    }

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const { data: files, error: filesError } = await supabase
      .from("generated_files")
      .select("filename, language, content")
      .eq("project_id", id)
      .order("filename");

    if (filesError) {
      console.error("Preview file lookup failed:", filesError);
      return NextResponse.json(
        { error: "Could not load project files." },
        { status: 500 }
      );
    }

    if (!files?.length) {
      return NextResponse.json(
        { error: "Generate and save project files before previewing." },
        { status: 400 }
      );
    }

    const totalBytes = files.reduce(
      (total, file) => total + Buffer.byteLength(file.content, "utf8"),
      0
    );

    if (files.length > 40 || totalBytes > 500_000) {
      return NextResponse.json(
        { error: "Project files exceed preview limits." },
        { status: 413 }
      );
    }

    return NextResponse.json({
      status: "ready",
      projectId: id,
      files,
    });
  } catch (error) {
    console.error("Preview API error:", error);

    return NextResponse.json(
      { error: "Could not prepare the project preview." },
      { status: 500 }
    );
  }
}

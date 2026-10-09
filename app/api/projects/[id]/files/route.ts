
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateGeneratedFiles } from "@/lib/projects/file-validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
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
        { error: "Please log in to access project files." },
        { status: 401 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (projectError) {
      return NextResponse.json(
        { error: "Could not verify project access." },
        { status: 500 }
      );
    }

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const { data: files, error } = await supabase
      .from("generated_files")
      .select("filename, language, content")
      .eq("project_id", id)
      .order("filename");

    if (error) {
      console.error("Load generated files error:", error.message);
      return NextResponse.json(
        { error: "Could not load project files." },
        { status: 500 }
      );
    }

    return NextResponse.json({ files: files ?? [] });
  } catch (error) {
    console.error("Load files API error:", error);

    return NextResponse.json(
      { error: "Could not load project files." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
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
        { error: "Please log in to save project files." },
        { status: 401 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (projectError) {
      return NextResponse.json(
        { error: "Could not verify project access." },
        { status: 500 }
      );
    }

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (!validateGeneratedFiles(body?.files)) {
      return NextResponse.json(
        { error: "The generated file collection is invalid." },
        { status: 400 }
      );
    }

    const totalSize = body.files.reduce(
      (total: number, file: { content: string }) =>
        total + file.content.length,
      0
    );

    if (totalSize > 200000) {
      return NextResponse.json(
        { error: "The generated files exceed the size limit." },
        { status: 400 }
      );
    }

    const rows = body.files.map(
      (file: { filename: string; language: string; content: string }) => ({
        project_id: id,
        filename: file.filename,
        language: file.language,
        content: file.content,
        updated_at: new Date().toISOString(),
      })
    );

    const { data: savedFiles, error } = await supabase
      .from("generated_files")
      .upsert(rows, {
        onConflict: "project_id,filename",
      })
      .select("filename, language, content");

    if (error) {
      console.error("Save generated files error:", error.message);
      return NextResponse.json(
        { error: "Could not save project files." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Project files saved.",
      files: savedFiles ?? [],
    });
  } catch (error) {
    console.error("Save files API error:", error);

    return NextResponse.json(
      { error: "Could not save project files." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
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
        { error: "Please log in to delete files." },
        { status: 401 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or access denied." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const filename = body?.filename;

    if (
      typeof filename !== "string" ||
      filename.length > 200 ||
      filename.includes("\\") ||
      filename.startsWith("/") ||
      !/^[a-zA-Z0-9._/-]+$/.test(filename) ||
      filename.split("/").some(
        (part: string) => !part || part === "." || part === ".."
      )
    ) {
      return NextResponse.json(
        { error: "Invalid filename." },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from("generated_files")
      .delete()
      .eq("project_id", id)
      .eq("filename", filename);

    if (deleteError) {
      console.error("File deletion error:", deleteError.message);
      return NextResponse.json(
        { error: "Could not delete the file." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "File deleted successfully.",
      filename,
    });
  } catch (error) {
    console.error("File deletion API error:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting the file." },
      { status: 500 }
    );
  }
}


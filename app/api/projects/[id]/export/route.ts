
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";
import { validateGeneratedFiles } from "@/lib/projects/file-validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Verify the logged-in user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in before downloading a project." },
        { status: 401 }
      );
    }

    // Verify that this project belongs to the logged-in user.
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or access denied." },
        { status: 404 }
      );
    }

    // Load the saved project files.
    const { data: files, error: filesError } = await supabase
      .from("generated_files")
      .select("filename, language, content")
      .eq("project_id", id)
      .order("filename", { ascending: true });

    if (filesError) {
      console.error("Export files error:", filesError);
      return NextResponse.json(
        { error: "Could not load project files." },
        { status: 500 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "This project has no saved files to download." },
        { status: 400 }
      );
    }

    if (!validateGeneratedFiles(files)) {
      return NextResponse.json(
        { error: "The project contains invalid files and cannot be exported." },
        { status: 400 }
      );
    }

    const totalSize = files.reduce(
      (total, file) => total + file.content.length,
      0
    );

    if (totalSize > 200_000) {
      return NextResponse.json(
        { error: "The project is too large to export." },
        { status: 413 }
      );
    }

    const zip = new JSZip();

    for (const file of files) {
      // Preserve the folder structure in the ZIP.
      zip.file(file.filename, file.content);
    }

    const zipData = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    // Keep the download filename safe.
    const safeName =
      project.name
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "shippable-project";

    return new Response(zipData as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeName}.zip"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Project export error:", error);

    return NextResponse.json(
      { error: "Something went wrong while exporting the project." },
      { status: 500 }
    );
  }
}

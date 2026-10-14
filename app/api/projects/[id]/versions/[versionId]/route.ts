import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; versionId: string }>;
  }
) {
  try {
    const { id, versionId } = await params;
    const supabase = await createClient();

    
    const { data: version, error: versionError } = await supabase
      .from("project_file_versions")
      .select("files")
      .eq("id", versionId)
      .eq("project_id", id)
      .single();

    if (versionError || !version) {
      return NextResponse.json(
        { error: "Saved version not found or access denied." },
        { status: 404 }
      );
    }

    const files = version.files;

  
    if (
      !Array.isArray(files) ||
      files.length === 0 ||
      files.length > 8 ||
      !files.every(
        (file) =>
          file &&
          typeof file.filename === "string" &&
          typeof file.language === "string" &&
          typeof file.content === "string" &&
          file.filename.length > 0 &&
          file.filename.length <= 200 &&
          file.content.length <= 50000 &&
          !file.filename.startsWith("/") &&
          !file.filename.includes("\\") &&
          !file.filename.split("/").includes("..")
      )
    ) {
      return NextResponse.json(
        { error: "This saved version contains invalid files." },
        { status: 400 }
      );
    }

   
    const { data: currentFiles, error: currentFilesError } =
  await supabase
    .from("generated_files")
    .select("filename, language, content")
    .eq("project_id", id);

    if (currentFilesError) {
      return NextResponse.json(
        { error: "Could not load the current project files." },
        { status: 500 }
      );
    }

    
if (currentFiles && currentFiles.length > 0) {
  const { error: backupError } = await supabase
    .from("project_file_versions")
    .insert({
      project_id: id,
      label: "Before restoring version",
      files: currentFiles,
    });

  if (backupError) {
    console.error("Recovery backup error:", backupError);

    return NextResponse.json(
      { error: "Could not protect the current files before restoring." },
      { status: 500 }
    );
  }
}

   
    const rows = files.map((file) => ({
      project_id: id,
      filename: file.filename,
      language: file.language,
      content: file.content,
      updated_at: new Date().toISOString(),
    }));

    const { error: saveError } = await supabase
      .from("generated_files")
      .upsert(rows, {
        onConflict: "project_id,filename",
      });

    if (saveError) {
      console.error("Restore save error:", saveError);

      return NextResponse.json(
        { error: "Could not restore the saved files." },
        { status: 500 }
      );
    }


    const savedNames = new Set(files.map((file) => file.filename));
    const obsoleteFiles = (currentFiles ?? []).filter(
      (file) => !savedNames.has(file.filename)
    );

    for (const file of obsoleteFiles) {
      const { error: deleteError } = await supabase
        .from("generated_files")
        .delete()
        .eq("project_id", id)
        .eq("filename", file.filename);

      if (deleteError) {
        console.error("Restore cleanup error:", deleteError);

        return NextResponse.json(
          {
            error:
              "Some files were restored, but cleanup was incomplete. Reload the project and check its files.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Saved version restored successfully.",
      files: rows.map(({ filename, language, content }) => ({
        filename,
        language,
        content,
      })),
    });
  } catch (error) {
    console.error("Restore version error:", error);

    return NextResponse.json(
      { error: "Something went wrong while restoring this version." },
      { status: 500 }
    );
  }
}

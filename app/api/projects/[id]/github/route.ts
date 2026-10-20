import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { decryptToken } from "@/lib/github/crypto";

export const runtime = "nodejs";

const GITHUB_API = "https://api.github.com";
const MAX_TOTAL_CHARS = 200_000;
const MAX_FILES = 100;

type RouteContext = {
  params: Promise<{ id: string }>;
};

function safePath(filename: string): string | null {
  const path = filename.replace(/\\/g, "/").replace(/^\/+/, "");

  if (
    !path ||
    path.length > 240 ||
    path.split("/").some(
      (part) =>
        !part ||
        part === "." ||
        part === ".." ||
        part.startsWith(".env") && part !== ".env.example"
    ) ||
    path.startsWith(".git/") ||
    path === ".git"
  ) {
    return null;
  }

  return path;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Verify the signed-in Shippable user.
    const supabase = await createClient();
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in to Shippable." },
        { status: 401 }
      );
    }

    // 2. Validate the request.
    const body = await request.json().catch(() => null);

    if (
      !body ||
      typeof body.repoName !== "string" ||
      !/^[A-Za-z0-9._-]{1,100}$/.test(body.repoName) ||
      body.repoName === "." ||
      body.repoName === ".." ||
      (body.description !== undefined &&
        (typeof body.description !== "string" ||
          body.description.length > 350)) ||
      (body.isPrivate !== undefined &&
        typeof body.isPrivate !== "boolean")
    ) {
      return NextResponse.json(
        { error: "Invalid repository details." },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    // 3. Verify project ownership before reading its files.
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    // if (projectError || !project) {
    //   return NextResponse.json(
    //     { error: "Project not found." },
    //     { status: 404 }
    //   );
    // }
    if (projectError) {
  console.error("GitHub project lookup error:", projectError.message);

  return NextResponse.json(
    { error: "Could not verify project access." },
    { status: 500 }
  );
}

if (!project) {
  console.error("GitHub project lookup returned no project:", {
    projectId: id,
    userId: user.id,
  });

  return NextResponse.json(
    { error: "Project not found or access denied." },
    { status: 404 }
  );
}

    const { data: generatedFiles, error: filesError } =
      await supabase
        .from("generated_files")
        .select("filename, content")
        .eq("project_id", project.id);

    if (filesError || !generatedFiles?.length) {
      return NextResponse.json(
        { error: "No generated project files were found." },
        { status: 400 }
      );
    }

    if (generatedFiles.length > MAX_FILES) {
      return NextResponse.json(
        { error: `A maximum of ${MAX_FILES} files can be uploaded at once.` },
        { status: 400 }
      );
    }

    // 4. Validate and prepare every path before creating the repository.
    const preparedFiles: { path: string; content: string }[] = [];
    const seen = new Set<string>();
    let totalChars = 0;

    for (const file of generatedFiles) {
      if (
        typeof file.filename !== "string" ||
        typeof file.content !== "string"
      ) {
        return NextResponse.json(
          { error: "A generated file has invalid data." },
          { status: 400 }
        );
      }

      let path = safePath(file.filename);

      if (!path) {
        return NextResponse.json(
          { error: "A generated file has an unsafe path." },
          { status: 400 }
        );
      }

      // Match the ZIP export structure for common Next.js root files.
      if (
        ["page.tsx", "layout.tsx", "globals.css"].includes(path)
      ) {
        path = `app/${path}`;
      }

      if (seen.has(path)) {
        return NextResponse.json(
          { error: "Two generated files have the same destination path." },
          { status: 400 }
        );
      }

      seen.add(path);
      totalChars += file.content.length;

      if (totalChars > MAX_TOTAL_CHARS) {
        return NextResponse.json(
          { error: "The generated project is too large to upload." },
          { status: 400 }
        );
      }

      preparedFiles.push({ path, content: file.content });
    }

    // 5. Load and decrypt this user's GitHub token on the server.
    const admin = createAdminClient();

    const { data: connection, error: connectionError } = await admin
      .from("github_connections")
      .select("github_username, access_token, token_expires_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (connectionError || !connection) {
      return NextResponse.json(
        { error: "Connect your GitHub account first." },
        { status: 400 }
      );
    }

    if (
      connection.token_expires_at &&
      new Date(connection.token_expires_at).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { error: "Your GitHub access token has expired. Reconnect GitHub." },
        { status: 401 }
      );
    }

    const token = decryptToken(connection.access_token);

    const githubHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // 6. Create a private repository by default.
    const repoResponse = await fetch(`${GITHUB_API}/user/repos`, {
      method: "POST",
      headers: {
        ...githubHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.repoName,
        // description:
        //   body.description ||
        //   `Generated with Shippable: ${project.title}`,
        description:
           body.description ||
           "Generated with Shippable AI Builder",
        private: body.isPrivate !== false,
        auto_init: false,
      }),
      cache: "no-store",
    });

    const repoData = await repoResponse.json().catch(() => null);

    if (!repoResponse.ok) {
      console.error("GitHub repository creation failed:", {
  status: repoResponse.status,
  message: repoData?.message,
  errors: repoData?.errors,
});
      if (repoResponse.status === 401) {
        return NextResponse.json(
          { error: "GitHub authorization expired or is invalid. Reconnect GitHub." },
          { status: 401 }
        );
      }

      if (repoResponse.status === 403) {
        return NextResponse.json(
          { error: "GitHub denied repository creation. Check your app permissions." },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error:
            repoResponse.status === 422
              ? "Repository name is unavailable or invalid."
              : "GitHub could not create the repository.",
        },
        { status: repoResponse.status >= 400 && repoResponse.status < 600
            ? repoResponse.status
            : 502 }
      );
    }

    const owner = repoData?.owner?.login;
    const repoName = repoData?.name;
    const repoUrl = repoData?.html_url;

    if (
      typeof owner !== "string" ||
      typeof repoName !== "string" ||
      typeof repoUrl !== "string"
    ) {
      return NextResponse.json(
        {
          error: "The repository was created, but GitHub returned incomplete details.",
        },
        { status: 502 }
      );
    }

    // 7. Upload files to the new repository.
    for (const file of preparedFiles) {
      const encodedPath = file.path
        .split("/")
        .map(encodeURIComponent)
        .join("/");

      const uploadResponse = await fetch(
        `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/contents/${encodedPath}`,
        {
          method: "PUT",
          headers: {
            ...githubHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Add ${file.path} via Shippable`,
            content: Buffer.from(file.content, "utf8").toString("base64"),
          }),
          cache: "no-store",
        }
      );

      if (!uploadResponse.ok) {
        console.error("GitHub file upload failed:", {
          path: file.path,
          status: uploadResponse.status,
        });

        return NextResponse.json(
          {
            error:
              `Repository created, but uploading ${file.path} failed. ` +
              "Some files may already have been uploaded.",
            repositoryUrl: repoUrl,
          },
          { status: 502 }
        );
      }
    }

    // Never return tokens to the browser.
    return NextResponse.json({
      message: "Repository created and project files uploaded.",
      repositoryUrl: repoUrl,
      repositoryName: repoName,
      githubUsername: owner,
      uploadedFiles: preparedFiles.length,
    });
  // } catch {
  //   return NextResponse.json(
  //     { error: "An unexpected error occurred while pushing to GitHub." },
  //     { status: 500 }
  //   );
  // }
  } catch (error) {
  console.error("GitHub push unexpected error:", error);

  return NextResponse.json(
    { error: "An unexpected error occurred while pushing to GitHub." },
    { status: 500 }
  );
}
}
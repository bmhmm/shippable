
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

    // const zip = new JSZip();

    // for (const file of files) {
    //   // Preserve the folder structure in the ZIP.
    //   zip.file(file.filename, file.content);
    // }
      const zip = new JSZip();

// Add the user's generated files without overwriting their content.
for (const file of files) {
  const filename = file.filename.replace(/\\/g, "/");
  zip.file(filename, file.content);
}

// Add the standard Next.js setup files only when missing.
const existingFiles = new Set(
  files.map((file) => file.filename.replace(/\\/g, "/"))
);

const setupFiles: Record<string, string> = {
  "package.json": JSON.stringify(
    {
      name: "shippable-project",
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "eslint .",
      },
      dependencies: {
        next: "^16.3.8",
        react: "^19.2.0",
        "react-dom": "^19.2.0",
      },
      devDependencies: {
        typescript: "^5",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        eslint: "^9",
        "eslint-config-next": "^16.3.8",
        tailwindcss: "^4",
        "@tailwindcss/postcss": "^4",
        postcss: "^8",
      },
    },
    null,
    2
  ),
  "tsconfig.json": JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: [
        "next-env.d.ts",
        ".next/types/**/*.ts",
        ".next/dev/types/**/*.ts",
        "**/*.ts",
        "**/*.tsx",
      ],
      exclude: ["node_modules"],
    },
    null,
    2
  ),
  "next.config.ts": `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
`,
  "postcss.config.mjs": `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`,
  "eslint.config.mjs": `import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
`,
  ".gitignore": `node_modules/
.next/
out/
build/
.env*
!.env.example
`,
};

for (const [filename, content] of Object.entries(setupFiles)) {
  if (!existingFiles.has(filename)) {
    zip.file(filename, content);
  }
}

// Put app files in the app/ folder if they were saved at the ZIP root.
for (const filename of ["globals.css", "layout.tsx", "page.tsx"]) {
  if (existingFiles.has(filename)) {
    const content = files.find(
      (file) => file.filename.replace(/\\/g, "/") === filename
    )?.content;

    if (content !== undefined) {
      zip.remove(filename);
      zip.file(`app/${filename}`, content);
    }
  }
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

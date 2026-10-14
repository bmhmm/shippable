
"use client";

import { useMemo, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import type { GeneratedFile } from "@/lib/ai/code-schema";

type LivePreviewProps = {
  files: GeneratedFile[];
};

function toSandpackFiles(files: GeneratedFile[]) {
  const result: Record<string, { code: string }> = {};

  for (const file of files) {
    
       const filename = file.filename.replace(/\\/g, "/");

    
    if (filename === "app/page.tsx" || filename === "page.tsx") {
      result["/App.tsx"] = { code: file.content };
    } else if (
      filename === "app/globals.css" ||
      filename === "globals.css"
    ) {
      result["/styles.css"] = { code: file.content };
    } else if (
      filename.startsWith("components/") ||
      filename.startsWith("app/components/")
    ) {
      result[`/${filename.replace(/^app\//, "")}`] = {
        code: file.content,
      };
    } else if (
      filename.endsWith(".tsx") ||
      filename.endsWith(".ts") ||
      filename.endsWith(".jsx") ||
      filename.endsWith(".js") ||
      filename.endsWith(".css")
    ) {
      result[`/${filename.replace(/^app\//, "")}`] = {
        code: file.content,
      };
    }
  }

  
  if (!result["/App.tsx"]) {
    result["/App.tsx"] = {
      code: `
export default function App() {
  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Preview unavailable</h1>
      <p>Generate an app/page.tsx file to preview this project.</p>
    </main>
  );
}
`,
    };
  }

  result["/index.tsx"] = {
    code: `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
  };

  if (!result["/styles.css"]) {
    result["/styles.css"] = { code: "body { margin: 0; }" };
  }

  return result;
}

export default function LivePreview({ files }: LivePreviewProps) {
  const [showConsole, setShowConsole] = useState(false);

  const sandpackFiles = useMemo(
    () => toSandpackFiles(files),
    [files]
  );

  if (files.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6">
        <h2 className="text-xl font-bold text-gray-900">Live preview</h2>
        <p className="mt-2 text-sm text-gray-600">
          Generate and save your application code to preview it here.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Live preview</h2>
          <p className="mt-1 text-sm text-gray-600">
            Browser sandbox for supported React code.
          </p>
        </div>

        <button
          onClick={() => setShowConsole((current) => !current)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          {showConsole ? "Hide console" : "Show console"}
        </button>
      </div>

      
 <SandpackProvider
  template="react-ts"
  files={sandpackFiles}
  customSetup={{
    entry: "/index.tsx",
  }}
>
        <SandpackLayout>
       
         <SandpackPreview
  showOpenInCodeSandbox={false}
  showRefreshButton
  style={{ height: 560 }}
/>
        </SandpackLayout>

        {showConsole && (
          <div className="mt-4 overflow-hidden rounded-lg border">
            <SandpackConsole />
          </div>
        )}
      </SandpackProvider>
    </section>
  );
}

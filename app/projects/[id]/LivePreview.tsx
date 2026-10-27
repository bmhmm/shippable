
// "use client";

// import { useMemo, useState } from "react";
// import {
//   SandpackProvider,
//   SandpackLayout,
//   SandpackPreview,
//   SandpackConsole,
// } from "@codesandbox/sandpack-react";
// import type { GeneratedFile } from "@/lib/ai/code-schema";

// type LivePreviewProps = {
//   files: GeneratedFile[];
// };

// function toSandpackFiles(files: GeneratedFile[]) {
//   const result: Record<string, { code: string }> = {};

//   for (const file of files) {
    
//        const filename = file.filename.replace(/\\/g, "/");

    
//     if (filename === "app/page.tsx" || filename === "page.tsx") {
//       result["/App.tsx"] = { code: file.content };
//     } else if (
//       filename === "app/globals.css" ||
//       filename === "globals.css"
//     ) {
//       result["/styles.css"] = { code: file.content };
//     } else if (
//       filename.startsWith("components/") ||
//       filename.startsWith("app/components/")
//     ) {
//       result[`/${filename.replace(/^app\//, "")}`] = {
//         code: file.content,
//       };
//     } else if (
//       filename.endsWith(".tsx") ||
//       filename.endsWith(".ts") ||
//       filename.endsWith(".jsx") ||
//       filename.endsWith(".js") ||
//       filename.endsWith(".css")
//     ) {
//       result[`/${filename.replace(/^app\//, "")}`] = {
//         code: file.content,
//       };
//     }
//   }

  
//   if (!result["/App.tsx"]) {
//     result["/App.tsx"] = {
//       code: `
// export default function App() {
//   return (
//     <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
//       <h1>Preview unavailable</h1>
//       <p>Generate an app/page.tsx file to preview this project.</p>
//     </main>
//   );
// }
// `,
//     };
//   }

//   result["/index.tsx"] = {
//     code: `
// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./styles.css";

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// `,
//   };

//   if (!result["/styles.css"]) {
//     result["/styles.css"] = { code: "body { margin: 0; }" };
//   }

//   return result;
// }

// export default function LivePreview({ files }: LivePreviewProps) {
//   const [showConsole, setShowConsole] = useState(false);

//   const sandpackFiles = useMemo(
//     () => toSandpackFiles(files),
//     [files]
//   );

//   if (files.length === 0) {
//     return (
//       <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6">
//         <h2 className="text-xl font-bold text-gray-900">Live preview</h2>
//         <p className="mt-2 text-sm text-gray-600">
//           Generate and save your application code to preview it here.
//         </p>
//       </section>
//     );
//   }

//   return (
//     <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-4 shadow-sm">
//       <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Live preview</h2>
//           <p className="mt-1 text-sm text-gray-600">
//             Browser sandbox for supported React code.
//           </p>
//         </div>

//         <button
//           onClick={() => setShowConsole((current) => !current)}
//           className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
//         >
//           {showConsole ? "Hide console" : "Show console"}
//         </button>
//       </div>

      
//  <SandpackProvider
//   template="react-ts"
//   files={sandpackFiles}
//   customSetup={{
//     entry: "/index.tsx",
//   }}
// >
//         <SandpackLayout>
       
//          <SandpackPreview
//   showOpenInCodeSandbox={false}
//   showRefreshButton
//   style={{ height: 560 }}
// />
//         </SandpackLayout>

//         {showConsole && (
//           <div className="mt-4 overflow-hidden rounded-lg border">
//             <SandpackConsole />
//           </div>
//         )}
//       </SandpackProvider>
//     </section>
//   );
// }









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

function normalizeFilename(filename: string) {
  return filename.replace(/\\/g, "/").replace(/^\/+/, "");
}

function relativeImport(fromFilename: string, target: string) {
  const fromDirectory = fromFilename.split("/").slice(0, -1);
  const targetParts = target.split("/").filter(Boolean);

  while (
    fromDirectory.length > 0 &&
    targetParts.length > 0 &&
    fromDirectory[0] === targetParts[0]
  ) {
    fromDirectory.shift();
    targetParts.shift();
  }

  const path = [
    ...fromDirectory.map(() => ".."),
    ...targetParts,
  ].join("/");

  return path.startsWith(".") ? path : `./${path}`;
}

function toSandpackFiles(files: GeneratedFile[]) {
  const result: Record<string, { code: string }> = {};
  const normalizedFiles = files.map((file) => ({
    ...file,
    filename: normalizeFilename(file.filename),
  }));

  for (const file of normalizedFiles) {
    const { filename } = file;

    // API routes and framework configuration files are not browser entry files.
    if (
      filename.startsWith("app/api/") ||
      filename.endsWith("/route.ts") ||
      filename === "next.config.ts" ||
      filename === "next.config.js" ||
      filename === "next.config.mjs" ||
      filename === "postcss.config.mjs" ||
      filename === "postcss.config.js" ||
      filename === "tailwind.config.ts" ||
      filename === "tailwind.config.js"
    ) {
      continue;
    }

    if (
      !/\.(tsx?|jsx?|css|json)$/.test(filename)
    ) {
      continue;
    }

    let content = file.content;

    // Resolve common root aliases such as "@/components/Header".
//     content = content.replace(
//       /(["'])@\/([^"']+)\1/g,
//       (_match, quote: string, target: string) =>
//         `${quote}${relativeImport(filename, target)}${quote}`
//     );
//     // Replace Next.js navigation imports with a preview-compatible shim.
// content = content.replace(
//   /(["'])next\/navigation\1/g,
//   (_match, quote: string) =>
//     `${quote}${relativeImport(filename, "__shims__/next-navigation")}${quote}`
// );

// Resolve common root aliases such as "@/components/Header".
content = content.replace(
  /(["'])@\/([^"']+)\1/g,
  (_match, quote: string, target: string) =>
    `${quote}${relativeImport(filename, target)}${quote}`
);

// Replace Next.js navigation imports with a preview-compatible shim.
content = content.replace(
  /(["'])next\/navigation\1/g,
  (_match, quote: string) =>
    `${quote}${relativeImport(filename, "__shims__/next-navigation")}${quote}`
);
    result[`/${filename}`] = { code: content };
  }

result["/__shims__/next-navigation.tsx"] = {
  code: `
import { useCallback } from "react";

export function useRouter() {
  const push = useCallback((url: string) => {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return {
    push,
    replace: push,
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    prefetch: async () => {},
  };
}

export function usePathname() {
  return window.location.pathname;
}

export function useSearchParams() {
  return new URLSearchParams(window.location.search);
}

export function useParams() {
  return {};
}
`,
};








  const pageFilename = normalizedFiles.some(
    (file) => file.filename === "app/page.tsx"
  )
    ? "app/page.tsx"
    : normalizedFiles.some((file) => file.filename === "app/page.jsx")
      ? "app/page.jsx"
      : normalizedFiles.some((file) => file.filename === "page.tsx")
        ? "page.tsx"
        : normalizedFiles.some((file) => file.filename === "page.jsx")
          ? "page.jsx"
          : null;

  if (pageFilename) {
    const pageImport = `./${pageFilename.replace(/\.(tsx?|jsx?)$/, "")}`;

    result["/App.tsx"] = {
      code: `
import Page from ${JSON.stringify(pageImport)};

export default function App() {
  return <Page />;
}
`,
    };
  } else {
    result["/App.tsx"] = {
      code: `
export default function App() {
  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Preview unavailable</h1>
      <p>
        This preview supports React pages. Generate an app/page.tsx
        or page.tsx file to preview this project.
      </p>
    </main>
  );
}
`,
    };
  }

  // Import global styles when the generated project provides them.
  const globalCss = normalizedFiles.find(
    (file) =>
      file.filename === "app/globals.css" ||
      file.filename === "app/global.css" ||
      file.filename === "globals.css"
  );

  if (globalCss) {
    const cssImport = relativeImport("App.tsx", globalCss.filename);
    result["/App.tsx"].code =
      `import ${JSON.stringify(cssImport)};\n` +
      result["/App.tsx"].code;
  } else {
    result["/styles.css"] = {
      code: "body { margin: 0; font-family: Arial, sans-serif; }",
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
        <h2 className="text-xl font-bold text-gray-900">
          Live preview
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Generate an application to preview supported React code here.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Live preview
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Browser sandbox for supported React code. Some Next.js features
            require a full Next.js runtime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowConsole((current) => !current)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 text-sm hover:bg-gray-50"
          aria-expanded={showConsole}
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
        options={{
          externalResources: [],
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

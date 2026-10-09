// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ProjectPage() {
//   const [prompt, setPrompt] = useState("");

//    const router = useRouter();

//   return (
//     <main className="min-h-screen bg-[#E8F5E9]">
//       <header className="border-b border-[#D1E7D5] bg-white">
//         <div className="flex h-16 items-center justify-between px-6">
//           <h1 className="text-xl font-bold text-gray-900">
//             Shippable
//           </h1>

//           {/* <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">

//             Dashboard
//           </button> */}
//            <button 
//   onClick={() => router.push("/dashboard")}
//   className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
// >
//   Dashboard
// </button>
//         </div>
//       </header>

//       <section className="px-6 py-10">
//         <div className="mx-auto max-w-4xl">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900">
//               Build with AI
//             </h2>

//             <p className="mt-2 text-gray-600">
//               Describe what you want Shippable to build.
//             </p>
//           </div>

//           <div className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
//             <textarea
//               value={prompt}
//               onChange={(event) => setPrompt(event.target.value)}
//               placeholder="Example: Build a task management application where users can create, edit, complete, and delete tasks..."
//               rows={8}
//               className="w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />

//             <div className="mt-4 flex items-center justify-between">
//               <p className="text-sm text-gray-500">
//                 Describe your application in plain English.
//               </p>

//               <button
//                 disabled={!prompt.trim()}
//                 className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Build with AI
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import AiPlan from "./AiPlan";

// export default function ProjectPage() {
//   const router = useRouter();

//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleBuild() {
//     if (!prompt.trim()) return;

//     setLoading(true);
//     setError("");
//     setResponse("");

//     try {
//       const response = await fetch("/api/ai", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Something went wrong.");
//       }

//       setResponse(data.response);
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Something went wrong."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen bg-[#E8F5E9]">
//       <header className="border-b border-[#D1E7D5] bg-white">
//         <div className="flex h-16 items-center justify-between px-6">
//           <h1 className="text-xl font-bold text-gray-900">
//             Shippable
//           </h1>

//           <button
//             onClick={() => router.push("/dashboard")}
//             className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//           >
//             Dashboard
//           </button>
//         </div>
//       </header>

//       <section className="px-6 py-10">
//         <div className="mx-auto max-w-4xl">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Build with AI
//           </h2>

//           <p className="mt-2 text-gray-600">
//             Describe what you want Shippable to build.
//           </p>

//           <div className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
//             <textarea
//               value={prompt}
//               onChange={(event) => setPrompt(event.target.value)}
//               placeholder="Example: Build a task management application where users can create, edit, complete, and delete tasks..."
//               rows={8}
//               className="w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />

//             <div className="mt-4 flex items-center justify-between">
//               <p className="text-sm text-gray-500">
//                 Describe your application in plain English.
//               </p>

//               {/* <button
//                 onClick={handleBuild}
//                 disabled={loading || !prompt.trim()}
//                 className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {loading ? "Thinking..." : "Build with AI"}
//               </button> */}
//      <button
//   onClick={handleBuild}
//   disabled={loading || !prompt.trim()}
//   className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
// >
//   {loading ? "Thinking..." : "✨ Build with AI"}
// </button>
//             </div>

//             {error && (
//               <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
//                 {error}
//               </div>
//             )}
//                <AiPlan response={response} />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AiPlan from "./AiPlan";
import GeneratedFiles from "./GeneratedFiles";
import type { GeneratedFile } from "@/lib/ai/code-schema";

type ApiResponse = {
  response?: string;
  summary?: string;
  files?: GeneratedFile[];
  error?: string;
};

async function readApiResponse(
  response: Response
): Promise<ApiResponse> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "The server returned an unexpected response. Check the terminal for the API error."
    );
  }

  return response.json();
}

export default function ProjectPage() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [error, setError] = useState("");

  async function handlePlan() {
    if (!prompt.trim()) return;

    setLoadingPlan(true);
    setError("");
    setPlan("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Could not generate a plan.");
      }

      setPlan(data.response ?? "");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleGenerateCode() {
    if (!prompt.trim()) return;

    setGeneratingCode(true);
    setError("");
    setSummary("");
    setFiles([]);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Could not generate code.");
      }

      if (!data.files || data.files.length === 0) {
        throw new Error("The AI did not return any files.");
      }

      setSummary(data.summary ?? "Starter files generated.");
      setFiles(data.files);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setGeneratingCode(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#E8F5E9]">
      <header className="border-b border-[#D1E7D5] bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-900">
            Shippable
          </h1>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </button>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-800">
            AI application builder
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Turn your idea into code
          </h2>

          <p className="mt-2 max-w-2xl leading-7 text-gray-600">
            Describe the application you want to build. First create a plan,
            or generate a set of starter files to inspect.
          </p>

          <div className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
            <label
              htmlFor="app-prompt"
              className="mb-3 block text-sm font-semibold text-gray-900"
            >
              What do you want to build?
            </label>

            <textarea
              id="app-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: Build a responsive task manager with a task list, a form to add tasks, and controls to mark tasks complete."
              rows={7}
              maxLength={8000}
              className="w-full resize-y rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
              <span>Be specific about the features and design you want.</span>
              <span>{prompt.length}/8000</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handlePlan}
                disabled={!prompt.trim() || loadingPlan || generatingCode}
                className="rounded-lg border border-green-700 px-5 py-3 font-medium text-green-800 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingPlan ? "Creating plan..." : "Generate plan"}
              </button>

              <button
                onClick={handleGenerateCode}
                disabled={!prompt.trim() || loadingPlan || generatingCode}
                className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generatingCode ? "Generating files..." : "Generate code"}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}
          </div>

          {plan && <AiPlan response={plan} />}

          {files.length > 0 && (
            <GeneratedFiles summary={summary} files={files} />
          )}
        </div>
      </section>
    </main>
  );
}

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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectPage() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuild() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResponse(data.response);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
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
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900">
            Build with AI
          </h2>

          <p className="mt-2 text-gray-600">
            Describe what you want Shippable to build.
          </p>

          <div className="mt-8 rounded-2xl border border-[#D1E7D5] bg-white p-6 shadow-sm">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: Build a task management application where users can create, edit, complete, and delete tasks..."
              rows={8}
              className="w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Describe your application in plain English.
              </p>

              {/* <button
                onClick={handleBuild}
                disabled={loading || !prompt.trim()}
                className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Build with AI"}
              </button> */}
     <button
  onClick={handleBuild}
  disabled={loading || !prompt.trim()}
  className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
>
  {loading ? "Thinking..." : "✨ Build with AI"}
</button>
            </div>

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {response && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Shippable's plan
                </h3>

                <div className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-700">
                  {response}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
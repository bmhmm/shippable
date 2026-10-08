// "use client";

// import { FormEvent, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function NewProjectPage() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [stack, setStack] = useState("Next.js");

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     console.log({
//       name,
//       description,
//       stack,
//     });

//     // For now, just go back to the dashboard.
//     // We'll save the project to Supabase later.
//     router.push("/dashboard");
//   }

//   return (
//     <main className="min-h-screen bg-[#E8F5E9] px-6 py-10">
//       <div className="mx-auto max-w-2xl">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.push("/dashboard")}
//             className="text-sm text-gray-600 hover:text-gray-900"
//           >
//             ← Back to dashboard
//           </button>

//           <h1 className="mt-6 text-3xl font-bold text-gray-900">
//             Create a new project
//           </h1>

//           <p className="mt-2 text-gray-600">
//             Tell Shippable what you want to build.
//           </p>
//         </div>

//         {/* Form */}
//         <div className="rounded-2xl border border-[#D1E7D5] bg-white p-8 shadow-sm">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Project name */}
//             <div>
//               <label
//                 htmlFor="name"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Project name
//               </label>

//               <input
//                 id="name"
//                 type="text"
//                 value={name}
//                 onChange={(event) => setName(event.target.value)}
//                 placeholder="My awesome app"
//                 required
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 What do you want to build?
//               </label>

//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(event) => setDescription(event.target.value)}
//                 placeholder="A task management application where users can create and manage tasks..."
//                 rows={5}
//                 required
//                 className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             {/* Stack */}
//             <div>
//               <label
//                 htmlFor="stack"
//                 className="mb-2 block text-sm font-medium text-gray-700"
//               >
//                 Technology stack
//               </label>

//               <select
//                 id="stack"
//                 value={stack}
//                 onChange={(event) => setStack(event.target.value)}
//                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="Next.js">
//                   Next.js + TypeScript + Tailwind + Supabase
//                 </option>
//               </select>

//               <p className="mt-2 text-sm text-gray-500">
//                 More technology stacks will be available later.
//               </p>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={() => router.push("/dashboard")}
//                 className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
//               >
//                 Create Project
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }



"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stack, setStack] = useState("Next.js");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createClient();

    // Get the currently logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create a project.");
      setLoading(false);
      return;
    }

    // Save the project to Supabase
    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name,
      description,
      stack,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Project was created successfully
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#E8F5E9] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to dashboard
          </button>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Create a new project
          </h1>

          <p className="mt-2 text-gray-600">
            Tell Shippable what you want to build.
          </p>
        </div>

        <div className="rounded-2xl border border-[#D1E7D5] bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Project name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="My awesome app"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                What do you want to build?
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="A task management application where users can create and manage tasks..."
                rows={5}
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="stack"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Technology stack
              </label>

              <select
                id="stack"
                value={stack}
                onChange={(event) => setStack(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="Next.js">
                  Next.js + TypeScript + Tailwind + Supabase
                </option>
              </select>

              <p className="mt-2 text-sm text-gray-500">
                More technology stacks will be available later.
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
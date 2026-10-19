
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/app/components/sidebar";

// type Project = {
//   id: string;
//   name: string;
//   description: string;
//   stack: string;
//   created_at: string;
// };

// export default function ProjectsPage() {
//   const router = useRouter();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadProjects() {
//       const supabase = createClient();

//       const { data, error } = await supabase
//         .from("projects")
//         .select("id, name, description, stack, created_at")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error loading projects:", error.message);
//       } else {
//         setProjects(data ?? []);
//       }

//       setLoading(false);
//     }

//     loadProjects();
//   }, []);

//   async function handleLogout() {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     router.push("/login");
//     router.refresh();
//   }

//   return (
//     <main className="min-h-screen bg-[#E8F5E9]">
//       <header className="border-b border-[#D1E7D5] bg-white">
//         <div className="flex h-16 items-center justify-between px-6">
//           <Link href="/dashboard" className="text-xl font-bold text-gray-900">
//             Shippable
//           </Link>

//           <button
//             onClick={handleLogout}
//             className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//           >
//             Log out
//           </button>
//         </div>
//       </header>

//       <div className="flex min-h-[calc(100vh-4rem)]">
//         <aside className="w-60 border-r border-[#D1E7D5] bg-white p-4">
//           <nav className="space-y-2">
//             <Link
//               href="/dashboard"
//               className="block w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
//             >
//               Dashboard
//             </Link>

//             <Link
//               href="/projects"
//               className="block w-full rounded-lg bg-green-100 px-4 py-3 text-left text-sm font-medium text-green-800"
//             >
//               Projects
//             </Link>

//             <button
//               className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
//             >
//               Settings
//             </button>
//           </nav>
//         </aside>

//         <section className="flex-1 p-8">
//           <div className="mx-auto max-w-6xl">
//             <div className="flex items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   Projects
//                 </h2>
//                 <p className="mt-2 text-gray-600">
//                   View and continue building your applications.
//                 </p>
//               </div>

//               <button
//                 onClick={() => router.push("/projects/new")}
//                 className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
//               >
//                 + New Project
//               </button>
//             </div>

//             {loading ? (
//               <div className="mt-10 rounded-xl border border-[#D1E7D5] bg-white p-12 text-center">
//                 <p className="text-gray-500">Loading projects...</p>
//               </div>
//             ) : projects.length === 0 ? (
//               <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   No projects yet
//                 </h3>
//                 <p className="mt-2 text-sm text-gray-500">
//                   Create your first project to get started.
//                 </p>
//                 <button
//                   onClick={() => router.push("/projects/new")}
//                   className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
//                 >
//                   Create your first project
//                 </button>
//               </div>
//             ) : (
//               <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                   <Link
//                     key={project.id}
//                     href={`/projects/${project.id}`}
//                     className="block rounded-xl border border-[#D1E7D5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//                   >
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {project.name}
//                     </h3>

//                     <p className="mt-2 text-sm leading-6 text-gray-600">
//                       {project.description}
//                     </p>

//                     <div className="mt-4">
//                       <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
//                         {project.stack}
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }








// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/app/components/sidebar";

// type Project = {
//   id: string;
//   name: string;
//   description: string;
//   stack: string;
//   created_at: string;
// };

// export default function ProjectsPage() {
//   const router = useRouter();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadProjects() {
//       const supabase = createClient();

//       const { data, error } = await supabase
//         .from("projects")
//         .select("id, name, description, stack, created_at")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error loading projects:", error.message);
//       } else {
//         setProjects(data ?? []);
//       }

//       setLoading(false);
//     }

//     loadProjects();
//   }, []);

//   async function handleLogout() {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     router.push("/login");
//     router.refresh();
//   }

//   return (
//     <main className="min-h-screen bg-[#F4F9F5]">
//       {/* Header */}
//       <header className="sticky top-0 z-10 border-b border-emerald-800 bg-emerald-900 text-white shadow-md">
//         <div className="flex h-16 items-center justify-between px-6">
//           <Link href="/dashboard" className="text-xl font-bold tracking-tight text-white">
//             Shippable
//           </Link>

//           <button
//             onClick={handleLogout}
//             className="rounded-lg border border-emerald-700 bg-emerald-800 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white"
//           >
//             Log out
//           </button>
//         </div>
//       </header>

//       <div className="flex min-h-[calc(100vh-4rem)] items-start">
//         {/* Reusable Green Sidebar Component */}
//         <Sidebar />

//         {/* Main Content Area */}
//         <section className="flex-1 p-8">
//           <div className="mx-auto max-w-6xl">
//             <div className="flex items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900">
//                   Projects
//                 </h2>
//                 <p className="mt-2 text-gray-600">
//                   View and continue building your applications.
//                 </p>
//               </div>

//               <button
//                 onClick={() => router.push("/projects/new")}
//                 className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-emerald-700"
//               >
//                 + New Project
//               </button>
//             </div>

//             {loading ? (
//               <div className="mt-10 rounded-xl border border-emerald-100 bg-white p-12 text-center shadow-2xs">
//                 <p className="text-gray-500">Loading projects...</p>
//               </div>
//             ) : projects.length === 0 ? (
//               <div className="mt-10 rounded-xl border border-dashed border-emerald-200 bg-white p-12 text-center shadow-2xs">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   No projects yet
//                 </h3>
//                 <p className="mt-2 text-sm text-gray-500">
//                   Create your first project to get started.
//                 </p>
//                 <button
//                   onClick={() => router.push("/projects/new")}
//                   className="mt-6 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700"
//                 >
//                   Create your first project
//                 </button>
//               </div>
//             ) : (
//               <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                   <Link
//                     key={project.id}
//                     href={`/projects/${project.id}`}
//                     className="block rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//                   >
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {project.name}
//                     </h3>

//                     <p className="mt-2 text-sm leading-6 text-gray-600">
//                       {project.description}
//                     </p>

//                     <div className="mt-4">
//                       <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
//                         {project.stack}
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }








// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/app/components/sidebar";
// import Navbar from "@/app/components/navbar"; // <-- Import the same Navbar

// type Project = {
//   id: string;
//   name: string;
//   description: string;
//   stack: string;
//   created_at: string;
// };

// export default function ProjectsPage() {
//   const router = useRouter();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadProjects() {
//       const supabase = createClient();

//       const { data, error } = await supabase
//         .from("projects")
//         .select("id, name, description, stack, created_at")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error loading projects:", error.message);
//       } else {
//         setProjects(data ?? []);
//       }

//       setLoading(false);
//     }

//     loadProjects();
//   }, []);

//   return (
//     <main className="min-h-screen bg-[#F4F9F5]">
//       {/* Top Navbar - Matches Dashboard Exactly */}
//       <Navbar />

//       <div className="flex min-h-[calc(100vh-4rem)] items-start">
//         {/* Sticky Green Sidebar */}
//         <Sidebar />

//         {/* Main Projects Section */}
//         <section className="flex-1 p-8">
//           <div className="mx-auto max-w-6xl">
//             <div className="flex items-center justify-between gap-4">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
//                 <p className="mt-2 text-gray-600">
//                   View and continue building your applications.
//                 </p>
//               </div>

//               <button
//                 onClick={() => router.push("/projects/new")}
//                 className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white shadow-xs hover:bg-emerald-700"
//               >
//                 + New Project
//               </button>
//             </div>

//             {loading ? (
//               <div className="mt-10 rounded-xl border border-emerald-100 bg-white p-12 text-center shadow-2xs">
//                 <p className="text-gray-500">Loading projects...</p>
//               </div>
//             ) : projects.length === 0 ? (
//               <div className="mt-10 rounded-xl border border-dashed border-emerald-200 bg-white p-12 text-center shadow-2xs">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   No projects yet
//                 </h3>
//                 <p className="mt-2 text-sm text-gray-500">
//                   Create your first project to get started.
//                 </p>
//                 <button
//                   onClick={() => router.push("/projects/new")}
//                   className="mt-6 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700"
//                 >
//                   Create your first project
//                 </button>
//               </div>
//             ) : (
//               <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                   <Link
//                     key={project.id}
//                     href={`/projects/${project.id}`}
//                     className="block rounded-xl border border-emerald-100 bg-white p-6 shadow-2xs transition hover:-translate-y-1 hover:shadow-md"
//                   >
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {project.name}
//                     </h3>

//                     <p className="mt-2 text-sm leading-6 text-gray-600">
//                       {project.description}
//                     </p>

//                     <div className="mt-4">
//                       <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
//                         {project.stack}
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }









"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Navbar from "@/app/components/navbar";

type Project = {
  id: string;
  name: string;
  description: string;
  stack: string;
  created_at: string;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, stack, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error.message);
      } else {
        setProjects(data ?? []);
      }

      setLoading(false);
    }

    loadProjects();
  }, []);

  return (
    <main className="min-h-screen bg-[#F4F9F5]">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex min-h-[calc(100vh-4rem)] items-start">
        {/* Sticky Green Sidebar */}
        <Sidebar />

        {/* Main Projects Workspace */}
        <section className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Projects
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and continue building your applications.
                </p>
              </div>

              <button
                onClick={() => router.push("/projects/new")}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Project
              </button>
            </div>

            {/* Projects Grid Container */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  All Projects
                </h3>
                {projects.length > 0 && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {projects.length} Total
                  </span>
                )}
              </div>

              {loading ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white/70 p-16 text-center backdrop-blur-xs">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent"></div>
                  <p className="mt-4 text-sm font-medium text-gray-500">
                    Loading your projects...
                  </p>
                </div>
              ) : projects.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 bg-white p-12 text-center shadow-2xs">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="mt-4 text-base font-semibold text-gray-900">
                    No projects yet
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Create your first project to get started.
                  </p>
                  <button
                    onClick={() => router.push("/projects/new")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="group relative flex flex-col justify-between rounded-2xl border border-emerald-100/80 bg-white p-6 shadow-2xs transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                    >
                      <div>
                        {/* Card Header Icon & Arrow */}
                        <div className="flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                              />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                            View &rarr;
                          </span>
                        </div>

                        {/* Project Title */}
                        <h4 className="mt-4 text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {project.name}
                        </h4>

                        {/* Description */}
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {project.description || "No description provided."}
                        </p>
                      </div>

                      {/* Card Footer: Stack Badge & Date */}
                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                        {project.stack ? (
                          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {project.stack}
                          </span>
                        ) : (
                          <span></span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
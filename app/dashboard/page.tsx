// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// type Project = {
//   id: string;
//   name: string;
//   created_at: string;
// };

// export default function DashboardPage() {
//   const router = useRouter();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadProjects() {
//       const supabase = createClient();

//       const { data, error } = await supabase
//         .from("projects")
//         .select("id, name, created_at")
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
//               className="block w-full rounded-lg bg-green-100 px-4 py-3 text-left text-sm font-medium text-green-800"
//             >
//               Dashboard
//             </Link>

//             <Link
//               href="/projects"
//               className="block w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
//             >
//               Projects
//             </Link>

//             <button
//               onClick={() => router.push("/settings")}
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
//                   Dashboard
//                 </h2>
//                 <p className="mt-2 text-gray-600">
//                   Build, manage, and ship your applications.
//                 </p>
//               </div>

//               <button
//                 onClick={() => router.push("/projects/new")}
//                 className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
//               >
//                 + New Project
//               </button>
//             </div>

//             <div className="mt-10">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Your Projects
//               </h3>

//               {loading ? (
//                 <div className="mt-4 rounded-xl border border-[#D1E7D5] bg-white p-12 text-center">
//                   <p className="text-gray-500">Loading projects...</p>
//                 </div>
//               ) : projects.length === 0 ? (
//                 <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
//                   <h4 className="text-lg font-semibold text-gray-900">
//                     No projects yet
//                   </h4>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Create your first project and start building with AI.
//                   </p>
//                   <button
//                     onClick={() => router.push("/projects/new")}
//                     className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
//                   >
//                     Create your first project
//                   </button>
//                 </div>
//               ) : (
//                 <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   {projects.map((project) => (
//                     <Link
//                       key={project.id}
//                       href={`/projects/${project.id}`}
//                       className="block rounded-xl border border-[#D1E7D5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//                     >
//                       <h4 className="font-semibold text-gray-900">
//                         {project.name}
//                       </h4>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
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

type Project = {
  id: string;
  name: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInitial, setUserInitial] = useState<string>("");

  useEffect(() => {
    async function loadDashboardData() {
      const supabase = createClient();

      // Get current user email to derive the initial
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserInitial(user.email.charAt(0).toUpperCase());
      }

      // Fetch projects
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error.message);
      } else {
        setProjects(data ?? []);
      }

      setLoading(false);
    }

    loadDashboardData();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#F4F9F5]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 border-b border-emerald-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white shadow-sm shadow-emerald-200">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Shippable
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* User Avatar with Initial from Email */}
            {userInitial && (
              <div
                title="Signed in user"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 font-semibold text-emerald-800 shadow-xs"
              >
                {userInitial}
              </div>
            )}

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 shadow-2xs"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
 
      <div className="flex min-h-[calc(100vh-4rem)] items-start">
        {/* Sidebar */}
        {/* <aside className="w-64 border-r border-emerald-100/60 bg-white p-5 shadow-2xs">
          <nav className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-800 transition shadow-2xs"
            >
              <svg
                className="h-5 w-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Dashboard
            </Link>

            <Link
              href="/projects"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-emerald-50/50 hover:text-emerald-700"
            >
              <svg
                className="h-5 w-5 text-gray-400"
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
              Projects
            </Link>

            <button
              onClick={() => router.push("/settings")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-emerald-50/50 hover:text-emerald-700"
            >
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </nav>
        </aside> */}


        {/* Sidebar */}
        {/* <aside className="w-64 border-r border-emerald-800 bg-emerald-900 p-5 shadow-2xs text-white"> */}
         {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-emerald-800 bg-emerald-900 p-5 shadow-2xs text-white">
          <nav className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition shadow-2xs"
            >
              <svg
                className="h-5 w-5 text-emerald-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Dashboard
            </Link>

            <Link
              href="/projects"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-800/60 hover:text-white"
            >
              <svg
                className="h-5 w-5 text-emerald-300"
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
              Projects
            </Link>

            <button
              onClick={() => router.push("/settings")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-emerald-100 transition hover:bg-emerald-800/60 hover:text-white"
            >
              <svg
                className="h-5 w-5 text-emerald-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </nav>
        </aside>

        {/* Main Workspace */}
        <section className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">
            {/* Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Dashboard
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Build, manage, and ship your applications with ease.
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

            {/* Projects Container */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Your Projects
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
                    Loading your workspace...
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
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="mt-4 text-base font-semibold text-gray-900">
                    No projects created yet
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Create your first project and start building with AI.
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
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                            View &rarr;
                          </span>
                        </div>

                        <h4 className="mt-4 text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {project.name}
                        </h4>
                      </div>

                      <div className="mt-6 border-t border-gray-100 pt-3 text-xs text-gray-400">
                        Created {new Date(project.created_at).toLocaleDateString()}
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
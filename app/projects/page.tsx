
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#E8F5E9]">
      <header className="border-b border-[#D1E7D5] bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            Shippable
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-60 border-r border-[#D1E7D5] bg-white p-4">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/projects"
              className="block w-full rounded-lg bg-green-100 px-4 py-3 text-left text-sm font-medium text-green-800"
            >
              Projects
            </Link>

            <button
              className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
            >
              Settings
            </button>
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Projects
                </h2>
                <p className="mt-2 text-gray-600">
                  View and continue building your applications.
                </p>
              </div>

              <button
                onClick={() => router.push("/projects/new")}
                className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
              >
                + New Project
              </button>
            </div>

            {loading ? (
              <div className="mt-10 rounded-xl border border-[#D1E7D5] bg-white p-12 text-center">
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  No projects yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create your first project to get started.
                </p>
                <button
                  onClick={() => router.push("/projects/new")}
                  className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block rounded-xl border border-[#D1E7D5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {project.description}
                    </p>

                    <div className="mt-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        {project.stack}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

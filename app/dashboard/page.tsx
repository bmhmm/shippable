"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#E8F5E9]">
      {/* Top bar */}
      <header className="border-b border-[#D1E7D5] bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-900">
            Shippable
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-60 border-r border-[#D1E7D5] bg-white p-4">
          <nav className="space-y-2">
            <button className="w-full rounded-lg bg-green-100 px-4 py-3 text-left text-sm font-medium text-green-800">
              Dashboard
            </button>

            <button className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100">
              Projects
            </button>

            <button className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100">
              Settings
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <section className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Dashboard
                </h2>

                <p className="mt-2 text-gray-600">
                  Build, manage, and ship your applications.
                </p>
              </div>

             <button
                  onClick={() => router.push("/projects/new")}
                  className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
             >
                + New Project
             </button>
            </div>

            {/* Projects */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Projects
              </h3>

              <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <h4 className="text-lg font-semibold text-gray-900">
                  No projects yet
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Create your first project and start building with AI.
                </p>

                <button className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800">
                  Create your first project
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
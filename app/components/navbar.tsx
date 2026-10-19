"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [userInitial, setUserInitial] = useState<string>("");

  useEffect(() => {
    async function getUserData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserInitial(user.email.charAt(0).toUpperCase());
      }
    }

    getUserData();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        {/* Brand Logo & Name */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-extrabold text-white shadow-xs">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Shippable
          </span>
        </Link>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* User Initial Avatar Badge */}
          {userInitial && (
            <div
              title="Signed in user"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 font-semibold text-emerald-800 shadow-2xs text-sm"
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
  );
}
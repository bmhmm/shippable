// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const isActive = (path: string) => pathname === path;

//   return (
//     <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-emerald-800 bg-emerald-900 p-5 text-white">
//       <nav className="space-y-1.5">
//         <Link
//           href="/dashboard"
//           className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
//             isActive("/dashboard")
//               ? "bg-emerald-800 text-white"
//               : "text-emerald-100 hover:bg-emerald-800/60 hover:text-white"
//           }`}
//         >
//           Dashboard
//         </Link>

//         <Link
//           href="/projects"
//           className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
//             isActive("/projects")
//               ? "bg-emerald-800 text-white font-semibold"
//               : "text-emerald-100 hover:bg-emerald-800/60 hover:text-white"
//           }`}
//         >
//           Projects
//         </Link>

//         <button
//           onClick={() => router.push("/settings")}
//           className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
//             isActive("/settings")
//               ? "bg-emerald-800 text-white font-semibold"
//               : "text-emerald-100 hover:bg-emerald-800/60 hover:text-white"
//           }`}
//         >
//           Settings
//         </button>
//       </nav>
//     </aside>
//   );
// }





"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-emerald-800 bg-emerald-900 p-5 text-white">
      <nav className="space-y-1.5">
        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/dashboard")
              ? "bg-emerald-800/80 text-white shadow-2xs"
              : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
          }`}
        >
          {/* Dashboard Icon */}
          <svg className="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>

        {/* Projects Link */}
        <Link
          href="/projects"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/projects")
              ? "bg-emerald-800/80 text-white shadow-2xs"
              : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
          }`}
        >
          {/* Folder / Projects Icon */}
          <svg className="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Projects
        </Link>

        {/* Settings Button */}
        <button
          onClick={() => router.push("/settings")}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
            isActive("/settings")
              ? "bg-emerald-800/80 text-white shadow-2xs"
              : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
          }`}
        >
          {/* Settings Icon */}
          <svg className="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </nav>
    </aside>
  );
}
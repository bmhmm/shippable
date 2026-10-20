import Link from "next/link";
import { CheckCircle2, ArrowLeft,ShieldCheck } from "lucide-react";
import { FaGithub } from "react-icons/fa";

type Props = {
  searchParams: Promise<{
    username?: string;
    returnTo?: string;
  }>;
};

export default async function GitHubSuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  const username = params.username || "your GitHub account";

  const requestedReturnTo = params.returnTo || "/dashboard";
  const returnTo =
    requestedReturnTo.startsWith("/") &&
    !requestedReturnTo.startsWith("//") &&
    !requestedReturnTo.startsWith("/\\")
      ? requestedReturnTo
      : "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-5 py-12 text-gray-900">
      <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl shadow-gray-200/50 sm:p-12">
        <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#171717] text-white shadow-lg">
            <FaGithub size={38} strokeWidth={1.8} />
          </div>

          <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-green-500 text-white">
            <CheckCircle2 size={21} strokeWidth={2.5} />
          </span>
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
          Connection complete
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          GitHub connected!
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
          Your GitHub account is now connected to Shippable. You can continue
          building your project and publish its files to a repository.
        </p>

        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-gray-800 shadow-sm">
            <FaGithub size={25} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Connected account</p>
            <p className="mt-1 truncate font-semibold">@{username}</p>
          </div>

          <CheckCircle2 className="shrink-0 text-green-600" size={22} />
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-green-50 p-4 text-left">
          <ShieldCheck className="mt-0.5 shrink-0 text-green-700" size={20} />
          <p className="text-sm leading-5 text-green-900">
            Your connection is ready. Head back to Shippable to continue.
          </p>
        </div>

        <Link
          href={returnTo}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          <ArrowLeft size={18} />
          Back to your project
        </Link>

        <p className="mt-5 text-xs text-gray-400">
          Connected securely with GitHub
        </p>
      </section>
    </main>
  );
}





// import Link from "next/link";
// import { CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";
// import { FaGithub } from "react-icons/fa";

// type Props = {
//   searchParams: Promise<{
//     username?: string;
//     returnTo?: string;
//   }>;
// };

// export default async function GitHubSuccessPage({ searchParams }: Props) {
//   const params = await searchParams;

//   const username = params.username || "your GitHub account";

//   const requestedReturnTo = params.returnTo || "/dashboard";
//   const returnTo =
//     requestedReturnTo.startsWith("/") &&
//     !requestedReturnTo.startsWith("//") &&
//     !requestedReturnTo.startsWith("/\\")
//       ? requestedReturnTo
//       : "/dashboard";

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[#F4F9F5] px-4 py-6 text-gray-900">
//       <section className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-lg shadow-emerald-900/5 sm:p-8">
//         {/* Top GitHub Avatar & Check Badge */}
//         <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#171717] text-white shadow-md">
//             <FaGithub size={32} />
//           </div>

//           <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-3 border-white bg-emerald-600 text-white">
//             <CheckCircle2 size={18} strokeWidth={2.5} />
//           </span>
//         </div>

//         {/* Status Header */}
//         <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
//           Connection complete
//         </p>

//         <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
//           GitHub connected!
//         </h1>

//         <p className="mx-auto mt-2 max-w-xs text-xs text-gray-500 sm:text-sm">
//           Your GitHub account is now connected to Shippable. You can continue
//           building your project.
//         </p>

//         {/* Connected Account Details */}
//         <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-800 shadow-2xs">
//             <FaGithub size={20} />
//           </div>

//           <div className="min-w-0 flex-1">
//             <p className="text-[11px] text-gray-500">Connected account</p>
//             <p className="truncate text-sm font-semibold text-gray-900">
//               @{username}
//             </p>
//           </div>

//           <CheckCircle2 className="shrink-0 text-emerald-600" size={18} />
//         </div>

//         {/* Security / Status Banner */}
//         <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3 text-left">
//           <ShieldCheck className="mt-0.5 shrink-0 text-emerald-700" size={18} />
//           <p className="text-xs leading-4 text-emerald-900">
//             Your connection is ready. Head back to Shippable to continue.
//           </p>
//         </div>

//         {/* Return Button */}
//         <Link
//           href={returnTo}
//           className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 shadow-sm"
//         >
//           <ArrowLeft size={16} />
//           Back to your project
//         </Link>

//         <p className="mt-3 text-[11px] text-gray-400">
//           Connected securely with GitHub
//         </p>
//       </section>
//     </main>
//   );
// }
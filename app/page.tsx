import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold tracking-tight">
          Shippable
        </div>

        <div className="flex items-center gap-6">
          <button className="text-sm text-gray-300 hover:text-white">
            Login
          </button>

         <Link
            href="/signup"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-200"
          >
                 Get Started
         </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-gray-800 px-4 py-2 text-sm text-gray-400">
          AI-powered application builder
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Build. Test. Secure. Ship.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Build real applications with AI. Choose your technology stack,
          describe what you want, and turn your idea into a shippable product.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-gray-200">
            Start Building
          </button>

          <button className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-900">
            See How It Works
          </button>
        </div>
      </section>
    </main>
  );
}
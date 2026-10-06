"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

//   async function handleSignup(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     setError("");
//     setMessage("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     setLoading(true);

//     const supabase = createClient();

//     // const { error } = await supabase.auth.signUp({
//     //   email,
//     //   password,
//     //   //disabling email confirmation
//     // //   options: {
//     // //     emailRedirectTo: `${window.location.origin}/auth/confirm`,
//     // //   },
//     // });
//      const { error } = await supabase.auth.signUp({
//   email,
//   password,
// });
//     setLoading(false);

//     if (error) {
//       setError(error.message);
//       return;
//     }

//     setMessage(
//       "Account created! Check your email to confirm your account."
//     );
//   }
async function handleSignup(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  console.log("SIGNUP STARTED");

  setError("");
  setMessage("");

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  setLoading(true);

  try {
    const supabase = createClient();

    console.log("SUPABASE CLIENT CREATED");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SIGNUP RESPONSE:", { data, error });

    if (error) {
      console.error("SIGNUP ERROR:", error);
      setError(error.message);
      return;
    }

    router.push("/login?signup=success");
  } catch (error) {
    console.error("SIGNUP CRASHED:", error);
    setError("Something went wrong. Check the browser console.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-[#E8F5E9] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Shippable
          </h1>

          <p className="mt-2 text-gray-600">
            Build. Test. Secure. Ship.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D1E7D5] p-8">

          <h2 className="text-2xl font-bold text-gray-900">
            Create your account
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Start building your next application.
          </p>

          {/* <form onSubmit={handleSignup} className="mt-8 space-y-5">

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form> */}
    
           
            <form onSubmit={handleSignup} className="mt-8 space-y-5">

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-medium text-green-700 hover:text-green-800"
            >
              Log in
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}
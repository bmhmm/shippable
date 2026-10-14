
"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function RocketIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="m3 3 18 18" />}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

function Field({
  id,
  label,
  icon,
  children,
  trailing,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-[#0B1F16]">
        {label}
      </label>
      <div className="flex h-11 items-center gap-2 rounded-[10px] border border-[#CFE3D6] bg-white px-3 text-[#6B8A7A] transition focus-within:border-[#00A651] focus-within:text-[#00843D] focus-within:ring-[3px] focus-within:ring-[#CDEFD9]">
        {icon}
        {children}
        {trailing}
      </div>
    </div>
  );
}

const inputClass =
  "h-full w-full bg-transparent text-sm text-[#0B1F16] outline-none placeholder:text-[#7C9487]";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

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

  const perks = [
    "Free to start, no card needed",
    "Connect your repo in minutes",
    "Security checks on every build",
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E8F5E9] px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-[#CFE3D6] bg-white md:grid-cols-[1fr_1.1fr]">
        {/* Brand panel */}
        <aside className="hidden flex-col justify-between bg-[#0B3D2A] p-10 md:flex">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A651] text-white">
              <RocketIcon />
            </span>
            <span className="text-lg font-medium text-[#EAF7EF]">Shippable</span>
          </div>

          <div>
            <p className="text-[2.75rem] font-medium leading-[1.1] text-[#EAF7EF]">
              Build.
              <br />
              Test.
              <br />
              Secure.
              <br />
              <span className="text-[#4ADE80]">Ship.</span>
            </p>

            <ul className="mt-6 space-y-2.5">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-[#9CCFB3]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#14573D] text-[#4ADE80]">
                    <CheckIcon />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-1 w-2 rounded-full bg-[#2E6B50]" />
            <span className="h-1 w-6 rounded-full bg-[#4ADE80]" />
            <span className="h-1 w-2 rounded-full bg-[#2E6B50]" />
          </div>
        </aside>

        {/* Form panel */}
        <section className="flex flex-col justify-center bg-[#F4FBF6] px-6 py-10 sm:px-10">
          {/* Mobile brand (brand panel is hidden on small screens) */}
          <div className="mb-8 flex items-center gap-2.5 md:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A651] text-white">
              <RocketIcon />
            </span>
            <span className="text-lg font-medium text-[#0B1F16]">Shippable</span>
          </div>

          <h1 className="text-2xl font-semibold text-[#0B1F16]">Create your account</h1>
          <p className="mt-1.5 text-sm text-[#4B6357]">
            Start building your next application.
          </p>

          <form onSubmit={handleSignup} className="mt-7 space-y-4">
            <Field id="email" label="Email" icon={<MailIcon />}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </Field>

            <Field
              id="password"
              label="Password"
              icon={<LockIcon />}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[#6B8A7A] transition hover:text-[#00843D]"
                >
                  <EyeIcon off={showPassword} />
                </button>
              }
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </Field>

            <Field
              id="confirmPassword"
              label="Confirm password"
              icon={<LockIcon />}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="text-[#6B8A7A] transition hover:text-[#00843D]"
                >
                  <EyeIcon off={showConfirm} />
                </button>
              }
            >
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </Field>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#00843D] text-[15px] font-medium text-white transition hover:bg-[#006B31] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#CDEFD9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#4B6357]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#00843D] hover:text-[#006B31] hover:underline"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
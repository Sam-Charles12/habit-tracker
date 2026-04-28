"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="flex-grow flex flex-col items-center justify-center bg-zinc-950 min-h-screen p-6 relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="w-full max-w-md mx-auto flex flex-col">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-100 leading-snug">
            Hey, welcome back!
            <br />
            Good to see you again!
          </h1>
        </div>

        <LoginForm />

        <p className="text-center text-zinc-400 mt-8 mb-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}

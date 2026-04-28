"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLocalUsers, setLocalUsers, setCurrentUser } from "@/lib/auth";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const users = getLocalUsers();
    if (users.some((u) => u.email === email)) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    setLocalUsers([...users, newUser]);
    setCurrentUser(newUser.id, newUser.email);
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100 leading-snug">
          Let&apos;s go! Register
          <br />
          in seconds.
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-5 flex-grow">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="auth-signup-email"
            className="w-full px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            placeholder="Email"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="auth-signup-password"
            className="w-full px-5 py-4 pr-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300"
            title={showPassword ? "Hide" : "Show"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-4 pr-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300"
            title={showConfirm ? "Hide" : "Show"}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          data-testid="auth-signup-submit"
          className="w-full py-4 mt-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-lg transition-colors shadow-lg shadow-emerald-600/20"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-emerald-400 hover:text-emerald-300 font-medium"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

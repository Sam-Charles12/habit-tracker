"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLocalUsers, setCurrentUser } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Invalid email or password");
      return;
    }

    const users = getLocalUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    setCurrentUser(user.id, user.email);
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100 leading-snug">
          Hey, welcome back!
          <br />
          Good to see you again!
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5 flex-grow">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="auth-login-email"
            className="w-full px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            placeholder="Email"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="auth-login-password"
            className="w-full px-5 py-4 pr-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300 transition-colors"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <span>Hide</span> : <span>Show</span>}
          </button>
        </div>

        <button
          type="submit"
          data-testid="auth-login-submit"
          className="w-full py-4 mt-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-lg transition-colors shadow-lg shadow-emerald-600/20"
        >
          Log In
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-emerald-400 hover:text-emerald-300 font-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export function SplashScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    const timer = setTimeout(() => {
      if (user) {
        router.push("/dashboard");
      } else {
        setIsChecking(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="flex-grow flex flex-col items-center justify-center px-8 py-12 bg-zinc-950 text-zinc-100 min-h-screen relative overflow-hidden"
      data-testid="splash-screen"
    >
      <div className="text-center z-10 mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="text-zinc-100">Habit </span>
          <span className="text-emerald-500">Tracker</span>
        </h1>
      </div>

      <div className="flex items-center justify-center w-full max-w-[280px] z-10 mb-10">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <circle cx="100" cy="100" r="80" fill="#064e3b" opacity="0.4" />
          <circle cx="100" cy="100" r="60" fill="#047857" opacity="0.6" />
          <g transform="translate(40, 70)">
            <circle cx="20" cy="20" r="15" fill="#10b981" />
            <path d="M5,60 C5,40 35,40 35,60" fill="#10b981" />
          </g>
          <g transform="translate(140, 70)">
            <circle cx="20" cy="20" r="15" fill="#10b981" />
            <path d="M5,60 C5,40 35,40 35,60" fill="#10b981" />
          </g>
          <circle cx="100" cy="120" r="25" fill="#10b981" opacity="0.8" />
          <text
            x="100"
            y="130"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill="#09090b"
          >
            ✓
          </text>
        </svg>
      </div>

      {!isChecking && (
        <div className="z-10 flex gap-4">
          <a
            href="/login"
            className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-semibold transition-colors"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="px-8 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold transition-colors border border-zinc-700"
          >
            Sign Up
          </a>
        </div>
      )}

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>
      </div>
    </main>
  );
}

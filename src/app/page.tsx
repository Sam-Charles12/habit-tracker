"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default function SplashPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check session on mount
    const user = getCurrentUser();
    
    // Slight timeout so the splash screen is visible momentarily
    const timer = setTimeout(() => {
      if (user) {
        router.push("/dashboard");
      } else {
        // If no user, we stop checking and let them see the onboarding screen
        setIsChecking(false);
      }
    }, 1500); // 1.5 second splash delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-8 py-12 bg-zinc-950 text-zinc-100 min-h-screen relative overflow-hidden">
      
      {/* Title */}
      <div className="text-center z-10 mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="text-zinc-100">Habit </span>
          <span className="text-emerald-500">Tracker</span>
        </h1>
      </div>

      {/* Illustration — centered on page */}
      <div className="flex items-center justify-center w-full max-w-[280px] z-10 mb-10">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <circle cx="100" cy="100" r="80" fill="#064e3b" opacity="0.4" />
          <circle cx="100" cy="100" r="60" fill="#047857" opacity="0.6" />
          
          {/* Person 1 */}
          <g transform="translate(40, 70)">
            <circle cx="20" cy="20" r="15" fill="#10b981" />
            <path d="M5,60 C5,40 35,40 35,60" fill="#10b981" />
          </g>

          {/* Person 2 */}
          <g transform="translate(120, 50)">
            <circle cx="20" cy="20" r="12" fill="#34d399" />
            <path d="M8,55 C8,40 32,40 32,55" fill="#34d399" />
          </g>

          {/* Person 3 */}
          <g transform="translate(80, 110)">
            <circle cx="20" cy="20" r="18" fill="#6ee7b7" />
            <path d="M0,65 C0,40 40,40 40,65" fill="#6ee7b7" />
          </g>

          {/* Connection Lines */}
          <path d="M60,90 L90,120 L130,70" fill="none" stroke="#a7f3d0" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
        </svg>
      </div>

      {/* Text & Buttons */}
      <div className="w-full max-w-md z-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold mb-3 tracking-wide">BUILD BETTER HABITS</h2>
        <p className="text-zinc-400 mb-10 max-w-[280px] leading-relaxed">
          Track your daily routines, build streaks, and become the best version of yourself.
        </p>

        {/* Buttons — stacked vertically */}
        <div className="flex flex-col w-full gap-4 max-w-xs">
          {isChecking ? (
            <div className="w-full flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <Link 
                href="/signup" 
                className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-zinc-50 font-semibold py-4 rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
              <Link 
                href="/login" 
                className="w-full text-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-medium py-4 rounded-full transition-all"
              >
                I already have an account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    const user = getCurrentUser();
    
    // Slight timeout just so the splash screen is visible momentarily
    const timer = setTimeout(() => {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 1500); // 1.5 second splash delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
        {/* Splash Logo */}
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl border-4 border-zinc-950 shadow-[0_0_0_4px_rgba(16,185,129,0.3)] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-950">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-emerald-400">Habit Tracker</h1>
      </div>
    </main>
  );
}

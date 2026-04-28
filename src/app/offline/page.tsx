"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, User } from "@/lib/auth";
import {
  Habit,
  getUserHabits,
  getTodayDateString,
  isHabitCompletedToday,
  calculateStreak,
} from "@/lib/habits";

// Helper to get an icon color based on habit id
const getIconColor = (id: string) => {
  const colors = [
    "bg-orange-500/20 text-orange-500",
    "bg-emerald-500/20 text-emerald-500",
    "bg-blue-500/20 text-blue-500",
    "bg-purple-500/20 text-purple-500",
    "bg-pink-500/20 text-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return colors[hash % colors.length];
};

export default function OfflinePage() {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const todayStr = getTodayDateString();

  useEffect(() => {
    // Check if we're online and redirect back to dashboard
    if (navigator.onLine) {
      setIsOnline(true);
      // Give a brief moment for navigation
      const timer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
      return () => clearTimeout(timer);
    }

    // Load cached user and habits
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setHabits(getUserHabits(currentUser.id));
    }
  }, []);

  // Listen for online event to redirect
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Small delay to show UI before redirecting
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  if (isOnline) {
    return (
      <main className="flex-grow bg-zinc-950 text-zinc-100 p-4 pt-16 md:p-8 md:pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-2">You're back online!</p>
          <p className="text-sm text-zinc-500">Redirecting to dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-zinc-950 text-zinc-100 p-4 pt-8 md:p-8 md:pt-8 min-h-screen pb-24">
      <div className="max-w-xl mx-auto">
        {/* Offline Banner */}
        <div className="bg-amber-900/40 border border-amber-500/30 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <div>
            <p className="text-sm font-medium text-amber-200">You're offline</p>
            <p className="text-xs text-amber-200/70">
              Viewing cached data — changes will sync when online
            </p>
          </div>
        </div>

        {user && habits.length > 0 ? (
          <>
            {/* Header Section */}
            <header className="mb-8">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight mb-1">
                  {user.email.split("@")[0]}
                </h1>
                <p className="text-zinc-400 text-sm">Cached data (offline)</p>
              </div>
            </header>

            {/* Daily Routine Section */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Daily routine</h2>
            </div>

            <div className="relative">
              {/* Vertical dashed timeline */}
              <div className="absolute left-[1.125rem] top-6 bottom-6 border-l-2 border-dashed border-zinc-800 z-0"></div>

              <div className="space-y-4">
                {habits.map((habit) => {
                  const isCompleted = isHabitCompletedToday(habit.id, todayStr);
                  const streak = calculateStreak(habit.id);
                  const iconColor = getIconColor(habit.id);

                  return (
                    <div
                      key={habit.id}
                      className="flex items-center gap-4 relative z-10 group"
                    >
                      {/* Checkbox (read-only indicator) */}
                      <div
                        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all bg-zinc-950 border-2 ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                            : "border-zinc-700 text-transparent"
                        }`}
                      >
                        {isCompleted && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-zinc-950"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Habit Card (read-only) */}
                      <div className="bg-zinc-900 rounded-[1.5rem] p-3 flex-grow flex items-center justify-between border border-zinc-800/80 shadow-sm">
                        <div className="flex items-center gap-4 pl-1">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColor}`}
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
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          </div>
                          <div>
                            <h3
                              className={`font-medium ${
                                isCompleted
                                  ? "text-zinc-500 line-through"
                                  : "text-zinc-100"
                              }`}
                            >
                              {habit.name}
                            </h3>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Streak {streak} days
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="h-10 border-l border-zinc-800 mx-4"></div>
                          <div className="flex flex-col items-center justify-center text-zinc-500 min-w-[3rem]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mb-1"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="text-[10px] uppercase font-medium">
                              5 min
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reconnect Notice */}
            <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
              <p className="text-zinc-300 text-sm mb-4">
                Connect to the internet to create, edit, or delete habits.
              </p>
              <p className="text-xs text-zinc-500">
                Your data is safe — all changes will sync when you're online.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Not Logged In / No Data */}
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-700 mb-6 opacity-50"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
                No cached data
              </h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-xs">
                You need to be online to log in or access your habits for the
                first time.
              </p>

              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-medium rounded-full transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-full transition-colors border border-zinc-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

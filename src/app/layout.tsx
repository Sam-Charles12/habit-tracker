import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaSetup } from "@/components/PwaSetup";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker PWA",
  description: "Track your habits, build your streaks, offline and fast.",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Habit Tracker PWA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-zinc-950 text-zinc-100`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PwaSetup />
        {children}
      </body>
    </html>
  );
}

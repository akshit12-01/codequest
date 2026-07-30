import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { StorageErrorWatcher } from "@/components/system/StorageErrorWatcher";

export const metadata: Metadata = {
  title: "CodeQuest — Level up your dev skills",
  description:
    "A gamified developer roadmap. Earn XP, level up skills, and complete quests as you learn.",
};

export const viewport: Viewport = {
  themeColor: "#0a0b10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/*
          Intentionally not using next/font/google: it fetches font files at
          BUILD time, which fails in network-restricted environments (this
          sandbox included — fonts.gstatic.com isn't reachable during `npm
          run build` here). A <link> tag fetches client-side in the browser
          instead, which is a standard, fully supported way to load Google
          Fonts and keeps `next build` reproducible anywhere.
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased">
        <ToastProvider>
          <StorageErrorWatcher />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

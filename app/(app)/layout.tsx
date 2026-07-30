"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/hooks/useAppData";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const { state, hasProfile } = useAppData();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!hasProfile) {
      router.replace("/");
    }
  }, [hasProfile, router]);

  if (!state) {
    // Either redirecting to onboarding, or the client snapshot hasn't
    // replaced the (always-null) server snapshot yet — both resolve almost
    // instantly, so a quiet blank shell avoids a jarring flash of content.
    return <div className="min-h-dvh bg-bg" />;
  }

  return (
    <div className="min-h-dvh">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

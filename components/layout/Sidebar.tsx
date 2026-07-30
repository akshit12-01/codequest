"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  FolderGit2,
  StickyNote,
  BarChart3,
  Trophy,
  Settings,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/hooks/useAppData";
import { getLevelProgress } from "@/lib/xpEngine";
import { Progress } from "@/components/ui/progress";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { state } = useAppData();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="panel-cut flex size-9 items-center justify-center border border-primary/30 bg-primary/15">
          <Sparkles className="size-5 text-primary-soft" />
        </div>
        <span className="text-lg font-bold tracking-tight text-text">CodeQuest</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary/25 bg-primary/12 text-primary-soft"
                  : "border-transparent text-text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {state && (
        <div className="m-3 rounded-lg border border-border-strong bg-surface-2 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted">Level {state.level}</span>
            <span className="font-mono text-xs text-primary-soft">
              {state.totalXP.toLocaleString()} XP
            </span>
          </div>
          <div className="mt-2">
            <Progress value={getLevelProgress(state.totalXP).percent} className="h-1.5" />
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <aside className="hidden border-r border-border bg-surface lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <aside className="animate-rise-in absolute inset-y-0 left-0 w-72 border-r border-border bg-surface">
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="absolute right-3 top-4 text-text-muted transition-colors hover:text-text"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { GlobalSearch } from "@/components/search/GlobalSearch";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { state } = useAppData();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-bg/85 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-text-muted transition-colors hover:text-text lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {mobileSearchOpen ? (
        <div className="flex flex-1 items-center gap-2 sm:hidden">
          <GlobalSearch autoFocus />
          <button
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
            className="shrink-0 text-text-muted transition-colors hover:text-text"
          >
            <X className="size-5" />
          </button>
        </div>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-text-muted">
            {getGreeting()}
            {state ? `, ${state.username}` : ""}
          </p>
        </div>
      )}

      {!mobileSearchOpen && (
        <button
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Search"
          className="text-text-muted transition-colors hover:text-text sm:hidden"
        >
          <Search className="size-5" />
        </button>
      )}

      <div className="hidden w-full max-w-xs sm:block">
        <GlobalSearch />
      </div>
    </header>
  );
}

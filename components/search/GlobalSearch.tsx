"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FolderGit2, StickyNote, Wrench } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { getAllTopics } from "@/lib/roadmapEngine";
import { getSkillDef } from "@/config/skills";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  kind: "topic" | "project" | "note" | "skill";
}

const ICONS = {
  topic: BookOpen,
  project: FolderGit2,
  note: StickyNote,
  skill: Wrench,
} as const;

export function GlobalSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { state } = useAppData();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const results: SearchResult[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !state) return [];
    const allTopics = getAllTopics();

    const topics: SearchResult[] = allTopics
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((t) => ({
        id: t.id,
        title: t.name,
        subtitle: "Topic",
        href: `/roadmap/${t.id}`,
        kind: "topic" as const,
      }));

    const projects: SearchResult[] = state.projects
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: "Project",
        href: `/projects/${p.id}`,
        kind: "project" as const,
      }));

    const notes: SearchResult[] = Object.values(state.notes)
      .filter((n) => n.content.toLowerCase().includes(q))
      .slice(0, 4)
      .map((n) => ({
        id: n.topicId,
        title: allTopics.find((t) => t.id === n.topicId)?.name ?? n.topicId,
        subtitle: "Note",
        href: `/roadmap/${n.topicId}`,
        kind: "note" as const,
      }));

    const skills: SearchResult[] = Object.keys(state.skills)
      .map((id) => getSkillDef(id))
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((s) => ({
        id: s.id,
        title: s.name,
        subtitle: "Skill",
        href: "/roadmap",
        kind: "skill" as const,
      }));

    return [...topics, ...projects, ...notes, ...skills].slice(0, 10);
  }, [query, state]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search topics, projects, notes…"
          autoFocus={autoFocus}
          className="h-9 w-full rounded-lg border border-border-strong bg-surface-2 pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus-visible:border-primary-soft"
        />
      </div>
      {open && query.trim() && (
        <div className="absolute right-0 top-11 z-30 w-80 max-w-[90vw] overflow-hidden rounded-lg border border-border-strong bg-surface-2 shadow-2xl">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-text-muted">No matches for &ldquo;{query}&rdquo;</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => {
                const Icon = ICONS[r.kind];
                return (
                  <li key={`${r.kind}-${r.id}`}>
                    <button
                      onClick={() => {
                        router.push(r.href);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-3"
                    >
                      <Icon className="size-4 shrink-0 text-text-muted" />
                      <span className="flex-1 truncate text-text">{r.title}</span>
                      <span className="text-xs text-text-faint">{r.subtitle}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

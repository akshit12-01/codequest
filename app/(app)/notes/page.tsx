"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StickyNote, Search, Trash2 } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { useActions } from "@/hooks/useActions";
import { getTopicById } from "@/lib/roadmapEngine";
import { formatRelativeTime } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/modal";

export default function NotesPage() {
  const { state } = useAppData();
  const { deleteNote } = useActions();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const notes = useMemo(() => {
    if (!state) return [];
    const q = query.trim().toLowerCase();
    return Object.values(state.notes)
      .filter((n) => n.content.trim().length > 0)
      .filter((n) => {
        if (!q) return true;
        const topicName = getTopicById(n.topicId)?.name.toLowerCase() ?? "";
        return n.content.toLowerCase().includes(q) || topicName.includes(q);
      })
      .sort(
        (a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
      );
  }, [state, query]);

  if (!state) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Notes</h1>
        <p className="mt-1 text-sm text-text-muted">
          Everything you&rsquo;ve jotted down across the roadmap, in one place.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes…"
          className="pl-9"
        />
      </div>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong p-12 text-center">
          <StickyNote className="mx-auto size-8 text-text-faint" />
          <p className="mt-3 font-medium text-text">
            {query ? "No notes match your search" : "No notes yet"}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {query
              ? "Try a different search term."
              : "Open any topic and start writing — notes autosave as you type."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const topic = getTopicById(note.topicId);
            return (
              <Card key={note.topicId} className="animate-rise-in p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/roadmap/${note.topicId}`} className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StickyNote className="size-4 shrink-0 text-text-faint" />
                      <h3 className="truncate font-medium text-text transition-colors hover:text-primary-soft">
                        {topic?.name ?? note.topicId}
                      </h3>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{note.content}</p>
                    <p className="mt-1.5 text-xs text-text-faint">
                      Last edited {formatRelativeTime(note.updatedAt)}
                    </p>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingDelete(note.topicId)}
                    aria-label="Delete note"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteNote(pendingDelete);
        }}
        title="Delete this note?"
        description="This note will be permanently removed. This can't be undone."
        confirmLabel="Delete note"
      />
    </div>
  );
}

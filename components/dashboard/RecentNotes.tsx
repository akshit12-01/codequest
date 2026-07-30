import Link from "next/link";
import { StickyNote } from "lucide-react";
import type { AppState } from "@/types";
import { getRecentNotes } from "@/lib/statsEngine";
import { getTopicById } from "@/lib/roadmapEngine";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentNotes({ state }: { state: AppState }) {
  const notes = getRecentNotes(state, 4);

  return (
    <Card className="animate-rise-in">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Recent notes</CardTitle>
        <Link href="/notes" className="text-xs text-primary-soft hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {notes.length === 0 ? (
          <p className="text-sm text-text-muted">
            Notes you take on topics will show up here.
          </p>
        ) : (
          notes.map((note) => {
            const topic = getTopicById(note.topicId);
            return (
              <Link
                key={note.topicId}
                href={`/roadmap/${note.topicId}`}
                className="-mx-2 flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-surface-2"
              >
                <StickyNote className="mt-0.5 size-4 shrink-0 text-text-faint" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text">{topic?.name ?? note.topicId}</p>
                  <p className="truncate text-xs text-text-muted">{note.content}</p>
                </div>
                <span className="shrink-0 text-[11px] text-text-faint">
                  {formatRelativeTime(note.updatedAt)}
                </span>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

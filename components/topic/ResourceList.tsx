import { ExternalLink, FileText, Video, BookMarked, Newspaper, type LucideIcon } from "lucide-react";
import type { Resource } from "@/types";

const ICONS: Record<Resource["kind"], LucideIcon> = {
  doc: FileText,
  video: Video,
  book: BookMarked,
  article: Newspaper,
};

export function ResourceList({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return <p className="text-sm text-text-muted">No resources listed for this topic yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {resources.map((r) => {
        const Icon = ICONS[r.kind];
        return (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text transition-colors hover:border-primary/40 hover:text-primary-soft"
            >
              <Icon className="size-4 shrink-0 text-text-muted" />
              <span className="flex-1">{r.label}</span>
              <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-faint">
                {r.kind}
              </span>
              <ExternalLink className="size-3.5 shrink-0 text-text-faint" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

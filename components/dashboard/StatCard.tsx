import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  accent = "primary",
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
  accent?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const accentClass = {
    primary: "text-primary-soft bg-primary/10 border-primary/25",
    success: "text-success bg-success/10 border-success/25",
    warning: "text-warning bg-warning/10 border-warning/25",
    danger: "text-danger bg-danger/10 border-danger/25",
    info: "text-info bg-info/10 border-info/25",
  }[accent];

  return (
    <Card className={cn("animate-rise-in p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-muted">{label}</p>
          <p className="mt-1.5 font-mono text-xl font-semibold text-text">{value}</p>
          {sublabel && <p className="mt-0.5 truncate text-xs text-text-faint">{sublabel}</p>}
        </div>
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", accentClass)}>
          <Icon className="size-4" />
        </div>
      </div>
    </Card>
  );
}

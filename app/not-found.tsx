import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg p-6 text-center">
      <div className="panel-cut flex size-16 items-center justify-center border border-primary/30 bg-primary/10">
        <Compass className="size-7 text-primary-soft" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-text">Quest not found</h1>
        <p className="mt-1 max-w-sm text-sm text-text-muted">
          Whatever you were looking for doesn&rsquo;t exist — it may have been removed, or the
          link is off.
        </p>
      </div>
      <Link href="/dashboard" className={buttonVariants()}>
        Back to dashboard
      </Link>
    </div>
  );
}

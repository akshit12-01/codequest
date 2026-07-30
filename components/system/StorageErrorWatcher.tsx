"use client";

import { useEffect, useRef } from "react";
import { subscribeSaveError } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

/**
 * Renders nothing. Mounted once near the root (inside ToastProvider) so a
 * failed LocalStorage write — private browsing, full storage, disabled
 * storage — surfaces to the user instead of only hitting console.error.
 * Throttled so a burst of failed writes doesn't spam the toast stack.
 */
export function StorageErrorWatcher() {
  const { toast } = useToast();
  const lastWarnedAt = useRef(0);

  useEffect(() => {
    return subscribeSaveError(() => {
      const now = Date.now();
      if (now - lastWarnedAt.current < 15_000) return;
      lastWarnedAt.current = now;
      toast({
        title: "Couldn't save your progress",
        description:
          "Your browser's local storage is unavailable or full. Changes in this tab may be lost on refresh.",
        variant: "danger",
      });
    });
  }, [toast]);

  return null;
}

"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "danger" | "levelup";
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toast = React.useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [...prev, { ...item, id }]);
      window.setTimeout(() => dismiss(id), 5200);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "animate-rise-in glass panel-cut pointer-events-auto rounded-lg border p-4 shadow-2xl",
              item.variant === "success" && "border-success/50",
              item.variant === "danger" && "border-danger/50",
              item.variant === "levelup" &&
                "border-primary-soft/60 animate-level-pulse",
              (!item.variant || item.variant === "default") &&
                "border-border-strong"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-xs text-text-muted">{item.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="text-text-faint transition-colors hover:text-text"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

"use client";

import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, User, Trash2, ShieldAlert } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { useActions } from "@/hooks/useActions";
import { exportStateAsJSON, parseImportedJSON } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/modal";

type ConfirmKind = "clearNotes" | "resetAchievements" | "resetProgress" | null;

function DangerRow({
  title,
  description,
  actionLabel,
  onClick,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 p-3">
      <div>
        <p className="text-sm font-medium text-text">{title}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
      <Button variant="destructive" size="sm" onClick={onClick}>
        <Trash2 className="size-3.5" /> {actionLabel}
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const { state, importState, resetProgress } = useAppData();
  const { changeUsername, clearAllNotes, resetAchievements } = useActions();
  const router = useRouter();

  const [username, setUsername] = useState(state?.username ?? "");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!state) return null;

  function handleSaveUsername(e: FormEvent) {
    e.preventDefault();
    if (username.trim().length < 2) return;
    changeUsername(username);
  }

  function handleExport() {
    if (!state) return;
    const json = exportStateAsJSON(state);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codequest-${state.username.toLowerCase().replace(/\s+/g, "-")}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportError("");
    setImportSuccess(false);
    try {
      const text = await file.text();
      const parsed = parseImportedJSON(text);
      if (!parsed) {
        setImportError("That file doesn't look like a valid CodeQuest export.");
        return;
      }
      importState(parsed);
      setUsername(parsed.username);
      setImportSuccess(true);
    } catch {
      setImportError(
        "Couldn't read that file. Make sure it's the JSON export from Settings → Export."
      );
    }
  }

  function handleConfirm() {
    if (confirmKind === "clearNotes") clearAllNotes();
    if (confirmKind === "resetAchievements") resetAchievements();
    if (confirmKind === "resetProgress") {
      resetProgress();
      router.replace("/");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Manage your profile and local data.</p>
      </div>

      <Card className="animate-rise-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4" /> Username
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveUsername} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="settings-username">Display name</Label>
              <Input
                id="settings-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={24}
              />
            </div>
            <Button
              type="submit"
              disabled={username.trim().length < 2 || username.trim() === state.username}
            >
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="animate-rise-in">
        <CardHeader>
          <CardTitle className="text-base">Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 p-3">
            <div>
              <p className="text-sm font-medium text-text">Export your progress</p>
              <p className="text-xs text-text-muted">
                Download everything as a JSON file — a full backup, or a way to move to another
                browser.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="size-3.5" /> Export
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-surface-2 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text">Import progress</p>
                <p className="text-xs text-text-muted">
                  Load a previously exported JSON file. This replaces your current progress.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="size-3.5" /> Import
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
            {importError && <p className="mt-2 text-xs text-danger">{importError}</p>}
            {importSuccess && (
              <p className="mt-2 text-xs text-success">
                Import successful — your progress has been restored.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-rise-in border-danger/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-danger">
            <ShieldAlert className="size-4" /> Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DangerRow
            title="Clear all notes"
            description="Removes every note across every topic. XP and progress are untouched."
            actionLabel="Clear notes"
            onClick={() => setConfirmKind("clearNotes")}
          />
          <DangerRow
            title="Reset achievements"
            description="Re-locks every achievement. XP, level, and progress are untouched."
            actionLabel="Reset achievements"
            onClick={() => setConfirmKind("resetAchievements")}
          />
          <DangerRow
            title="Reset all progress"
            description="Wipes everything — XP, levels, skills, notes, projects, achievements — and takes you back to onboarding."
            actionLabel="Reset everything"
            onClick={() => setConfirmKind("resetProgress")}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmKind !== null}
        onClose={() => setConfirmKind(null)}
        onConfirm={handleConfirm}
        title={
          confirmKind === "clearNotes"
            ? "Clear all notes?"
            : confirmKind === "resetAchievements"
            ? "Reset all achievements?"
            : "Reset everything?"
        }
        description={
          confirmKind === "clearNotes"
            ? "Every note on every topic will be deleted. This can't be undone."
            : confirmKind === "resetAchievements"
            ? "Every achievement will be re-locked. Your XP and progress stay exactly as they are."
            : "This deletes your entire CodeQuest profile from this browser. This can't be undone."
        }
        confirmLabel={
          confirmKind === "clearNotes"
            ? "Clear notes"
            : confirmKind === "resetAchievements"
            ? "Reset achievements"
            : "Reset everything"
        }
      />
    </div>
  );
}

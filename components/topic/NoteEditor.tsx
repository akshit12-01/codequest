"use client";
import { useEffect, useRef, useState } from "react";
import { Trash2, Save, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/modal";
import { formatRelativeTime } from "@/lib/utils";
import { useActions } from "@/hooks/useActions";
import type { Note } from "@/types";

const AUTOSAVE_DELAY_MS = 1500;

/**
 * Render with `key={topicId}` from the parent. That's what resets this
 * editor's local state when navigating between topics — remounting via key
 * is the idiomatic React way to do that, rather than an effect that calls
 * setState on prop change.
 */
export function NoteEditor({ topicId, note }: { topicId: string; note: Note | undefined }) {
  const [content, setContent] = useState(note?.content ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const { saveNote, deleteNote } = useActions();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  function flashSaved() {
    setSavedFlash(true);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setSavedFlash(false), 1600);
  }

  function handleChange(value: string) {
    setContent(value);
    dirtyRef.current = true;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (dirtyRef.current) {
        saveNote(topicId, value);
        dirtyRef.current = false;
        flashSaved();
      }
    }, AUTOSAVE_DELAY_MS);
  }

  function handleSaveNow() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    saveNote(topicId, content);
    dirtyRef.current = false;
    flashSaved();
  }

  const hasSavedContent = !!note?.content;

  return (
    <div>
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Jot down anything worth remembering about this topic…"
        className="min-h-40"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-text-faint">
          {savedFlash ? (
            <span className="inline-flex items-center gap-1 text-success">
              <Check className="size-3" /> Saved
            </span>
          ) : note?.updatedAt ? (
            `Last edited ${formatRelativeTime(note.updatedAt)}`
          ) : (
            "Not saved yet — autosaves as you type"
          )}
        </p>
        <div className="flex gap-2">
          {hasSavedContent && (
            <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="size-3.5" /> Delete
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleSaveNow}>
            <Save className="size-3.5" /> Save
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteNote(topicId);
          setContent("");
        }}
        title="Delete this note?"
        description="This note will be permanently removed. This can't be undone."
        confirmLabel="Delete note"
      />
    </div>
  );
}

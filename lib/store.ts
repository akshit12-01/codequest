"use client";

import type { AppState } from "@/types";
import { loadState, saveState, clearState, STORAGE_KEY } from "./storage";

type Listener = () => void;

// `undefined` = not read from LocalStorage yet, `null` = no saved user found
let cachedState: AppState | null | undefined = undefined;
const listeners = new Set<Listener>();
const saveErrorListeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function emitSaveError() {
  saveErrorListeners.forEach((listener) => listener());
}

/** Lets a single top-level component (see components/system/StorageErrorWatcher.tsx) react to a failed write, e.g. a full or disabled LocalStorage, without every call site needing to check a return value. */
export function subscribeSaveError(listener: Listener): () => void {
  saveErrorListeners.add(listener);
  return () => saveErrorListeners.delete(listener);
}

export function getSnapshot(): AppState | null {
  if (cachedState === undefined) {
    cachedState = loadState();
  }
  return cachedState ?? null;
}

export function getServerSnapshot(): AppState | null {
  return null;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  const onStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedState = loadState();
      emit();
    }
  };
  window.addEventListener("storage", onStorageEvent);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorageEvent);
  };
}

export function setAppState(
  updater: AppState | ((prev: AppState) => AppState)
): void {
  const prev = getSnapshot();
  if (!prev) return;
  const next =
    typeof updater === "function"
      ? (updater as (p: AppState) => AppState)(prev)
      : updater;
  cachedState = next;
  const saved = saveState(next);
  emit();
  if (!saved) emitSaveError();
}

export function initializeAppState(initial: AppState): void {
  cachedState = initial;
  const saved = saveState(initial);
  emit();
  if (!saved) emitSaveError();
}

export function resetAppState(): void {
  cachedState = null;
  clearState();
  emit();
}

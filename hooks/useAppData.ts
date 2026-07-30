"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { AppState } from "@/types";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setAppState,
  initializeAppState,
  resetAppState,
} from "@/lib/store";
import { createDefaultState } from "@/lib/storage";

/**
 * The one hook every page/component uses to read and write CodeQuest state.
 * Backed by LocalStorage today; swapping the backing store for an API later
 * only means changing lib/store.ts + lib/storage.ts, not this hook's callers.
 */
export function useAppData() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback(
    (updater: AppState | ((prev: AppState) => AppState)) => {
      setAppState(updater);
    },
    []
  );

  const startJourney = useCallback((username: string) => {
    initializeAppState(createDefaultState(username));
  }, []);

  const resetProgress = useCallback(() => {
    resetAppState();
  }, []);

  const importState = useCallback((imported: AppState) => {
    initializeAppState(imported);
  }, []);

  return {
    state,
    update,
    startJourney,
    resetProgress,
    importState,
    isReady: state !== undefined,
    hasProfile: !!state,
  };
}

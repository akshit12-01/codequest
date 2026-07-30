import type { AppState } from "@/types";
import { todayISODate } from "./utils";

const DAY_MS = 86_400_000;

/** Call this any time the user does something XP-worthy today. Idempotent per day. */
export function applyStreakActivity(state: AppState): AppState {
  const today = todayISODate();
  const last = state.streak.lastActiveDate;

  if (last === today) return state;

  let current = 1;
  if (last) {
    const diffDays = Math.round(
      (new Date(`${today}T00:00:00`).getTime() -
        new Date(`${last}T00:00:00`).getTime()) /
        DAY_MS
    );
    current = diffDays === 1 ? state.streak.current + 1 : 1;
  }

  const best = Math.max(state.streak.best, current);
  return { ...state, streak: { current, best, lastActiveDate: today } };
}

/** Has today's activity already been logged? Used to decide whether a visit alone should reset a broken streak. */
export function isStreakActiveToday(state: AppState): boolean {
  return state.streak.lastActiveDate === todayISODate();
}

"use client";

import { useCallback } from "react";
import { useAppData } from "./useAppData";
import { useToast, type ToastItem } from "@/components/ui/toast";
import { getSnapshot } from "@/lib/store";
import {
  completeTopicAction,
  createPendingProjectAction,
  applyProjectReviewAction,
  markProjectFailedAction,
  updateProjectFieldsAction,
  beginRetryAction,
  updateNoteAction,
  changeUsernameAction,
  updateSettingsAction,
  clearAllNotesAction,
  resetAchievementsAction,
} from "@/lib/actions";
import type { AppState, Project, RoadmapTopic } from "@/types";
import { getReviewService } from "@/services/ai";
import type { AchievementDef } from "@/config/achievements";

type Toast = (item: Omit<ToastItem, "id">) => void;
type Update = (updater: AppState | ((prev: AppState) => AppState)) => void;

function announceGains(
  toast: Toast,
  xpGained: number,
  leveledUp: boolean,
  newLevel: number,
  newlyUnlocked: AchievementDef[]
) {
  if (xpGained > 0) {
    toast({ title: `+${xpGained} XP`, variant: "success" });
  }
  if (leveledUp) {
    toast({
      title: `Level up! You're now level ${newLevel}`,
      description: "Keep going — the next tier is already loading.",
      variant: "levelup",
    });
  }
  newlyUnlocked.forEach((a) => {
    toast({
      title: `Achievement unlocked: ${a.name}`,
      description: a.description,
      variant: "levelup",
    });
  });
}

/**
 * Shared by submitProject and retryReview so the "call the AI service, apply
 * the result, celebrate, handle failure" sequence exists exactly once.
 */
async function runReviewAndApply(
  fallbackState: AppState,
  project: Project,
  update: Update,
  toast: Toast
) {
  try {
    const service = getReviewService(fallbackState.settings.aiProvider);
    const review = await service.reviewProject({
      projectName: project.name,
      description: project.description,
      githubUrl: project.githubUrl,
      skillsUsed: project.skillsUsed,
      geminiApiKey: fallbackState.settings.geminiApiKey,
    });

    const latest = getSnapshot() ?? fallbackState;
    const result = applyProjectReviewAction(latest, project.id, review);
    update(() => result.state);
    announceGains(toast, result.xpGained, result.leveledUp, result.newLevel, result.newlyUnlocked);
    toast({
      title: "Review complete",
      description: `${project.name} scored ${review.overallScore}/100`,
      variant: "success",
    });
    return { projectId: project.id, review };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong contacting the reviewer.";
    update((prev) => markProjectFailedAction(prev, project.id, message));
    toast({ title: "Review failed", description: message, variant: "danger" });
    throw err;
  }
}

export function useActions() {
  const { state, update } = useAppData();
  const { toast } = useToast();

  const completeTopic = useCallback(
    (topic: RoadmapTopic) => {
      if (!state) return;
      const result = completeTopicAction(state, topic);
      if (result.xpGained === 0) return;
      update(() => result.state);
      announceGains(toast, result.xpGained, result.leveledUp, result.newLevel, result.newlyUnlocked);
    },
    [state, update, toast]
  );

  const saveNote = useCallback(
    (topicId: string, content: string) => {
      update((prev) => updateNoteAction(prev, topicId, content));
    },
    [update]
  );

  const deleteNote = useCallback(
    (topicId: string) => {
      update((prev) => {
        const notes = { ...prev.notes };
        delete notes[topicId];
        return { ...prev, notes };
      });
      toast({ title: "Note deleted" });
    },
    [update, toast]
  );

  const changeUsername = useCallback(
    (username: string) => {
      update((prev) => changeUsernameAction(prev, username));
      toast({ title: "Username updated", variant: "success" });
    },
    [update, toast]
  );

  const clearAllNotes = useCallback(() => {
    update((prev) => clearAllNotesAction(prev));
    toast({ title: "All notes cleared" });
  }, [update, toast]);

  const resetAchievements = useCallback(() => {
    update((prev) => resetAchievementsAction(prev));
    toast({ title: "Achievements reset" });
  }, [update, toast]);

  const updateSettings = useCallback(
    (settings: Partial<AppState["settings"]>) => {
      update((prev) => updateSettingsAction(prev, settings));
    },
    [update]
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      update((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
      }));
      toast({ title: "Project deleted" });
    },
    [update, toast]
  );

  const updateProjectFields = useCallback(
    (projectId: string, fields: Partial<Pick<Project, "name" | "description" | "githubUrl" | "skillsUsed">>) => {
      update((prev) => updateProjectFieldsAction(prev, projectId, fields));
      toast({ title: "Project updated" });
    },
    [update, toast]
  );

  const submitProject = useCallback(
    async (input: {
      name: string;
      description: string;
      githubUrl: string;
      skillsUsed: string[];
    }) => {
      if (!state) throw new Error("No active profile");
      const { state: withPending, project } = createPendingProjectAction(state, input);
      update(() => withPending);
      return runReviewAndApply(withPending, project, update, toast);
    },
    [state, update, toast]
  );

  const retryReview = useCallback(
    async (projectId: string) => {
      if (!state) throw new Error("No active profile");
      const project = state.projects.find((p) => p.id === projectId);
      if (!project) throw new Error("Project not found");

      const withPending = beginRetryAction(state, projectId);
      update(() => withPending);
      return runReviewAndApply(withPending, project, update, toast);
    },
    [state, update, toast]
  );

  return {
    completeTopic,
    saveNote,
    deleteNote,
    changeUsername,
    clearAllNotes,
    resetAchievements,
    updateSettings,
    submitProject,
    retryReview,
    deleteProject,
    updateProjectFields,
  };
}
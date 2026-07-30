"use client";

import { useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  CircleAlert,
  RotateCw,
  Trash2,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { useActions } from "@/hooks/useActions";
import { ReviewReport } from "@/components/projects/ReviewReport";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SkillTagInput } from "@/components/projects/SkillTagInput";
import { ConfirmDialog } from "@/components/ui/modal";

interface ProjectDraft {
  name: string;
  description: string;
  githubUrl: string;
  skillsUsed: string[];
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppData();
  const { retryReview, deleteProject, updateProjectFields } = useActions();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);

  if (!state) return null;
  const project = state.projects.find((p) => p.id === id);
  if (!project) notFound();

  async function handleRetry() {
    setRetrying(true);
    try {
      await retryReview(project!.id);
    } catch {
      // useActions already surfaced a toast for this
    } finally {
      setRetrying(false);
    }
  }

  function startEditing() {
    setDraft({
      name: project!.name,
      description: project!.description,
      githubUrl: project!.githubUrl,
      skillsUsed: project!.skillsUsed,
    });
    setEditing(true);
  }

  function saveEdits() {
    if (!draft) return;
    updateProjectFields(project!.id, draft);
    setEditing(false);
    setDraft(null);
  }

  // Editing while "pending" would race with an in-flight review of the old
  // fields, so editing is only offered once a submission has failed.
  const canEdit = project.status === "failed";
  const draftValid =
    !!draft &&
    draft.name.trim().length > 0 &&
    draft.description.trim().length > 0 &&
    draft.githubUrl.trim().length > 0 &&
    draft.skillsUsed.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text"
        >
          <ChevronLeft className="size-3.5" /> Back to projects
        </Link>
        <div className="flex items-center gap-2">
          {canEdit && !editing && (
            <Button variant="ghost" size="sm" onClick={startEditing}>
              <Pencil className="size-3.5" /> Edit
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-3.5" /> Delete
          </Button>
        </div>
      </div>

      {editing && draft ? (
        <Card className="animate-rise-in p-6">
          <h2 className="mb-4 text-sm font-semibold text-text">Edit project details</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Project name</Label>
              <Input
                id="edit-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                maxLength={80}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="min-h-28"
                maxLength={2000}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-repo">GitHub repository</Label>
              <Input
                id="edit-repo"
                value={draft.githubUrl}
                onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Skills used</Label>
              <SkillTagInput
                value={draft.skillsUsed}
                onChange={(skillsUsed) => setDraft({ ...draft, skillsUsed })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setDraft(null);
                }}
              >
                <X className="size-3.5" /> Cancel
              </Button>
              <Button onClick={saveEdits} disabled={!draftValid}>
                <Save className="size-3.5" /> Save changes
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {project.status === "pending" && (
            <Card className="p-12 text-center">
              <Loader2 className="mx-auto size-8 animate-spin text-primary-soft" />
              <p className="mt-4 font-medium text-text">Reviewing {project.name}…</p>
              <p className="mt-1 text-sm text-text-muted">This usually takes a few seconds.</p>
            </Card>
          )}

          {project.status === "failed" && (
            <Card className="border-danger/30 p-8 text-center">
              <CircleAlert className="mx-auto size-8 text-danger" />
              <p className="mt-3 font-medium text-text">Review failed</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-text-muted">
                {project.errorMessage ?? "Something went wrong contacting the reviewer."}
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <Button variant="secondary" onClick={startEditing}>
                  <Pencil className="size-4" /> Edit details
                </Button>
                <Button onClick={handleRetry} disabled={retrying}>
                  {retrying ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RotateCw className="size-4" />
                  )}
                  {retrying ? "Retrying…" : "Retry review"}
                </Button>
              </div>
            </Card>
          )}

          {project.status === "reviewed" && project.review && (
            <ReviewReport project={project} review={project.review} />
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteProject(project!.id);
          router.push("/projects");
        }}
        title="Delete this project?"
        description="This removes it from your project history. Any XP already earned from it stays with you. This can't be undone."
        confirmLabel="Delete project"
      />
    </div>
  );
}

"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { useActions } from "@/hooks/useActions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkillTagInput } from "@/components/projects/SkillTagInput";
import { getSkillDef } from "@/config/skills";

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submitProject } = useActions();

  const prefillSkills = (searchParams.get("skills") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((id) => getSkillDef(id).name);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [skills, setSkills] = useState<string[]>(prefillSkills);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !githubUrl.trim() || skills.length === 0) {
      setError("Fill in every field and add at least one skill.");
      return;
    }
    try {
      new URL(githubUrl.trim());
    } catch {
      setError("Enter a valid URL for the GitHub repository (including https://).");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const result = await submitProject({ name, description, githubUrl, skillsUsed: skills });
      router.push(`/projects/${result.projectId}`);
    } catch {
      // useActions already toasts the failure — land on the list so they can see the failed card and retry.
      router.push("/projects");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text"
      >
        <ChevronLeft className="size-3.5" /> Back to projects
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-text">Submit a project</h1>
        <p className="mt-1 text-sm text-text-muted">
          Describe what you built. The AI reviewer scores exactly the skills you tag — nothing
          more.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="proj-name">Project name</Label>
              <Input
                id="proj-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Task Manager API"
                maxLength={80}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does it do? What was the hardest part? Anything you want the reviewer to know."
                className="min-h-32"
                maxLength={2000}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proj-repo">GitHub repository</Label>
              <Input
                id="proj-repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/you/project"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Skills used</Label>
              <SkillTagInput value={skills} onChange={setSkills} />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Submitting for review…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Analyze Project
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="text-sm text-text-muted">Loading…</div>}>
      <NewProjectForm />
    </Suspense>
  );
}

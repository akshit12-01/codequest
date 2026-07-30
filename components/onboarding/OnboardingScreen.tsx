"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, Swords, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/hooks/useAppData";

export function OnboardingScreen() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { startJourney } = useAppData();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError("Enter at least 2 characters.");
      return;
    }
    startJourney(trimmed);
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-success/10 blur-3xl" />

      <div className="panel-cut glass animate-rise-in relative w-full max-w-md border border-border-strong p-8 sm:p-10">
        <div className="flex items-center gap-2.5">
          <div className="panel-cut flex size-10 items-center justify-center border border-primary/30 bg-primary/15">
            <Sparkles className="size-5 text-primary-soft" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text">CodeQuest</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold leading-tight text-text sm:text-3xl">
          Your dev roadmap,
          <br /> played like an RPG.
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Earn XP, level up real skills, and unlock the next quest — one topic and one
          project at a time.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <label
            htmlFor="username"
            className="text-xs font-medium uppercase tracking-wide text-text-muted"
          >
            Choose your name
          </label>
          <Input
            id="username"
            autoFocus
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="e.g. Akshit"
            maxLength={24}
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <Button type="submit" size="lg" className="w-full">
            Start Journey
          </Button>
        </form>

        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
          <div>
            <BookOpen className="mx-auto size-4 text-info" />
            <p className="mt-1 text-[11px] text-text-muted">Learn topics</p>
          </div>
          <div>
            <Swords className="mx-auto size-4 text-warning" />
            <p className="mt-1 text-[11px] text-text-muted">Ship projects</p>
          </div>
          <div>
            <Trophy className="mx-auto size-4 text-success" />
            <p className="mt-1 text-[11px] text-text-muted">Level up skills</p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-text-faint">
          Everything is saved locally in your browser. No account, no servers.
        </p>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { SKILL_DEFS, normalizeSkillName } from "@/config/skills";

export function SkillTagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = SKILL_DEFS.filter(
    (s) =>
      input.trim() !== "" &&
      s.name.toLowerCase().includes(input.trim().toLowerCase()) &&
      !value.some((v) => normalizeSkillName(v) === s.id)
  ).slice(0, 6);

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const isDuplicate = value.some(
      (v) =>
        v.toLowerCase() === trimmed.toLowerCase() ||
        normalizeSkillName(v) === normalizeSkillName(trimmed)
    );
    if (!isDuplicate) onChange([...value, trimmed]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className="relative">
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border-strong bg-surface-2 p-1.5 focus-within:border-primary-soft">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-surface-3 px-2.5 py-1 text-xs text-text"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-text-faint transition-colors hover:text-danger"
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? "Type a skill and press Enter…" : ""}
          className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-sm text-text outline-none placeholder:text-text-faint"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border-strong bg-surface-2 shadow-xl">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(s.name);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text hover:bg-surface-3"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: `var(--color-skill-${s.colorVar})` }}
              />
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

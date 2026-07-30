import { getSkillDef } from "@/config/skills";
import { cn } from "@/lib/utils";

/**
 * A colored pill for one skill. Colors come from the per-skill CSS custom
 * properties defined in globals.css (--color-skill-*), applied via inline
 * style since Tailwind's JIT can't statically know these dynamic classes.
 */
export function SkillBadge({
  skillId,
  level,
  size = "md",
  className,
}: {
  skillId: string;
  level?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const def = getSkillDef(skillId);
  const colorVar = `var(--color-skill-${def.colorVar})`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className
      )}
      style={{
        color: colorVar,
        borderColor: `color-mix(in srgb, ${colorVar} 40%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${colorVar} 12%, transparent)`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: colorVar }}
        aria-hidden
      />
      {def.name}
      {typeof level === "number" && (
        <span className="opacity-70">Lv{level}</span>
      )}
    </span>
  );
}

import type { AppState } from "@/types";
import { SKILL_DEFS } from "@/config/skills";
import { SkillBadge } from "@/components/common/SkillBadge";
import { Progress } from "@/components/ui/progress";

export function SkillTable({ state }: { state: AppState }) {
  const rows = SKILL_DEFS.map((def) => state.skills[def.id]).filter(Boolean);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-faint">
            <th className="py-2 pr-3 font-medium">Skill</th>
            <th className="py-2 pr-3 font-medium">Level</th>
            <th className="py-2 pr-3 font-medium">XP</th>
            <th className="py-2 pr-3 font-medium">Projects</th>
            <th className="py-2 pr-3 font-medium">Avg AI score</th>
            <th className="py-2 font-medium">Roadmap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((skill) => {
            const avgScore =
              skill.aiScores.length === 0
                ? null
                : Math.round(
                    skill.aiScores.reduce((a, b) => a + b, 0) / skill.aiScores.length
                  );
            return (
              <tr key={skill.id} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 pr-3">
                  <SkillBadge skillId={skill.id} size="sm" />
                </td>
                <td className="py-2.5 pr-3 font-mono text-text">{skill.level}</td>
                <td className="py-2.5 pr-3 font-mono text-text-muted">
                  {skill.xp.toLocaleString()}
                </td>
                <td className="py-2.5 pr-3 font-mono text-text-muted">
                  {skill.projectsUsed.length}
                </td>
                <td className="py-2.5 pr-3 font-mono text-text-muted">
                  {avgScore !== null ? `${avgScore}/100` : "—"}
                </td>
                <td className="w-40 py-2.5">
                  <div className="flex items-center gap-2">
                    <Progress value={skill.completionPercent} className="h-1.5" />
                    <span className="w-9 shrink-0 font-mono text-xs text-text-faint">
                      {skill.completionPercent}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

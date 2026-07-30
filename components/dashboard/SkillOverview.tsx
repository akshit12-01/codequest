import Link from "next/link";
import type { AppState } from "@/types";
import { SKILL_DEFS } from "@/config/skills";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SkillBadge } from "@/components/common/SkillBadge";

export function SkillOverview({ state }: { state: AppState }) {
  const skills = SKILL_DEFS.map((def) => state.skills[def.id])
    .filter(Boolean)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 6);

  return (
    <Card className="animate-rise-in">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Skill overview</CardTitle>
        <Link href="/roadmap" className="text-xs text-primary-soft hover:underline">
          View roadmap
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {skills.length === 0 ? (
          <p className="text-sm text-text-muted">
            Complete your first topic to start leveling up skills.
          </p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex items-center justify-between">
                <SkillBadge skillId={skill.id} level={skill.level} size="sm" />
                <span className="font-mono text-xs text-text-muted">
                  {skill.completionPercent}%
                </span>
              </div>
              <Progress value={skill.completionPercent} className="mt-1.5 h-1.5" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

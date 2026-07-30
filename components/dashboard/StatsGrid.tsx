import { BookOpen, FolderGit2, TrendingUp, TrendingDown, Star, Bot, Library, Map } from "lucide-react";
import type { DashboardStats } from "@/lib/statsEngine";
import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        icon={BookOpen}
        label="Topics completed"
        value={`${stats.topicsCompleted}/${stats.totalTopics}`}
        accent="info"
      />
      <StatCard
        icon={FolderGit2}
        label="Projects submitted"
        value={String(stats.projectsSubmitted)}
        sublabel={`${stats.projectsReviewed} reviewed`}
        accent="primary"
      />
      <StatCard
        icon={TrendingUp}
        label="Best skill"
        value={stats.bestSkill ? stats.bestSkill.name : "—"}
        sublabel={stats.bestSkill ? `Level ${stats.bestSkill.level}` : undefined}
        accent="success"
      />
      <StatCard
        icon={TrendingDown}
        label="Weakest skill"
        value={stats.weakestSkill ? stats.weakestSkill.name : "—"}
        sublabel={stats.weakestSkill ? `Level ${stats.weakestSkill.level}` : undefined}
        accent="warning"
      />
      <StatCard
        icon={Star}
        label="Avg project rating"
        value={stats.avgProjectRating !== null ? `${stats.avgProjectRating}/100` : "—"}
        accent="primary"
      />
      <StatCard
        icon={Bot}
        label="Avg skill score"
        value={stats.avgSkillScore !== null ? `${stats.avgSkillScore}/100` : "—"}
        accent="info"
      />
      <StatCard icon={Library} label="Books referenced" value={String(stats.booksEncountered)} accent="success" />
      <StatCard icon={Map} label="Roadmap progress" value={`${stats.roadmapProgressPercent}%`} accent="warning" />
    </div>
  );
}

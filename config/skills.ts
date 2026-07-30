import type { SkillDef } from "@/types";

export const SKILL_DEFS: SkillDef[] = [
  { id: "html", name: "HTML", colorVar: "html" },
  { id: "css", name: "CSS", colorVar: "css" },
  { id: "javascript", name: "JavaScript", colorVar: "javascript" },
  { id: "typescript", name: "TypeScript", colorVar: "typescript" },
  { id: "node", name: "Node.js", colorVar: "node" },
  { id: "express", name: "Express", colorVar: "express" },
  { id: "mongodb", name: "MongoDB", colorVar: "mongodb" },
  { id: "jwt", name: "JWT", colorVar: "jwt" },
  { id: "docker", name: "Docker", colorVar: "docker" },
  { id: "redis", name: "Redis", colorVar: "redis" },
  { id: "git", name: "Git", colorVar: "git" },
  { id: "github", name: "GitHub", colorVar: "github" },
  { id: "sql", name: "SQL", colorVar: "sql" },
  { id: "postgresql", name: "PostgreSQL", colorVar: "postgresql" },
];

const BY_ID = new Map(SKILL_DEFS.map((s) => [s.id, s]));

export function getSkillDef(id: string): SkillDef {
  return BY_ID.get(id) ?? { id, name: id, colorVar: "node" };
}

/** Maps loose AI-provided skill name strings onto our canonical skill ids. */
const SKILL_ALIASES: Record<string, string> = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  node: "node",
  nodejs: "node",
  express: "express",
  expressjs: "express",
  mongo: "mongodb",
  mongodb: "mongodb",
  mongoose: "mongodb",
  jwt: "jwt",
  jsonwebtoken: "jwt",
  docker: "docker",
  redis: "redis",
  git: "git",
  github: "github",
  sql: "sql",
  postgres: "postgresql",
  postgresql: "postgresql",
  html: "html",
  css: "css",
};

export function normalizeSkillName(raw: string): string {
  const key = raw
    .trim()
    .toLowerCase()
    .replace(/\.js$/, "")
    .replace(/[^a-z0-9]/g, "");
  return SKILL_ALIASES[key] ?? (key || "other");
}

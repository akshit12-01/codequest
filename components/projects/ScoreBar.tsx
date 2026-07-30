import { Progress } from "@/components/ui/progress";

export function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-success" : value >= 60 ? "bg-warning" : "bg-danger";
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">{label}</span>
        <span className="font-mono text-text">{value}</span>
      </div>
      <Progress value={value} className="mt-1 h-1.5" barClassName={color} />
    </div>
  );
}

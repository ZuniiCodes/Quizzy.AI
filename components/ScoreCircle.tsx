"use client";

interface ScoreCircleProps {
  score: number;
  total: number;
}

export default function ScoreCircle({ score, total }: ScoreCircleProps) {
  const percentage = (score / total) * 100;
  const strokeDasharray = 283; // 2 * PI * 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted/30"
        />
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Score</span>
        <span className="text-5xl font-bold">{score}/{total}</span>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import {
  formatGradeLabel,
  type Level,
  type Subject,
} from "@/types/reading-material";

const subjectStyles: Record<Subject, string> = {
  English: "bg-[#e4f1f2] text-[#22646c]",
  Filipino: "bg-rose-100 text-rose-700",
  Math: "bg-amber-100 text-amber-800",
  Science: "bg-emerald-100 text-emerald-700",
  "Araling Panlipunan": "bg-sky-100 text-sky-800",
  MAPEH: "bg-violet-100 text-violet-800",
  GMRC: "bg-orange-100 text-orange-800",
};

const levelStyles: Record<Level, string> = {
  1: "bg-emerald-100 text-emerald-800",
  2: "bg-amber-100 text-amber-800",
  3: "bg-rose-100 text-rose-800",
};

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function SoftBadge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

export function SubjectBadge({ subject }: { subject: Subject }) {
  return (
    <SoftBadge className={subjectStyles[subject]}>{subject}</SoftBadge>
  );
}

export function GradeBadge({ grade }: { grade: number }) {
  return (
    <SoftBadge className="bg-[#e4f1f2] text-[#22646c]">
      {formatGradeLabel(grade)}
    </SoftBadge>
  );
}

export function WeekBadge({ week }: { week: number }) {
  return (
    <SoftBadge className="bg-violet-100 text-violet-800">Week {week}</SoftBadge>
  );
}

export function LevelBadge({ level }: { level: Level }) {
  return (
    <SoftBadge className={levelStyles[level]}>Level {level}</SoftBadge>
  );
}

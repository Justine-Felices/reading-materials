"use client";

import { GRADES, type Grade } from "@/types/reading-material";

interface GradeSelectorProps {
  selected: Grade | null;
  onChange: (grade: Grade) => void;
}

const gradeThemes: Record<
  Grade,
  {
    card: string;
    label: string;
    number: string;
    wave: string;
    ring: string;
  }
> = {
  1: {
    card: "bg-[#e4f1f2]",
    label: "text-[#22646c]",
    number: "text-[#2d7a83]",
    wave: "bg-[#b8d6d9]/70",
    ring: "ring-[#22646c]",
  },  2: {
    card: "bg-[#eafaf0]",
    label: "text-[#22c55e]",
    number: "text-[#4ade80]",
    wave: "bg-[#bbf7d0]/70",
    ring: "ring-[#22c55e]",
  },
  3: {
    card: "bg-[#fff8e8]",
    label: "text-[#f59e0b]",
    number: "text-[#fbbf24]",
    wave: "bg-[#fde68a]/70",
    ring: "ring-[#f59e0b]",
  },
  4: {
    card: "bg-[#fff0f3]",
    label: "text-[#f43f5e]",
    number: "text-[#fb7185]",
    wave: "bg-[#fecdd3]/70",
    ring: "ring-[#f43f5e]",
  },
  5: {
    card: "bg-[#f5f0ff]",
    label: "text-[#8b5cf6]",
    number: "text-[#a78bfa]",
    wave: "bg-[#ddd6fe]/70",
    ring: "ring-[#8b5cf6]",
  },
  6: {
    card: "bg-[#eefbfb]",
    label: "text-[#14b8a6]",
    number: "text-[#2dd4bf]",
    wave: "bg-[#99f6e4]/70",
    ring: "ring-[#14b8a6]",
  },
};

function GradeIcon({ grade }: { grade: Grade }) {
  switch (grade) {
    case 1:
      return (
        <div className="relative h-12 w-12">
          <div className="absolute bottom-0 left-1 h-7 w-9 rounded-sm bg-sky-400" />
          <div className="absolute bottom-1.5 left-2.5 h-7 w-9 rounded-sm bg-emerald-400" />
          <div className="absolute bottom-3 left-4 h-7 w-9 rounded-sm bg-amber-300" />
        </div>
      );
    case 2:
      return (
        <div className="relative flex h-12 w-14 items-end justify-center">
          <div className="h-9 w-6 -rotate-6 rounded-sm bg-sky-300" />
          <div className="h-9 w-6 rotate-6 rounded-sm bg-sky-500" />
          <span className="absolute -right-0.5 top-0 text-xs">✨</span>
        </div>
      );
    case 3:
      return (
        <div className="relative flex h-12 w-10 items-center justify-center">
          <div className="h-11 w-2.5 rotate-[-20deg] rounded-full bg-amber-400">
            <div className="h-2.5 w-full rounded-t-full bg-rose-300" />
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-700" />
          </div>
          <span className="absolute -right-1 top-0 text-xs">✨</span>
        </div>
      );
    case 4:
      return (
        <div className="relative h-12 w-11">
          <div className="absolute inset-x-1 bottom-0 top-1 rounded-sm bg-rose-400 shadow-sm" />
          <div className="absolute right-0 top-2 h-5 w-2 rounded-sm bg-rose-300" />
          <span className="absolute -right-1 top-0 text-xs">✨</span>
        </div>
      );
    case 5:
      return (
        <div className="relative h-12 w-12">
          <div className="absolute bottom-0 left-1 h-7 w-9 rounded-sm bg-sky-400" />
          <div className="absolute bottom-1.5 left-2.5 h-7 w-9 rounded-sm bg-emerald-400" />
          <div className="absolute bottom-3 left-4 h-7 w-9 rounded-sm bg-violet-400" />
        </div>
      );
    case 6:
      return (
        <div className="relative flex h-12 w-14 items-center justify-center">
          <div className="h-3 w-12 rounded-sm bg-slate-700" />
          <div className="absolute top-5 h-0 w-0 border-l-[18px] border-r-[18px] border-t-[14px] border-l-transparent border-r-transparent border-t-slate-800" />
          <div className="absolute right-1 top-6 h-5 w-0.5 bg-amber-400" />
          <div className="absolute right-0 top-10 h-2 w-2 rounded-full bg-amber-400" />
        </div>
      );
  }
}

export default function GradeSelector({
  selected,
  onChange,
}: GradeSelectorProps) {
  return (
    <div>
      <div className="mb-5 flex items-start gap-2.5">
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center" aria-hidden="true">
          <span className="relative block h-6 w-6">
            <span className="absolute bottom-0 left-0 h-3.5 w-5 rounded-[2px] bg-sky-400" />
            <span className="absolute bottom-1 left-1 h-3.5 w-5 rounded-[2px] bg-sky-500" />
            <span className="absolute bottom-2 left-2 h-3.5 w-5 rounded-[2px] bg-sky-600" />
          </span>
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-[#163a40] sm:text-2xl">
            Choose Your Grade
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Pick a grade 1 to 6 to see reading materials by week and level.
          </p>
        </div>
      </div>

      <div
        className="-mx-4 snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
        role="listbox"
        aria-label="Select grade"
      >
        <div className="flex w-max gap-3 sm:grid sm:w-auto sm:grid-cols-3 lg:grid-cols-6">
        {GRADES.map((grade) => {
          const theme = gradeThemes[grade];
          const isActive = selected === grade;

          return (
            <button
              key={grade}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => onChange(grade)}
              className={`group relative w-[9.25rem] shrink-0 snap-start min-h-[9.75rem] overflow-hidden rounded-2xl p-3.5 text-left shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto sm:shrink ${theme.card} ${
                isActive ? `ring-2 ${theme.ring} ring-offset-2` : ""
              }`}
            >
              <span className={`text-[13px] font-bold ${theme.label}`}>
                Grade {grade}
              </span>

              <span
                className={`mt-0.5 block font-display text-[2.75rem] font-bold leading-none ${theme.number}`}
              >
                {grade}
              </span>

              <span className="absolute right-3 top-9" aria-hidden="true">
                <GradeIcon grade={grade} />
              </span>

              <span
                className={`absolute -bottom-5 -left-6 h-16 w-32 rounded-[100%] ${theme.wave}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}

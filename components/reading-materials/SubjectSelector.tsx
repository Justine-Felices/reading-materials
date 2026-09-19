"use client";

import { BookMarked, BookOpen, FlaskConical } from "lucide-react";
import { SUBJECTS, type Subject } from "@/types/reading-material";

interface SubjectSelectorProps {
  selected: Subject | null;
  onChange: (subject: Subject) => void;
  availableSubjects?: Subject[];
}

const subjectThemes: Record<
  Subject,
  {
    card: string;
    label: string;
    icon: string;
    ring: string;
    Icon: typeof BookOpen;
  }
> = {
  English: {
    card: "bg-[#e4f1f2]",
    label: "text-[#22646c]",
    icon: "text-[#2d7a83]",
    ring: "ring-[#22646c]",
    Icon: BookOpen,
  },
  Filipino: {
    card: "bg-[#fff0f3]",
    label: "text-[#f43f5e]",
    icon: "text-[#fb7185]",
    ring: "ring-[#f43f5e]",
    Icon: BookMarked,
  },
  Science: {
    card: "bg-[#eafaf0]",
    label: "text-[#22c55e]",
    icon: "text-[#4ade80]",
    ring: "ring-[#22c55e]",
    Icon: FlaskConical,
  },
};

export default function SubjectSelector({
  selected,
  onChange,
  availableSubjects,
}: SubjectSelectorProps) {
  const subjects =
    availableSubjects && availableSubjects.length > 0
      ? availableSubjects
      : SUBJECTS;

  return (
    <div>
      <div className="mb-5 flex items-start gap-2.5">
        <span
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"
          aria-hidden="true"
        >
          <BookOpen className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-[#163a40] sm:text-2xl">
            Choose Your Subject
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Pick a subject to see materials by week and level.
          </p>
        </div>
      </div>

      <div
        className="-mx-4 snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
        role="listbox"
        aria-label="Select subject"
      >
        <div className="flex w-max gap-3 sm:grid sm:w-auto sm:grid-cols-3 lg:grid-cols-6">
        {subjects.map((subject) => {
          const theme = subjectThemes[subject];
          const Icon = theme.Icon;
          const isActive = selected === subject;

          return (
            <button
              key={subject}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => onChange(subject)}
              className={`group relative w-[9.25rem] shrink-0 snap-start min-h-[7.5rem] overflow-hidden rounded-2xl p-3.5 text-left shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto sm:shrink ${theme.card} ${
                isActive ? `ring-2 ${theme.ring} ring-offset-2` : ""
              }`}
            >
              <span className={`mb-3 inline-flex ${theme.icon}`} aria-hidden="true">
                <Icon className="h-7 w-7" strokeWidth={1.75} />
              </span>
              <span className={`block text-sm font-bold leading-snug ${theme.label}`}>
                {subject}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}

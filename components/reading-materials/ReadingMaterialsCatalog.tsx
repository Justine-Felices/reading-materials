"use client";

import { BookOpen } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMaterials } from "@/components/materials/MaterialsProvider";
import GradeSelector from "@/components/reading-materials/GradeSelector";
import ReadingMaterialCard from "@/components/reading-materials/ReadingMaterialCard";
import ReadingMaterialSearch from "@/components/reading-materials/ReadingMaterialSearch";
import SubjectSelector from "@/components/reading-materials/SubjectSelector";
import {
  LEVELS,
  type Grade,
  type Level,
  type Subject,
} from "@/types/reading-material";

export default function ReadingMaterialsCatalog() {
  const { getByGrade } = useMaterials();
  const [grade, setGrade] = useState<Grade | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [query, setQuery] = useState("");
  const subjectSectionRef = useRef<HTMLDivElement>(null);
  const materialsSectionRef = useRef<HTMLDivElement>(null);

  const gradeMaterials = useMemo(() => {
    if (!grade) return [];
    return getByGrade(grade);
  }, [grade, getByGrade]);

  const availableSubjects = useMemo(() => {
    const set = new Set(gradeMaterials.map((m) => m.subject));
    return Array.from(set);
  }, [gradeMaterials]);

  const subjectMaterials = useMemo(() => {
    if (!subject) return [];
    return gradeMaterials.filter((m) => m.subject === subject);
  }, [gradeMaterials, subject]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return subjectMaterials;

    return subjectMaterials.filter((material) => {
      const haystack = [
        material.title,
        material.description,
        material.subject,
        `week ${material.week}`,
        `level ${material.level}`,
        `grade ${material.grade}`,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [subjectMaterials, query]);

  const weekGroups = useMemo(() => {
    const weeks = Array.from(new Set(filtered.map((m) => m.week))).sort(
      (a, b) => a - b,
    );

    return weeks.map((week) => {
      const weekMaterials = filtered.filter((m) => m.week === week);
      const levels = LEVELS.map((level: Level) => ({
        level,
        materials: weekMaterials.filter((m) => m.level === level),
      }));

      return { week, levels };
    });
  }, [filtered]);

  useEffect(() => {
    if (!grade) return;
    const timer = window.setTimeout(() => {
      subjectSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [grade]);

  useEffect(() => {
    if (!grade || !subject) return;
    const timer = window.setTimeout(() => {
      materialsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [grade, subject]);

  const handleGradeChange = (nextGrade: Grade) => {
    setGrade(nextGrade);
    setSubject(null);
    setQuery("");
  };

  const handleSubjectChange = (nextSubject: Subject) => {
    setSubject(nextSubject);
    setQuery("");
  };

  return (
    <section className="space-y-8">
      <GradeSelector selected={grade} onChange={handleGradeChange} />

      {grade ? (
        <div ref={subjectSectionRef} className="scroll-mt-28">
          <SubjectSelector
            selected={subject}
            onChange={handleSubjectChange}
            availableSubjects={availableSubjects}
          />
        </div>
      ) : null}

      {grade && subject ? (
        <div ref={materialsSectionRef} className="scroll-mt-28 space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Grade {grade} · {subject}
              </h2>
              <p className="text-sm text-muted">
                Sorted by week, then Level 1–3
              </p>
            </div>
            <div className="w-full sm:max-w-md">
              <ReadingMaterialSearch value={query} onChange={setQuery} />
            </div>
          </div>

          {weekGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-white px-6 py-16 text-center shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-primary-dark">
                <BookOpen className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl text-foreground">
                No materials found
              </h3>
              <p className="mt-2 max-w-md text-muted">
                Try another subject, or ask your teacher to upload one.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {weekGroups.map(({ week, levels }) => (
                <section key={week} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                      Week {week}
                    </h3>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {levels.map(({ level, materials }) => (
                      <div
                        key={`${week}-${level}`}
                        className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4"
                      >
                        <div className="mb-3">
                          <span
                            className={`inline-flex min-h-9 items-center rounded-full px-3 py-1.5 text-sm font-bold ${
                              level === 1
                                ? "bg-emerald-100 text-emerald-800"
                                : level === 2
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            Level {level}
                          </span>
                        </div>

                        {materials.length > 0 ? (
                          <div className="space-y-4">
                            {materials.map((item) => (
                              <ReadingMaterialCard
                                key={item.id}
                                material={item}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="py-6 text-sm text-muted">
                            No materials yet.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

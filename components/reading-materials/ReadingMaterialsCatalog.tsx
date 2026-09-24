"use client";

import { BookOpen, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMaterials } from "@/components/materials/MaterialsProvider";
import GradeSelector from "@/components/reading-materials/GradeSelector";
import ReadingMaterialCard from "@/components/reading-materials/ReadingMaterialCard";
import ReadingMaterialSearch from "@/components/reading-materials/ReadingMaterialSearch";
import SubjectSelector from "@/components/reading-materials/SubjectSelector";
import {
  buildCatalogHref,
  parseCatalogBrowse,
} from "@/lib/catalog-browse";
import {
  LEVELS,
  SUBJECTS,
  formatGradeLabel,
  type Grade,
  type Level,
  type Subject,
} from "@/types/reading-material";

export default function ReadingMaterialsCatalog() {
  const { getByGrade } = useMaterials();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(
    () => parseCatalogBrowse(searchParams),
    // Only seed from the first URL; later updates go through handlers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [grade, setGrade] = useState<Grade | null>(initial.grade);
  const [subject, setSubject] = useState<Subject | null>(initial.subject);
  const [focusWeek, setFocusWeek] = useState<number | null>(initial.week);
  const [openWeek, setOpenWeek] = useState<number | null>(initial.week);
  const [query, setQuery] = useState("");
  const subjectSectionRef = useRef<HTMLDivElement>(null);
  const materialsSectionRef = useRef<HTMLDivElement>(null);
  const weekRefs = useRef<Map<number, HTMLElement>>(new Map());
  const skipScrollRef = useRef(Boolean(initial.grade));

  const gradeMaterials = useMemo(() => {
    if (grade == null) return [];
    return getByGrade(grade);
  }, [grade, getByGrade]);

  // Keep restored subject if it's a valid subject for this school.
  useEffect(() => {
    if (!subject) return;
    if (!(SUBJECTS as readonly string[]).includes(subject)) {
      setSubject(null);
    }
  }, [subject]);

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

  const syncUrl = (next: {
    grade: Grade | null;
    subject: Subject | null;
    week?: number | null;
  }) => {
    const href = buildCatalogHref({
      grade: next.grade,
      subject: next.subject,
      week: next.week ?? null,
    });
    const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    if (href !== current) {
      router.replace(href, { scroll: false });
    }
  };

  useEffect(() => {
    if (grade == null) return;
    if (skipScrollRef.current) return;
    const timer = window.setTimeout(() => {
      subjectSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [grade]);

  useEffect(() => {
    if (grade == null || !subject) return;
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      if (focusWeek != null) {
        const timer = window.setTimeout(() => {
          weekRefs.current
            .get(focusWeek)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return () => window.clearTimeout(timer);
      }
      return;
    }
    const timer = window.setTimeout(() => {
      materialsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [grade, subject, focusWeek]);

  const handleGradeChange = (nextGrade: Grade) => {
    skipScrollRef.current = false;
    setFocusWeek(null);
    setOpenWeek(null);
    setGrade(nextGrade);
    setSubject(null);
    setQuery("");
    syncUrl({ grade: nextGrade, subject: null, week: null });
  };

  const handleSubjectChange = (nextSubject: Subject) => {
    skipScrollRef.current = false;
    setFocusWeek(null);
    setOpenWeek(null);
    setSubject(nextSubject);
    setQuery("");
    syncUrl({ grade, subject: nextSubject, week: null });
  };

  const toggleWeek = (week: number) => {
    const next = openWeek === week ? null : week;
    setOpenWeek(next);
    setFocusWeek(next);
    syncUrl({ grade, subject, week: next });
  };

  return (
    <section className="space-y-8">
      <GradeSelector selected={grade} onChange={handleGradeChange} />

      {grade != null ? (
        <div ref={subjectSectionRef} className="scroll-mt-28">
          <SubjectSelector
            selected={subject}
            onChange={handleSubjectChange}
          />
        </div>
      ) : null}

      {grade != null && subject ? (
        <div ref={materialsSectionRef} className="scroll-mt-28 space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {formatGradeLabel(grade)} · {subject}
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
            <div className="space-y-3">
              {weekGroups.map(({ week, levels }) => {
                const isOpen = openWeek === week;
                const materialCount = levels.reduce(
                  (sum, { materials }) => sum + materials.length,
                  0,
                );
                const panelId = `week-${week}-panel`;

                return (
                  <section
                    key={week}
                    ref={(node) => {
                      if (node) weekRefs.current.set(week, node);
                      else weekRefs.current.delete(week);
                    }}
                    className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
                  >
                    <h3 className="m-0">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleWeek(week)}
                        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-5"
                      >
                        <span className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                          Week {week}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                          {materialCount}{" "}
                          {materialCount === 1 ? "material" : "materials"}
                        </span>
                        <ChevronDown
                          className={`ml-auto h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>

                    {isOpen ? (
                      <div
                        id={panelId}
                        role="region"
                        aria-label={`Week ${week} materials`}
                        className="border-t border-slate-100 px-3 pb-4 pt-3 sm:px-4 sm:pb-5"
                      >
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
                                      browseContext={{
                                        grade,
                                        subject,
                                        week: item.week,
                                      }}
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
                      </div>
                    ) : null}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

import {
  GRADES,
  SUBJECTS,
  type Grade,
  type Subject,
} from "@/types/reading-material";

export type CatalogBrowseState = {
  grade: Grade | null;
  subject: Subject | null;
  week: number | null;
};

function parseGrade(value: string | null): Grade | null {
  if (!value) return null;
  const n = Number(value);
  return (GRADES as number[]).includes(n) ? (n as Grade) : null;
}

function parseSubject(value: string | null): Subject | null {
  if (!value) return null;
  return (SUBJECTS as string[]).includes(value) ? (value as Subject) : null;
}

function parseWeek(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 52) return null;
  return n;
}

export function parseCatalogBrowse(
  params: URLSearchParams | { get: (key: string) => string | null },
): CatalogBrowseState {
  return {
    grade: parseGrade(params.get("grade")),
    subject: parseSubject(params.get("subject")),
    week: parseWeek(params.get("week")),
  };
}

export function buildCatalogHref(state: {
  grade?: Grade | null;
  subject?: Subject | null;
  week?: number | null;
}): string {
  const params = new URLSearchParams();
  if (state.grade != null) params.set("grade", String(state.grade));
  if (state.subject) params.set("subject", state.subject);
  if (state.week != null) params.set("week", String(state.week));
  const qs = params.toString();
  return qs ? `/reading-materials?${qs}` : "/reading-materials";
}

export function buildMaterialHref(
  id: string,
  state: {
    grade?: Grade | null;
    subject?: Subject | null;
    week?: number | null;
  },
): string {
  const params = new URLSearchParams();
  if (state.grade != null) params.set("grade", String(state.grade));
  if (state.subject) params.set("subject", state.subject);
  if (state.week != null) params.set("week", String(state.week));
  const qs = params.toString();
  return qs
    ? `/reading-materials/${id}?${qs}`
    : `/reading-materials/${id}`;
}

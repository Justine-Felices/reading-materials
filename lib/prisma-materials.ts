import type { Prisma } from "@prisma/client";
import type {
  Grade,
  Level,
  ReadingMaterial,
  ReadingPage,
  Subject,
  ThumbnailTheme,
} from "@/types/reading-material";

export function materialToPrismaCreate(
  material: ReadingMaterial,
): Prisma.ReadingMaterialCreateInput {
  return {
    id: material.id,
    title: material.title,
    description: material.description,
    subject: material.subject,
    grade: material.grade,
    week: material.week,
    level: material.level,
    thumbnail: material.thumbnail,
    coverImageUrl: material.coverImageUrl ?? null,
    downloadUrl: material.downloadUrl ?? null,
    featured: Boolean(material.featured),
    pages: material.pages as unknown as Prisma.InputJsonValue,
  };
}

export function prismaRowToMaterial(row: {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  week: number;
  level: number;
  thumbnail: string;
  coverImageUrl: string | null;
  downloadUrl: string | null;
  featured: boolean;
  pages: unknown;
}): ReadingMaterial {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    subject: row.subject as Subject,
    grade: row.grade as Grade,
    week: row.week,
    level: row.level as Level,
    thumbnail: row.thumbnail as ThumbnailTheme,
    coverImageUrl: row.coverImageUrl ?? undefined,
    downloadUrl: row.downloadUrl ?? undefined,
    featured: row.featured,
    pages: Array.isArray(row.pages) ? (row.pages as ReadingPage[]) : [],
  };
}

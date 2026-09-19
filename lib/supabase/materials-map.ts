import type {
  Grade,
  Level,
  ReadingMaterial,
  ReadingPage,
  Subject,
  ThumbnailTheme,
} from "@/types/reading-material";

export type ReadingMaterialRow = {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  week: number;
  level: number;
  thumbnail: string;
  cover_image_url: string | null;
  download_url: string | null;
  featured: boolean;
  pages: ReadingPage[] | unknown;
  created_at?: string;
  updated_at?: string;
};

export function materialToRow(material: ReadingMaterial): ReadingMaterialRow {
  return {
    id: material.id,
    title: material.title,
    description: material.description,
    subject: material.subject,
    grade: material.grade,
    week: material.week,
    level: material.level,
    thumbnail: material.thumbnail,
    cover_image_url: material.coverImageUrl ?? null,
    download_url: material.downloadUrl ?? null,
    featured: Boolean(material.featured),
    pages: material.pages,
  };
}

export function rowToMaterial(row: ReadingMaterialRow): ReadingMaterial {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    subject: row.subject as Subject,
    grade: row.grade as Grade,
    week: row.week,
    level: row.level as Level,
    thumbnail: row.thumbnail as ThumbnailTheme,
    coverImageUrl: row.cover_image_url ?? undefined,
    downloadUrl: row.download_url ?? undefined,
    featured: row.featured,
    pages: Array.isArray(row.pages) ? (row.pages as ReadingPage[]) : [],
  };
}

export type Subject =
  | "English"
  | "Filipino"
  | "Math"
  | "Science"
  | "Araling Panlipunan"
  | "MAPEH"
  | "GMRC";

/** 0 = Kinder, then Grades 1–6 */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Level = 1 | 2 | 3;

export type ThumbnailTheme =
  | "hen"
  | "plant"
  | "fractions"
  | "community"
  | "phonics"
  | "water"
  | "operations"
  | "heroes";

export type PageMediaType = "image" | "pdf";

export interface ReadingPage {
  pageNumber: number;
  title?: string;
  content: string[];
  illustration?: ThumbnailTheme;
  /** Full-page worksheet, photo, or PDF (path, http(s), or blob URL) */
  imageUrl?: string;
  /** Defaults to image when omitted */
  mediaType?: PageMediaType;
}

export interface ReadingMaterial {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  grade: Grade;
  week: number;
  level: Level;
  thumbnail: ThumbnailTheme;
  /** Optional cover/worksheet image in /public */
  coverImageUrl?: string;
  /** Ready for a real PDF URL later */
  downloadUrl?: string;
  featured?: boolean;
  pages: ReadingPage[];
}

export const GRADES: Grade[] = [0, 1, 2, 3, 4, 5, 6];
export const LEVELS: Level[] = [1, 2, 3];
export const SUBJECTS: Subject[] = [
  "English",
  "Filipino",
  "Math",
  "Science",
  "Araling Panlipunan",
  "MAPEH",
  "GMRC",
];

/** Display label: Kinder for 0, otherwise "Grade N". */
export function formatGradeLabel(grade: number): string {
  return grade === 0 ? "Kinder" : `Grade ${grade}`;
}
export const THUMBNAIL_THEMES: ThumbnailTheme[] = [
  "hen",
  "plant",
  "fractions",
  "community",
  "phonics",
  "water",
  "operations",
  "heroes",
];

export function createPlaceholderPages(
  title: string,
  description: string,
  thumbnail?: ThumbnailTheme,
): ReadingPage[] {
  return [
    {
      pageNumber: 1,
      title,
      content: [
        description,
        "This reading material was added by a teacher. More pages can be added later.",
      ],
      illustration: thumbnail,
    },
    {
      pageNumber: 2,
      title: "Keep Reading",
      content: [
        "Take your time and read carefully.",
        "Ask your teacher if you need help with new words.",
      ],
    },
  ];
}

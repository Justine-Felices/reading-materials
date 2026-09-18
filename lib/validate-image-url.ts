import type { PageMediaType } from "@/types/reading-material";

/** Accept absolute http(s) URLs, site-relative paths, blob:, or data: URLs. */
export function isValidMediaUrlShape(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) return trimmed.length > 1;
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) return true;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function detectMediaType(
  url: string,
  hint?: PageMediaType | null,
  mimeType?: string | null,
): PageMediaType {
  if (hint === "image" || hint === "pdf") return hint;
  if (mimeType?.includes("pdf")) return "pdf";
  if (mimeType?.startsWith("image/")) return "image";

  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("data:application/pdf")) return "pdf";
  if (trimmed.startsWith("data:image/")) return "image";

  const path = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;
  if (path.endsWith(".pdf")) return "pdf";
  return "image";
}

/** Resolves when the browser can load the image; rejects on error/timeout. */
export function loadImageUrl(url: string, timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const img = new window.Image();
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Image load timed out."));
    }, timeoutMs);

    const cleanup = () => {
      window.clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      cleanup();
      resolve();
    };
    img.onerror = () => {
      cleanup();
      reject(new Error("Image failed to load."));
    };
    img.src = url.trim();
  });
}

export async function validateMediaUrls(
  entries: { url: string; mediaType: PageMediaType }[],
): Promise<string | null> {
  if (entries.length === 0) {
    return "Add at least one image or PDF (URL or attachment).";
  }

  for (let i = 0; i < entries.length; i += 1) {
    const { url, mediaType } = entries[i];
    if (!isValidMediaUrlShape(url)) {
      return `Page ${i + 1}: enter a valid path/URL or attach a file.`;
    }

    if (mediaType === "pdf") {
      // Shape check is enough — remote PDFs often block HEAD/CORS.
      continue;
    }

    try {
      await loadImageUrl(url);
    } catch {
      return `Page ${i + 1}: image could not be loaded. Check the URL or file.`;
    }
  }

  return null;
}

/** @deprecated Use validateMediaUrls */
export async function validateImageUrls(urls: string[]): Promise<string | null> {
  return validateMediaUrls(
    urls.map((url) => ({ url, mediaType: detectMediaType(url) })),
  );
}

export const isValidImageUrlShape = isValidMediaUrlShape;

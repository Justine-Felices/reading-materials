import type { ReadingMaterial } from "@/types/reading-material";
import { detectMediaType } from "@/lib/validate-image-url";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function getFileUrl(material: ReadingMaterial): string | undefined {
  if (material.downloadUrl) return material.downloadUrl;
  if (material.coverImageUrl) return material.coverImageUrl;
  const imagePage = material.pages.find((page) => page.imageUrl);
  return imagePage?.imageUrl;
}

function getDownloadExtension(
  material: ReadingMaterial,
  fileUrl: string,
): string {
  const page =
    material.pages.find((p) => p.imageUrl === fileUrl) ?? material.pages[0];
  const mediaType = detectMediaType(fileUrl, page?.mediaType);
  if (mediaType === "pdf") return "pdf";

  const fromPath = fileUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
  if (fromPath && fromPath.length <= 5 && !fromPath.includes("/")) {
    return fromPath;
  }
  return "jpg";
}

function buildTextContent(material: ReadingMaterial): string {
  const lines = [
    material.title,
    `${material.subject} · Grade ${material.grade} · Week ${material.week} · Level ${material.level}`,
    "",
    material.description,
    "",
  ];

  for (const page of material.pages) {
    if (page.title) lines.push(`--- ${page.title} ---`);
    for (const paragraph of page.content) {
      lines.push(paragraph);
      lines.push("");
    }
  }

  return lines.join("\n").trim() + "\n";
}

/** Triggers a real file download for the material (image, PDF, or text fallback). */
export async function downloadMaterial(
  material: ReadingMaterial,
): Promise<void> {
  const fileUrl = getFileUrl(material);
  const baseName = slugify(material.title) || material.id;

  if (fileUrl) {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Unable to download file.");
    }

    const blob = await response.blob();
    const extension = getDownloadExtension(material, fileUrl);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${baseName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    return;
  }

  const text = buildTextContent(material);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `${baseName}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

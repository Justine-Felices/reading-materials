"use client";

import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type PdfCoverThumbnailProps = {
  url: string;
  alt?: string;
  className?: string;
};

export default function PdfCoverThumbnail({
  url,
  alt = "PDF cover",
  className = "",
}: PdfCoverThumbnailProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const renderCover = async () => {
      setFailed(false);
      setPreviewUrl(null);

      try {
        const pdf = await getDocument({ url }).promise;
        const page = await pdf.getPage(1);
        const unscaled = page.getViewport({ scale: 1 });
        const targetWidth = 480;
        const scale = targetWidth / unscaled.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas unavailable");
        }

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({
          canvasContext: context,
          viewport,
          canvas,
        }).promise;

        objectUrl = canvas.toDataURL("image/jpeg", 0.82);
        if (!cancelled) {
          setPreviewUrl(objectUrl);
        }

        await pdf.destroy();
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    };

    void renderCover();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (previewUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={previewUrl}
        alt={alt}
        className={`object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-primary ${className}`}
    >
      <FileText className="h-10 w-10" aria-hidden="true" />
      <span className="text-xs font-bold uppercase tracking-wide">
        {failed ? "PDF" : "…"}
      </span>
    </div>
  );
}

"use client";

import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  GradeBadge,
  LevelBadge,
  SubjectBadge,
  WeekBadge,
} from "@/components/Badges";
import MaterialThumbnail from "@/components/MaterialThumbnail";
import Toast from "@/components/Toast";
import { downloadMaterial } from "@/lib/download-material";
import type { ReadingMaterial } from "@/types/reading-material";

interface ReadingMaterialCardProps {
  material: ReadingMaterial;
  showGrade?: boolean;
}

export default function ReadingMaterialCard({
  material,
  showGrade = false,
}: ReadingMaterialCardProps) {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("Download started.");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadMaterial(material);
      setToastMessage("Download started.");
      setToastOpen(true);
    } catch {
      setToastMessage("Download failed. Please try again.");
      setToastOpen(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(34,100,108,0.14)]">
        <MaterialThumbnail
          theme={material.thumbnail}
          imageUrl={material.coverImageUrl}
          mediaType={material.pages[0]?.mediaType}
          alt={material.title}
          size="lg"
          className="h-40 w-full sm:h-44"
        />

        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-semibold leading-snug text-primary sm:text-xl">
              {material.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted">
              {material.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {showGrade ? <GradeBadge grade={material.grade} /> : null}
            <WeekBadge week={material.week} />
            <LevelBadge level={material.level} />
            <SubjectBadge subject={material.subject} />
          </div>

          <div className="mt-auto space-y-2.5 pt-2">
            <Link
              href={`/reading-materials/${material.id}`}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Read Material
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex w-full items-center justify-center gap-1.5 py-1.5 text-sm font-semibold text-slate-500 transition hover:text-primary disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Download ${material.title}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {downloading ? "Downloading…" : "Download"}
            </button>
          </div>
        </div>
      </article>

      <Toast
        message={toastMessage}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

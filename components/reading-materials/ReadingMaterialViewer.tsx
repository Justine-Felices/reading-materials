"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MaterialThumbnail from "@/components/MaterialThumbnail";
import Toast from "@/components/Toast";
import PdfDocumentViewer from "@/components/reading-materials/PdfDocumentViewer";
import { downloadMaterial } from "@/lib/download-material";
import { detectMediaType } from "@/lib/validate-image-url";
import type { ReadingMaterial } from "@/types/reading-material";

interface ReadingMaterialViewerProps {
  material: ReadingMaterial;
  backHref?: string;
}

export default function ReadingMaterialViewer({
  material,
  backHref = "/reading-materials",
}: ReadingMaterialViewerProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("Download started.");
  const [downloading, setDownloading] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const materialPageCount = material.pages.length;
  const page = material.pages[pageIndex];
  const pageMediaType = page?.imageUrl
    ? detectMediaType(page.imageUrl, page.mediaType)
    : null;
  const isPdf = pageMediaType === "pdf" && Boolean(page?.imageUrl);

  const displayTotal = isPdf
    ? Math.max(pdfPageCount, 1)
    : Math.max(materialPageCount, 1);
  const displayCurrent = isPdf ? pdfPage : pageIndex + 1;

  useEffect(() => {
    setPageIndex(0);
    setPdfPage(1);
    setPdfPageCount(0);
    setZoom(100);
  }, [material.id]);

  useEffect(() => {
    setPdfPage(1);
    setPdfPageCount(0);
  }, [pageIndex, page?.imageUrl]);

  const handlePdfPageCount = useCallback((count: number) => {
    setPdfPageCount(count);
    setPdfPage((current) => {
      if (count <= 0) return 1;
      return Math.min(Math.max(current, 1), count);
    });
  }, []);

  const goPrev = useCallback(() => {
    if (isPdf) {
      setPdfPage((current) => Math.max(1, current - 1));
      return;
    }
    setPageIndex((current) => Math.max(0, current - 1));
  }, [isPdf]);

  const goNext = useCallback(() => {
    if (isPdf) {
      setPdfPage((current) =>
        pdfPageCount > 0 ? Math.min(pdfPageCount, current + 1) : current + 1,
      );
      return;
    }
    setPageIndex((current) => Math.min(materialPageCount - 1, current + 1));
  }, [isPdf, pdfPageCount, materialPageCount]);

  const canGoPrev = isPdf ? pdfPage > 1 : pageIndex > 0;
  const canGoNext = isPdf
    ? pdfPageCount > 0 && pdfPage < pdfPageCount
    : pageIndex < materialPageCount - 1;

  const zoomOut = () => setZoom((value) => Math.max(60, value - 10));
  const zoomIn = () => setZoom((value) => Math.min(200, value + 10));

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

  const toggleFullscreen = async () => {
    const element = viewerRef.current;
    if (!element) return;

    type FsElement = HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
      webkitRequestFullScreen?: () => Promise<void> | void;
    };
    type FsDocument = Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
      webkitCancelFullScreen?: () => Promise<void> | void;
    };

    const doc = document as FsDocument;
    const el = element as FsElement;
    const nativeActive =
      document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;

    // CSS immersive mode has no native fullscreen element — use React state.
    if (isFullscreen || nativeActive) {
      try {
        if (nativeActive) {
          if (typeof document.exitFullscreen === "function") {
            await document.exitFullscreen();
          } else if (typeof doc.webkitExitFullscreen === "function") {
            await doc.webkitExitFullscreen();
          } else if (typeof doc.webkitCancelFullScreen === "function") {
            await doc.webkitCancelFullScreen();
          }
        }
      } catch {
        // Still leave immersive UI below.
      }
      setIsFullscreen(false);
      return;
    }

    try {
      if (typeof el.requestFullscreen === "function") {
        await el.requestFullscreen();
      } else if (typeof el.webkitRequestFullscreen === "function") {
        await el.webkitRequestFullscreen();
      } else if (typeof el.webkitRequestFullScreen === "function") {
        await el.webkitRequestFullScreen();
      }
      // Native or CSS immersive — either way show maximized UI.
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      const nativeActive =
        document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      // CSS immersive mode never fires this event; only sync native enter/exit.
      setIsFullscreen(Boolean(nativeActive));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange,
      );
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  return (
    <>
      <div className="space-y-6">
        <div
          ref={viewerRef}
          className={
            isFullscreen
              ? "fixed inset-0 z-50 overflow-auto rounded-none border-0 bg-slate-100 shadow-none"
              : "overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-3 bg-toolbar px-3 py-2.5 text-white sm:px-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoPrev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/10 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/10 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <span className="text-sm font-semibold tabular-nums text-white/90">
                {displayCurrent} / {displayTotal}
              </span>
              <div className="flex items-center gap-1 rounded-lg bg-white/10 px-1 py-0.5">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-12 text-center text-sm font-semibold tabular-nums">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={`Download ${material.title}`}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className={isPdf ? "bg-slate-200/70" : "bg-slate-200/70 p-3 sm:p-5 md:p-6"}>
            {isPdf && page.imageUrl ? (
              <PdfDocumentViewer
                url={page.imageUrl}
                pageNumber={pdfPage}
                zoom={zoom}
                onPageCountChange={handlePdfPageCount}
                className="h-[min(78vh,52rem)]"
              />
            ) : (
              <div className="mx-auto max-w-4xl overflow-auto">
                <article
                  className={`reader-page mx-auto min-h-[26rem] rounded-xl transition-[width] duration-200 sm:min-h-[30rem] ${
                    page.imageUrl
                      ? "overflow-hidden bg-[#0b1a3a] p-0"
                      : "bg-white p-5 sm:p-8 md:p-10"
                  }`}
                  style={{
                    width: `${zoom}%`,
                    maxWidth: "100%",
                  }}
                >
                  {page.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={page.imageUrl}
                      alt={page.title ?? material.title}
                      className="mx-auto block h-auto w-full"
                    />
                  ) : (
                    <>
                      {page.title ? (
                        <h2 className="mb-5 font-display text-2xl text-foreground sm:mb-6 sm:text-3xl">
                          {page.title}
                        </h2>
                      ) : null}

                      <div
                        className={`gap-6 ${
                          page.illustration
                            ? "grid md:grid-cols-[1.15fr_0.85fr] md:items-start"
                            : ""
                        }`}
                      >
                        <div className="space-y-4 text-base leading-8 whitespace-pre-line text-slate-700 sm:text-lg sm:leading-9">
                          {page.content.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>

                        {page.illustration ? (
                          <div className="mt-2 md:mt-0">
                            <MaterialThumbnail
                              theme={page.illustration}
                              size="xl"
                              className="mx-auto h-48 w-full max-w-xs rounded-2xl md:h-64 md:max-w-none"
                            />
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
                </article>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>

          <p className="text-sm font-bold text-slate-500" aria-live="polite">
            Page {displayCurrent} of {displayTotal}
          </p>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {downloading ? "Downloading…" : "Download Material"}
          </button>
          <Link
            href={backHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-soft px-6 text-sm font-bold text-primary-dark transition hover:bg-[#d0e6e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to Reading Materials
          </Link>
        </div>
      </div>

      <Toast
        message={toastMessage}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type PdfDocumentViewerProps = {
  url: string;
  pageNumber: number;
  zoom: number;
  onPageCountChange: (count: number) => void;
  className?: string;
};

export default function PdfDocumentViewer({
  url,
  pageNumber,
  zoom,
  onPageCountChange,
  className = "",
}: PdfDocumentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [containerWidth, setContainerWidth] = useState(800);

  const stableOnPageCountChange = useCallback(onPageCountChange, [
    onPageCountChange,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setContainerWidth(container.clientWidth || 800);
    };
    updateWidth();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setErrorMessage("");
    stableOnPageCountChange(0);

    const load = async () => {
      try {
        await pdfRef.current?.destroy();
        pdfRef.current = null;

        const pdf = await getDocument({ url }).promise;
        if (cancelled) {
          await pdf.destroy();
          return;
        }
        pdfRef.current = pdf;
        stableOnPageCountChange(pdf.numPages);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to open this PDF.",
        );
        stableOnPageCountChange(0);
      }
    };

    void load();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      void pdfRef.current?.destroy();
      pdfRef.current = null;
    };
  }, [url, stableOnPageCountChange]);

  useEffect(() => {
    if (status !== "ready" || !pdfRef.current || !canvasRef.current) return;

    let cancelled = false;

    const render = async () => {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;

      const safePage = Math.min(Math.max(pageNumber, 1), pdf.numPages);
      const page = await pdf.getPage(safePage);
      if (cancelled) return;

      const unscaled = page.getViewport({ scale: 1 });
      const fitScale = Math.max(containerWidth - 24, 320) / unscaled.width;
      const viewport = page.getViewport({ scale: fitScale * (zoom / 100) });
      const context = canvas.getContext("2d");
      if (!context) return;

      renderTaskRef.current?.cancel();
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

      const task = page.render({
        canvasContext: context,
        viewport,
        canvas,
      });
      renderTaskRef.current = task;

      try {
        await task.promise;
      } catch {
        // Ignore cancelled renders.
      }
    };

    void render();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [status, pageNumber, zoom, containerWidth]);

  if (status === "error") {
    return (
      <div
        className={`flex min-h-[28rem] items-center justify-center bg-white px-6 text-center text-sm font-semibold text-rose-600 ${className}`}
      >
        {errorMessage || "Unable to open this PDF."}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto bg-slate-200/80 ${className}`}
    >
      {status === "loading" ? (
        <div className="flex min-h-[28rem] items-center justify-center text-sm font-semibold text-slate-500">
          Loading PDF…
        </div>
      ) : null}
      <div className={`flex justify-center p-3 sm:p-4 ${status === "loading" ? "hidden" : ""}`}>
        <canvas
          ref={canvasRef}
          className="max-w-full rounded-md bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        />
      </div>
    </div>
  );
}

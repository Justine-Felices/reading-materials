"use client";

import type { ReactNode } from "react";
import PdfCoverThumbnail from "@/components/PdfCoverThumbnail";
import { detectMediaType } from "@/lib/validate-image-url";
import type { PageMediaType, ThumbnailTheme } from "@/types/reading-material";

const themes: Record<
  ThumbnailTheme,
  {
    gradient: string;
    label: string;
    shapes: ReactNode;
  }
> = {
  hen: {
    gradient: "from-orange-100 via-amber-50 to-yellow-100",
    label: "Little red hen illustration",
    shapes: (
      <>
        <div className="absolute bottom-6 left-1/2 h-16 w-20 -translate-x-1/2 rounded-[2rem] bg-red-400" />
        <div className="absolute bottom-[4.5rem] left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-red-500" />
        <div className="absolute bottom-[5.75rem] left-[calc(50%+10px)] h-3 w-4 rounded-sm bg-orange-400" />
        <div className="absolute bottom-4 left-6 h-8 w-10 rounded-full bg-amber-700/30" />
        <div className="absolute right-6 top-6 h-10 w-10 rounded-full bg-yellow-300" />
      </>
    ),
  },
  plant: {
    gradient: "from-lime-100 via-emerald-50 to-sky-100",
    label: "Plant parts illustration",
    shapes: (
      <>
        <div className="absolute bottom-4 left-1/2 h-20 w-4 -translate-x-1/2 rounded-full bg-emerald-600" />
        <div className="absolute bottom-16 left-[calc(50%-18px)] h-10 w-14 -rotate-45 rounded-full bg-emerald-400" />
        <div className="absolute bottom-20 left-[calc(50%+2px)] h-10 w-14 rotate-45 rounded-full bg-lime-400" />
        <div className="absolute bottom-28 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-rose-300" />
        <div className="absolute bottom-3 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-amber-700/40" />
      </>
    ),
  },
  fractions: {
    gradient: "from-sky-100 via-indigo-50 to-violet-100",
    label: "Fractions illustration",
    shapes: (
      <>
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-orange-200 shadow-inner">
          <div className="absolute inset-0 origin-center rotate-0 bg-orange-400 [clip-path:polygon(50%_50%,50%_0,100%_0,100%_50%)]" />
          <div className="absolute inset-0 origin-center bg-yellow-300 [clip-path:polygon(50%_50%,100%_50%,100%_100%,50%_100%)]" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/80" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-white/80" />
        </div>
      </>
    ),
  },
  community: {
    gradient: "from-amber-50 via-orange-50 to-rose-50",
    label: "Community illustration",
    shapes: (
      <>
        <div className="absolute bottom-6 left-8 h-20 w-16 rounded-t-lg bg-sky-400" />
        <div className="absolute bottom-[5.5rem] left-8 h-0 w-0 border-b-[18px] border-l-[32px] border-r-[32px] border-b-rose-400 border-l-transparent border-r-transparent" />
        <div className="absolute bottom-6 right-10 h-16 w-14 rounded-t-lg bg-emerald-400" />
        <div className="absolute bottom-[4.5rem] right-10 h-0 w-0 border-b-[16px] border-l-[28px] border-r-[28px] border-b-amber-400 border-l-transparent border-r-transparent" />
        <div className="absolute bottom-3 left-1/2 h-3 w-40 -translate-x-1/2 rounded-full bg-lime-300/70" />
      </>
    ),
  },
  phonics: {
    gradient: "from-yellow-50 via-lime-50 to-cyan-50",
    label: "Phonics illustration",
    shapes: (
      <>
        <div className="absolute left-6 top-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400 font-display text-2xl font-bold text-white shadow-sm">
          A
        </div>
        <div className="absolute right-8 top-16 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400 font-display text-xl font-bold text-white shadow-sm">
          B
        </div>
        <div className="absolute bottom-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl bg-amber-400 font-display text-2xl font-bold text-white shadow-sm">
          C
        </div>
      </>
    ),
  },
  water: {
    gradient: "from-cyan-100 via-sky-50 to-blue-100",
    label: "Water cycle illustration",
    shapes: (
      <>
        <div className="absolute left-8 top-8 h-10 w-20 rounded-full bg-white/90 shadow-sm" />
        <div className="absolute left-14 top-12 h-10 w-16 rounded-full bg-white/80" />
        <div className="absolute right-10 top-10 h-3 w-3 rounded-full bg-sky-400" />
        <div className="absolute right-16 top-16 h-3 w-3 rounded-full bg-sky-400" />
        <div className="absolute right-12 top-[5.5rem] h-3 w-3 rounded-full bg-sky-400" />
        <div className="absolute bottom-6 left-1/2 h-12 w-36 -translate-x-1/2 rounded-[2rem] bg-sky-400/80" />
      </>
    ),
  },
  operations: {
    gradient: "from-violet-50 via-fuchsia-50 to-pink-50",
    label: "Math operations illustration",
    shapes: (
      <>
        <div className="absolute left-8 top-10 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400 font-display text-2xl font-bold text-white">
          +
        </div>
        <div className="absolute right-10 top-14 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-400 font-display text-2xl font-bold text-white">
          −
        </div>
        <div className="absolute bottom-10 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-xl bg-fuchsia-400 font-display text-2xl font-bold text-white">
          ×
        </div>
      </>
    ),
  },
  heroes: {
    gradient: "from-red-50 via-amber-50 to-yellow-50",
    label: "Filipino heroes illustration",
    shapes: (
      <>
        <div className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rounded-full bg-amber-300" />
        <div className="absolute left-1/2 top-[4.5rem] h-0 w-0 -translate-x-1/2 border-l-[28px] border-r-[28px] border-t-[36px] border-l-transparent border-r-transparent border-t-amber-400" />
        <div className="absolute bottom-8 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-red-400" />
        <div className="absolute right-8 top-8 h-8 w-8 rounded-full bg-yellow-300" />
      </>
    ),
  },
};

interface MaterialThumbnailProps {
  theme: ThumbnailTheme;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  imageUrl?: string;
  mediaType?: PageMediaType;
  alt?: string;
}

export default function MaterialThumbnail({
  theme,
  className = "",
  imageUrl,
  mediaType,
  alt,
}: MaterialThumbnailProps) {
  if (imageUrl) {
    const kind = detectMediaType(imageUrl, mediaType);
    if (kind === "pdf") {
      return (
        <PdfCoverThumbnail url={imageUrl} alt={alt} className={className} />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={alt ?? "Reading material cover"}
        className={`object-cover object-top ${className}`}
      />
    );
  }

  const config = themes[theme];

  return (
    <div
      role="img"
      aria-label={config.label}
      className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} ${className}`}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/35" />
      <div className="absolute -bottom-6 -left-3 h-24 w-24 rounded-full bg-white/25" />
      {config.shapes}
    </div>
  );
}

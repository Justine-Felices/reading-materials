import type { Metadata } from "next";
import { BookOpen, Sparkles } from "lucide-react";
import ReadingMaterialsHeroArt from "@/components/reading-materials/ReadingMaterialsHeroArt";
import ReadingMaterialsCatalog from "@/components/reading-materials/ReadingMaterialsCatalog";

export const metadata: Metadata = {
  title: "Reading Materials",
  description:
    "Browse educational reading materials by grade, week, and level for elementary students.",
};

export default function ReadingMaterialsPage() {
  return (
    <div className="bg-white">
      {/* Compact hero — matches mock proportions (not tall) */}
      <section className="relative overflow-hidden bg-[#e4f1f2]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 10% 20%, #ffffff 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 30%, #c5e0e3 0%, transparent 50%)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-8 lg:py-10">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#d0e6e8] px-3.5 py-1.5 text-sm font-bold text-[#22646c]">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Digital Reading Program
            </p>

            <h1 className="font-display text-[2.35rem] font-bold leading-[1.15] tracking-tight sm:text-5xl">
              <span className="text-[#163a40]">Reading </span>
              <span className="relative inline-block text-[#22646c]">
                Materials
                <span
                  className="absolute -right-6 -top-2 text-amber-400"
                  aria-hidden="true"
                >
                  <Sparkles className="h-4 w-4" />
                </span>
                <span
                  className="absolute -left-5 top-0 text-amber-300"
                  aria-hidden="true"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              </span>
            </h1>

            <p className="max-w-md text-[15px] leading-relaxed text-slate-500 sm:text-base">
              Choose your grade and subject, then pick a week and level to start
              reading.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ReadingMaterialsHeroArt />
          </div>
        </div>

        <svg
          className="relative -mb-px block w-full text-white"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,24 C240,48 480,0 720,20 C960,40 1200,48 1440,16 L1440,48 L0,48 Z"
          />
        </svg>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <ReadingMaterialsCatalog />
      </div>
    </div>
  );
}

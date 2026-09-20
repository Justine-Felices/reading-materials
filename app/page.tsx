"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMaterials } from "@/components/materials/MaterialsProvider";
import ReadingMaterialCard from "@/components/reading-materials/ReadingMaterialCard";

export default function HomePage() {
  const { getFeatured } = useMaterials();
  const featured = getFeatured(4);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#e4f1f2]">
        <Image
          src="/school-gate.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.42]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[#e4f1f2]/40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 10% 20%, #ffffff 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 30%, #c5e0e3 0%, transparent 50%)",
          }}
        />

        <div className="relative mx-auto grid min-h-[28rem] max-w-7xl items-center gap-12 px-4 pb-10 pt-16 sm:min-h-[32rem] sm:px-6 lg:min-h-[36rem] lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-8 lg:pb-12 lg:pt-20">
          <div className="animate-fade-up space-y-6 lg:pr-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#d0e6e8]/90 px-3 py-1.5 text-sm font-bold text-[#22646c] shadow-sm backdrop-blur-sm">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Digital Reading Program
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-[#163a40] sm:text-5xl lg:text-6xl">
              Project E-READ
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Building better readers, brighter futures. Access a wide range of
              digital reading materials for all grade levels.
            </p>
            <Link
              href="/reading-materials"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Explore Reading Materials
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="animate-float relative w-full max-w-xl overflow-hidden rounded-[1.75rem] shadow-[0_16px_40px_rgba(34,100,108,0.2)] ring-4 ring-white lg:max-w-2xl">
              <Image
                src="/hero-students.jpg"
                alt="Maugat East Elementary School students and teachers with reading books"
                width={1200}
                height={920}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <svg
          className="relative -mb-px -mt-6 block w-full text-white sm:-mt-8"
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

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-foreground">
              Featured Reading Materials
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              A quick start across different grades, weeks, and levels.
            </p>
          </div>
          <Link
            href="/reading-materials"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-primary-dark"
          >
            View all materials
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((material) => (
            <ReadingMaterialCard
              key={material.id}
              material={material}
              showGrade
            />
          ))}
        </div>
      </section>
    </div>
  );
}

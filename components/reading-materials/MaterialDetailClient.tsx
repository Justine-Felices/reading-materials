"use client";

import Link from "next/link";
import {
  GradeBadge,
  LevelBadge,
  SubjectBadge,
  WeekBadge,
} from "@/components/Badges";
import MaterialThumbnail from "@/components/MaterialThumbnail";
import { useMaterials } from "@/components/materials/MaterialsProvider";
import ReadingMaterialViewer from "@/components/reading-materials/ReadingMaterialViewer";
import ReadingNavigation from "@/components/reading-materials/ReadingNavigation";

export default function MaterialDetailClient({ id }: { id: string }) {
  const { getById } = useMaterials();
  const material = getById(id);

  if (!material) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-foreground">
          Material not found
        </h1>
        <p className="mt-2 text-muted">
          We could not find that reading material.
        </p>
        <Link
          href="/reading-materials"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          Back to Reading Materials
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-5">
        <ReadingNavigation />
      </div>

      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start">
        <MaterialThumbnail
          theme={material.thumbnail}
          imageUrl={material.coverImageUrl}
          mediaType={material.pages[0]?.mediaType}
          alt={material.title}
          size="xl"
          className="h-40 w-full shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36"
        />
        <div className="space-y-3 pt-1">
          <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            {material.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <GradeBadge grade={material.grade} />
            <WeekBadge week={material.week} />
            <LevelBadge level={material.level} />
            <SubjectBadge subject={material.subject} />
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            {material.description}
          </p>
        </div>
      </section>

      <ReadingMaterialViewer material={material} />
    </div>
  );
}

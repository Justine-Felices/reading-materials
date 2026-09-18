import type { Metadata } from "next";
import MaterialDetailClient from "@/components/reading-materials/MaterialDetailClient";
import {
  getReadingMaterialById,
  readingMaterials,
} from "@/data/reading-materials";

interface MaterialPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return readingMaterials.map((material) => ({ id: material.id }));
}

export async function generateMetadata({
  params,
}: MaterialPageProps): Promise<Metadata> {
  const { id } = await params;
  const material = getReadingMaterialById(id);

  if (!material) {
    return { title: "Material Not Found" };
  }

  return {
    title: material.title,
    description: material.description,
  };
}

export default async function MaterialReadingPage({
  params,
}: MaterialPageProps) {
  const { id } = await params;
  return <MaterialDetailClient id={id} />;
}

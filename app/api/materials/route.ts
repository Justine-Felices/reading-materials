import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { readingMaterials as seedMaterials } from "@/data/reading-materials";
import { isPrismaConfigured, prisma } from "@/lib/prisma";
import {
  materialToPrismaCreate,
  prismaRowToMaterial,
} from "@/lib/prisma-materials";
import {
  getTeacherSession,
  unauthorizedTeacherResponse,
} from "@/lib/teacher-session";
import type { ReadingMaterial } from "@/types/reading-material";

export const runtime = "nodejs";

async function listMaterials(): Promise<ReadingMaterial[]> {
  const rows = await prisma.readingMaterial.findMany({
    orderBy: [
      { grade: "asc" },
      { week: "asc" },
      { level: "asc" },
      { title: "asc" },
    ],
  });
  return rows.map(prismaRowToMaterial);
}

async function seedIfEmpty(): Promise<ReadingMaterial[]> {
  const count = await prisma.readingMaterial.count();
  if (count > 0) return listMaterials();

  await prisma.readingMaterial.createMany({
    data: seedMaterials.map((material) => ({
      id: material.id,
      title: material.title,
      description: material.description,
      subject: material.subject,
      grade: material.grade,
      week: material.week,
      level: material.level,
      thumbnail: material.thumbnail,
      coverImageUrl: material.coverImageUrl ?? null,
      downloadUrl: material.downloadUrl ?? null,
      featured: Boolean(material.featured),
      pages: material.pages as unknown as Prisma.InputJsonValue,
    })),
    skipDuplicates: true,
  });

  return listMaterials();
}

export async function GET() {
  if (!isPrismaConfigured()) {
    return NextResponse.json({
      source: "seed",
      materials: seedMaterials,
      configured: false,
    });
  }

  try {
    const materials = await seedIfEmpty();
    return NextResponse.json({
      source: "prisma",
      materials,
      configured: true,
    });
  } catch (error) {
    console.error("[GET /api/materials]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load materials",
        configured: true,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await getTeacherSession())) {
    return unauthorizedTeacherResponse();
  }

  if (!isPrismaConfigured()) {
    return NextResponse.json(
      {
        error:
          "Database is not configured. Set DATABASE_URL / DIRECT_URL in .env and .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as ReadingMaterial;
    if (!body?.id || !body?.title) {
      return NextResponse.json(
        { error: "Material id and title are required." },
        { status: 400 },
      );
    }

    const row = await prisma.readingMaterial.upsert({
      where: { id: body.id },
      create: materialToPrismaCreate(body),
      update: {
        title: body.title,
        description: body.description,
        subject: body.subject,
        grade: body.grade,
        week: body.week,
        level: body.level,
        thumbnail: body.thumbnail,
        coverImageUrl: body.coverImageUrl ?? null,
        downloadUrl: body.downloadUrl ?? null,
        featured: Boolean(body.featured),
        pages: body.pages as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ material: prismaRowToMaterial(row) });
  } catch (error) {
    console.error("[POST /api/materials]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save material",
      },
      { status: 500 },
    );
  }
}

import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id } = await context.params;

  try {
    const patch = (await request.json()) as Partial<ReadingMaterial>;
    const existing = await prisma.readingMaterial.findUnique({ where: { id } });

    if (!existing && (!patch.title || !patch.description)) {
      return NextResponse.json(
        { error: "Material not found in database." },
        { status: 404 },
      );
    }

    const current = existing ? prismaRowToMaterial(existing) : null;
    const next: ReadingMaterial = {
      ...(current ?? (patch as ReadingMaterial)),
      ...patch,
      id,
      pages: patch.pages ?? current?.pages ?? [],
    };

    const row = await prisma.readingMaterial.upsert({
      where: { id },
      create: materialToPrismaCreate(next),
      update: {
        title: next.title,
        description: next.description,
        subject: next.subject,
        grade: next.grade,
        week: next.week,
        level: next.level,
        thumbnail: next.thumbnail,
        coverImageUrl: next.coverImageUrl ?? null,
        downloadUrl: next.downloadUrl ?? null,
        featured: Boolean(next.featured),
        pages: next.pages as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ material: prismaRowToMaterial(row) });
  } catch (error) {
    console.error("[PATCH /api/materials/:id]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update material",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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

  const { id } = await context.params;

  try {
    await prisma.readingMaterial.deleteMany({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/materials/:id]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete material",
      },
      { status: 500 },
    );
  }
}

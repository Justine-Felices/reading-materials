import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  getTeacherSession,
  unauthorizedTeacherResponse,
} from "@/lib/teacher-session";

export const runtime = "nodejs";

const MAX_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  if (!(await getTeacherSession())) {
    return unauthorizedTeacherResponse();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add keys to .env.local." },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }

    if (!ALLOWED.has(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only images and PDF files are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is too large (max 20MB)." },
        { status: 400 },
      );
    }

    const ext = extensionFor(file);
    const safeBase =
      file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "material";
    const path = `uploads/${Date.now()}-${safeBase}.${ext}`;

    const supabase = getSupabaseAdmin();
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from("reading-files")
      .upload(path, buffer, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("reading-files").getPublicUrl(path);

    return NextResponse.json({
      url: data.publicUrl,
      path,
      mediaType: file.type === "application/pdf" || ext === "pdf" ? "pdf" : "image",
      fileName: file.name,
    });
  } catch (error) {
    console.error("[POST /api/materials/upload]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 },
    );
  }
}

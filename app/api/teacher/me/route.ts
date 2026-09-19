import { NextResponse } from "next/server";
import {
  getTeacherSession,
  isTeacherAuthConfigured,
} from "@/lib/teacher-session";

export const runtime = "nodejs";

export async function GET() {
  if (!isTeacherAuthConfigured()) {
    return NextResponse.json({
      authenticated: false,
      configured: false,
    });
  }

  const session = await getTeacherSession();
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      configured: true,
    });
  }

  return NextResponse.json({
    authenticated: true,
    configured: true,
    email: session.email,
  });
}

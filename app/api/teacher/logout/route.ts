import { NextResponse } from "next/server";
import {
  TEACHER_COOKIE,
  teacherSessionCookieOptions,
} from "@/lib/teacher-session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TEACHER_COOKIE, "", {
    ...teacherSessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

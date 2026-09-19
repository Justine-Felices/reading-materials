import { NextResponse } from "next/server";
import {
  createTeacherSessionToken,
  isTeacherAuthConfigured,
  TEACHER_COOKIE,
  teacherSessionCookieOptions,
  verifyTeacherCredentials,
} from "@/lib/teacher-session";

export const runtime = "nodejs";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  if (!isTeacherAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Teacher login is not configured. Set TEACHER_EMAIL and TEACHER_PASSWORD in .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    if (!verifyTeacherCredentials(email, password)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = createTeacherSessionToken(email);
    const response = NextResponse.json({
      ok: true,
      email: email.trim().toLowerCase(),
    });
    response.cookies.set(
      TEACHER_COOKIE,
      token,
      teacherSessionCookieOptions(SESSION_MAX_AGE),
    );
    return response;
  } catch (error) {
    console.error("[POST /api/teacher/login]", error);
    return NextResponse.json(
      { error: "Failed to sign in." },
      { status: 500 },
    );
  }
}

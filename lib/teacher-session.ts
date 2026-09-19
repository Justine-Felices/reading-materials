import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const TEACHER_COOKIE = "eread-teacher-session";

const SESSION_DAYS = 7;

function sessionSecret(): string {
  const explicit = process.env.TEACHER_SESSION_SECRET?.trim();
  if (explicit) return explicit;

  const password = process.env.TEACHER_PASSWORD?.trim();
  if (password) return `eread:${password}`;

  return "";
}

export function isTeacherAuthConfigured(): boolean {
  return Boolean(
    process.env.TEACHER_EMAIL?.trim() &&
      process.env.TEACHER_PASSWORD?.trim() &&
      sessionSecret(),
  );
}

export function verifyTeacherCredentials(
  email: string,
  password: string,
): boolean {
  const expectedEmail = process.env.TEACHER_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.TEACHER_PASSWORD?.trim();

  if (!expectedEmail || !expectedPassword) return false;

  return (
    timingSafeStringEqual(email.trim().toLowerCase(), expectedEmail) &&
    timingSafeStringEqual(password, expectedPassword)
  );
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

function sign(payload: string): string {
  const secret = sessionSecret();
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createTeacherSessionToken(email: string): string {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${email.trim().toLowerCase()}:${expiresAt}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function parseTeacherSessionToken(
  token: string | undefined,
): { email: string } | null {
  if (!token || !sessionSecret()) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  const [email, expiresRaw] = payload.split(":");
  const expiresAt = Number(expiresRaw);
  if (!email || !Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return null;
  }

  const allowed = process.env.TEACHER_EMAIL?.trim().toLowerCase();
  if (!allowed || email !== allowed) return null;

  return { email };
}

export async function getTeacherSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  return parseTeacherSessionToken(jar.get(TEACHER_COOKIE)?.value);
}

export function teacherSessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function unauthorizedTeacherResponse() {
  return NextResponse.json(
    { error: "Teacher login required." },
    { status: 401 },
  );
}

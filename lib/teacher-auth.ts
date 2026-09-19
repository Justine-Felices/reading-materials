const TEACHER_EMAIL_KEY = "eread-teacher-email";

export function isTeacherLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.sessionStorage.getItem(TEACHER_EMAIL_KEY));
}

export function loginTeacher(email: string): void {
  window.sessionStorage.setItem(TEACHER_EMAIL_KEY, email);
}

export function logoutTeacher(): void {
  window.sessionStorage.removeItem(TEACHER_EMAIL_KEY);
  // Legacy demo flag
  window.sessionStorage.removeItem("eread-teacher-auth");
}

export function getTeacherEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TEACHER_EMAIL_KEY);
}

/** Confirm httpOnly cookie session with the server; syncs local UI state. */
export async function refreshTeacherSession(): Promise<{
  authenticated: boolean;
  configured: boolean;
  email?: string;
}> {
  const response = await fetch("/api/teacher/me", {
    cache: "no-store",
    credentials: "same-origin",
  });
  const data = (await response.json()) as {
    authenticated?: boolean;
    configured?: boolean;
    email?: string;
  };

  if (data.authenticated && data.email) {
    loginTeacher(data.email);
  } else {
    logoutTeacher();
  }

  return {
    authenticated: Boolean(data.authenticated),
    configured: Boolean(data.configured),
    email: data.email,
  };
}

export async function loginTeacherWithPassword(
  email: string,
  password: string,
): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const response = await fetch("/api/teacher/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as { email?: string; error?: string };

  if (!response.ok) {
    return {
      ok: false,
      error: data.error || "Invalid email or password.",
    };
  }

  const signedInEmail = data.email || email.trim().toLowerCase();
  loginTeacher(signedInEmail);
  return { ok: true, email: signedInEmail };
}

export async function logoutTeacherSession(): Promise<void> {
  try {
    await fetch("/api/teacher/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } finally {
    logoutTeacher();
  }
}

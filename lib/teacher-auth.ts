const TEACHER_AUTH_KEY = "eread-teacher-auth";

export function isTeacherLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(TEACHER_AUTH_KEY) === "1";
}

export function loginTeacher(email: string): void {
  window.sessionStorage.setItem(TEACHER_AUTH_KEY, "1");
  window.sessionStorage.setItem("eread-teacher-email", email);
}

export function logoutTeacher(): void {
  window.sessionStorage.removeItem(TEACHER_AUTH_KEY);
  window.sessionStorage.removeItem("eread-teacher-email");
}

export function getTeacherEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("eread-teacher-email");
}

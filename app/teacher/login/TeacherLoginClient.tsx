"use client";

import { BookOpen, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { isTeacherLoggedIn, loginTeacher } from "@/lib/teacher-auth";

export default function TeacherLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isTeacherLoggedIn()) {
      router.replace("/teacher/upload");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    // Demo only — any credentials are accepted (no backend yet)
    loginTeacher(email.trim());
    router.push("/teacher/upload");
  };

  return (
    <div className="bg-[#e4f1f2]">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <Image
            src="/school-logo.jpg"
            alt="Maugat East Elementary School logo"
            width={72}
            height={72}
            className="mx-auto mb-4 h-16 w-16 rounded-full object-cover shadow-md"
          />
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Teachers only
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
            Teacher Login
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to upload reading materials for Project E-READ.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(34,100,108,0.08)] sm:p-8"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              placeholder="teacher@school.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-bold text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              placeholder="Enter password"
              required
            />
          </div>

          {error ? (
            <p className="text-sm font-semibold text-rose-600" role="alert">
              {error}
            </p>
          ) : (
            <p className="text-xs text-muted">
              Demo mode: any email and password will work.
            </p>
          )}

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign in
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Back to student site
        </Link>
      </div>
    </div>
  );
}

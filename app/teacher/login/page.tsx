import type { Metadata } from "next";
import TeacherLoginClient from "./TeacherLoginClient";

export const metadata: Metadata = {
  title: "Teacher Login",
  description: "Sign in to upload reading materials for Project E-READ.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeacherLoginPage() {
  return <TeacherLoginClient />;
}

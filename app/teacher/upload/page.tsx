import type { Metadata } from "next";
import TeacherUploadClient from "./TeacherUploadClient";

export const metadata: Metadata = {
  title: "Manage Materials",
  description:
    "Teachers can create, edit, and delete reading materials for Grades 1–6.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeacherUploadPage() {
  return <TeacherUploadClient />;
}

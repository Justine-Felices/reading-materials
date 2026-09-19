import { redirect } from "next/navigation";

export default function MistakenTeacherPath() {
  redirect("/teacher/login");
}

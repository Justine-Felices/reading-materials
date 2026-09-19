import { redirect } from "next/navigation";

/** Common mistaken path — teacher tools live at /teacher/upload */
export default function MistakenTeacherUploadPath() {
  redirect("/teacher/upload");
}

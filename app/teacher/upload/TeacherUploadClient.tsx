"use client";

import {
  FileText,
  LogOut,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useMaterials } from "@/components/materials/MaterialsProvider";
import Toast from "@/components/Toast";
import {
  getTeacherEmail,
  logoutTeacherSession,
  refreshTeacherSession,
} from "@/lib/teacher-auth";
import {
  detectMediaType,
  validateMediaUrls,
} from "@/lib/validate-image-url";
import {
  GRADES,
  LEVELS,
  SUBJECTS,
  formatGradeLabel,
  type Grade,
  type Level,
  type PageMediaType,
  type ReadingMaterial,
  type Subject,
} from "@/types/reading-material";

const DEFAULT_THUMBNAIL = "phonics" as const;
const ACCEPTED_FILES = "image/*,application/pdf";

type PageMedia = {
  url: string;
  mediaType: PageMediaType;
  fileName?: string;
  /** Local file waiting to upload to Supabase Storage */
  file?: File;
};

type FormState = {
  title: string;
  description: string;
  grade: Grade;
  week: number;
  level: Level;
  subject: Subject;
  pages: PageMedia[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function emptyForm(): FormState {
  return {
    title: "",
    description: "",
    grade: 1,
    week: 1,
    level: 1,
    subject: "English",
    pages: [{ url: "", mediaType: "image" }],
  };
}

function formFromMaterial(material: ReadingMaterial): FormState {
  const pagesFromMaterial = material.pages
    .filter((page) => page.imageUrl?.trim())
    .map((page) => ({
      url: page.imageUrl!.trim(),
      mediaType: detectMediaType(page.imageUrl!, page.mediaType),
      fileName: undefined as string | undefined,
    }));

  const fallback =
    material.coverImageUrl?.trim() || material.downloadUrl?.trim() || "";

  return {
    title: material.title,
    description: material.description,
    grade: material.grade,
    week: material.week,
    level: material.level,
    subject: material.subject,
    pages:
      pagesFromMaterial.length > 0
        ? pagesFromMaterial
        : fallback
          ? [{ url: fallback, mediaType: detectMediaType(fallback) }]
          : [{ url: "", mediaType: "image" }],
  };
}

function serializeForm(form: FormState) {
  return JSON.stringify({
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    pages: form.pages.map((page) => ({
      url: page.url.trim(),
      mediaType: page.mediaType,
      fileName: page.fileName ?? "",
    })),
  });
}

function buildMediaPages(pages: PageMedia[]): ReadingMaterial["pages"] {
  return pages.map((page, index) => ({
    pageNumber: index + 1,
    content: [],
    imageUrl: page.url.trim(),
    mediaType: page.mediaType,
  }));
}

function MediaPreview({ page }: { page: PageMedia }) {
  const [broken, setBroken] = useState(false);
  const trimmed = page.url.trim();

  useEffect(() => {
    setBroken(false);
  }, [trimmed]);

  if (!trimmed) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        Empty
      </div>
    );
  }

  if (page.mediaType === "pdf") {
    return (
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-white text-primary">
        <FileText className="h-6 w-6" aria-hidden="true" />
        <span className="text-[10px] font-bold uppercase tracking-wide">
          PDF
        </span>
      </div>
    );
  }

  if (broken) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-[10px] font-bold uppercase tracking-wide text-rose-500">
        Broken
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={trimmed}
      alt=""
      onError={() => setBroken(true)}
      className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
    />
  );
}

export default function TeacherUploadClient() {
  const router = useRouter();
  const {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    persistenceEnabled,
  } = useMaterials();

  const formRef = useRef<HTMLFormElement>(null);
  const baselineRef = useRef(serializeForm(emptyForm()));
  const [panelHeight, setPanelHeight] = useState<number | null>(null);

  const [ready, setReady] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingReplace, setPendingReplace] = useState<ReadingMaterial | null>(
    null,
  );
  const [pendingDiscard, setPendingDiscard] = useState<
    null | "cancel" | { type: "edit"; material: ReadingMaterial }
  >(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState<"all" | Grade>("all");
  const [filterWeek, setFilterWeek] = useState("");
  const [filterSubject, setFilterSubject] = useState<"all" | Subject>("all");

  const isDirty = serializeForm(form) !== baselineRef.current;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const session = await refreshTeacherSession();
      if (cancelled) return;
      if (!session.authenticated) {
        router.replace("/teacher/login");
        return;
      }
      setTeacherEmail(session.email ?? getTeacherEmail());
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const form = formRef.current;
    if (!form || typeof ResizeObserver === "undefined") return;

    const syncHeight = () => {
      // Only match heights on desktop side-by-side layout.
      if (window.matchMedia("(min-width: 768px)").matches) {
        setPanelHeight(Math.ceil(form.getBoundingClientRect().height));
      } else {
        setPanelHeight(null);
      }
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(form);
    window.addEventListener("resize", syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [ready, editingId, form.pages.length, error, pendingDiscard]);

  useEffect(() => {
    if (!pendingReplace) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        setPendingReplace(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pendingReplace, saving]);

  const sortedMaterials = useMemo(
    () =>
      [...materials].sort(
        (a, b) =>
          a.grade - b.grade ||
          a.week - b.week ||
          a.level - b.level ||
          a.title.localeCompare(b.title),
      ),
    [materials],
  );

  const filteredMaterials = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const weekNumber = filterWeek ? Number(filterWeek) : null;

    return sortedMaterials.filter((material) => {
      if (filterGrade !== "all" && material.grade !== filterGrade) return false;
      if (
        weekNumber !== null &&
        !Number.isNaN(weekNumber) &&
        material.week !== weekNumber
      ) {
        return false;
      }
      if (filterSubject !== "all" && material.subject !== filterSubject) {
        return false;
      }
      if (query && !material.title.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [sortedMaterials, searchQuery, filterGrade, filterWeek, filterSubject]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filterGrade !== "all" ||
    filterWeek !== "" ||
    filterSubject !== "all";

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  const applyFormState = (next: FormState, nextEditingId: string | null) => {
    baselineRef.current = serializeForm(next);
    setForm(next);
    setEditingId(nextEditingId);
    setError("");
    setPendingDiscard(null);
    setPendingReplace(null);
  };

  const resetForm = () => {
    applyFormState(emptyForm(), null);
  };

  const handleLogout = () => {
    void logoutTeacherSession().then(() => {
      router.replace("/teacher/login");
    });
  };

  const requestEdit = (material: ReadingMaterial) => {
    if (isDirty) {
      setPendingDiscard({ type: "edit", material });
      return;
    }
    loadEdit(material);
  };

  const loadEdit = (material: ReadingMaterial) => {
    applyFormState(formFromMaterial(material), material.id);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const requestCancelEdit = () => {
    if (isDirty) {
      setPendingDiscard("cancel");
      return;
    }
    resetForm();
  };

  const confirmDiscard = () => {
    if (pendingDiscard === "cancel") {
      resetForm();
      return;
    }
    if (pendingDiscard && typeof pendingDiscard === "object") {
      loadEdit(pendingDiscard.material);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      if (editingId === id) {
        resetForm();
      }
      setPendingDeleteId(null);
      showToast("Material deleted.");
    } catch (err) {
      setPendingDeleteId(null);
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const updatePageUrl = (index: number, value: string) => {
    setForm((prev) => {
      const pages = [...prev.pages];
      const current = pages[index];
      // Revoke previous blob if replacing typed URL over an attachment
      if (current.url.startsWith("blob:") && value.trim() !== current.url) {
        URL.revokeObjectURL(current.url);
      }
      pages[index] = {
        url: value,
        mediaType: detectMediaType(value),
        fileName: undefined,
      };
      return { ...prev, pages };
    });
  };

  const attachPageFile = (index: number, file: File | undefined) => {
    if (!file) return;
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) {
      setError("Page files must be an image or PDF.");
      return;
    }

    setForm((prev) => {
      const pages = [...prev.pages];
      const current = pages[index];
      if (current.url.startsWith("blob:")) {
        URL.revokeObjectURL(current.url);
      }
      pages[index] = {
        url: URL.createObjectURL(file),
        mediaType: isPdf ? "pdf" : "image",
        fileName: file.name,
        file,
      };
      return { ...prev, pages };
    });
    setError("");
  };

  const addPageUrl = () => {
    setForm((prev) => ({
      ...prev,
      pages: [...prev.pages, { url: "", mediaType: "image" }],
    }));
  };

  const removePageUrl = (index: number) => {
    setForm((prev) => {
      if (prev.pages.length <= 1) return prev;
      const removing = prev.pages[index];
      if (removing.url.startsWith("blob:")) {
        URL.revokeObjectURL(removing.url);
      }
      return {
        ...prev,
        pages: prev.pages.filter((_, i) => i !== index),
      };
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterGrade("all");
    setFilterWeek("");
    setFilterSubject("all");
  };

  const findSlotConflict = () =>
    materials.find(
      (material) =>
        material.id !== editingId &&
        material.grade === form.grade &&
        material.week === form.week &&
        material.level === form.level &&
        material.subject === form.subject,
    );

  const saveMaterial = async (options?: {
    replaceConflict?: ReadingMaterial | null;
  }) => {
    setError("");
    setPendingReplace(null);

    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError("Please enter a title and description.");
      return;
    }

    if (form.week < 1 || form.week > 52) {
      setError("Week must be between 1 and 52.");
      return;
    }

    const hasPage = form.pages.some((page) => page.url.trim() || page.file);
    if (!hasPage) {
      setError("Add at least one image or PDF (URL or attachment).");
      return;
    }

    const conflict = options?.replaceConflict ?? findSlotConflict();
    if (conflict && options?.replaceConflict === undefined) {
      setPendingReplace(conflict);
      return;
    }

    setSaving(true);
    try {
      const uploadedPages: PageMedia[] = [];
      for (const page of form.pages) {
        const url = page.url.trim();
        if (!url && !page.file) continue;

        if (page.file) {
          const body = new FormData();
          body.append("file", page.file);
          const uploadResponse = await fetch("/api/materials/upload", {
            method: "POST",
            body,
          });
          if (!uploadResponse.ok) {
            const uploadBody = (await uploadResponse.json().catch(() => ({}))) as {
              error?: string;
            };
            throw new Error(
              uploadBody.error ||
                "File upload failed. Check Supabase storage setup.",
            );
          }
          const uploaded = (await uploadResponse.json()) as {
            url: string;
            mediaType: PageMediaType;
            fileName?: string;
          };
          uploadedPages.push({
            url: uploaded.url,
            mediaType: uploaded.mediaType,
            fileName: uploaded.fileName ?? page.fileName,
          });
        } else {
          uploadedPages.push({
            url,
            mediaType: page.mediaType,
            fileName: page.fileName,
          });
        }
      }

      const mediaError = await validateMediaUrls(uploadedPages);
      if (mediaError) {
        setError(mediaError);
        return;
      }

      const pages = buildMediaPages(uploadedPages);
      const coverImageUrl = uploadedPages[0].url;
      const payload = {
        title: trimmedTitle,
        description: trimmedDescription,
        grade: form.grade,
        week: form.week,
        level: form.level,
        subject: form.subject,
        thumbnail: DEFAULT_THUMBNAIL,
        coverImageUrl,
        downloadUrl: coverImageUrl,
        pages,
      };

      if (conflict) {
        // Overwrite the material already in this grade/week/level/subject slot.
        const persisted = await updateMaterial(conflict.id, payload);
        if (editingId && editingId !== conflict.id) {
          await deleteMaterial(editingId);
        }
        showToast(
          persisted
            ? `Replaced “${conflict.title}” for all students.`
            : `Replaced “${conflict.title}” (session only).`,
        );
      } else if (editingId) {
        const persisted = await updateMaterial(editingId, payload);
        showToast(
          persisted
            ? "Material updated for all students."
            : "Material updated (session only — configure Supabase).",
        );
      } else {
        const persisted = await addMaterial({
          id: `upload-${slugify(trimmedTitle) || "material"}-${Date.now()}`,
          ...payload,
        });
        showToast(
          persisted
            ? "Material added for all students."
            : "Material added (session only — configure Supabase).",
        );
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveMaterial();
  };

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-5xl items-center justify-center px-4 py-16 text-muted">
        Checking teacher access…
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Teacher tools
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Manage Reading Materials
          </h1>
          <p className="max-w-2xl text-muted">
            Create, edit, or delete materials on this page.
            {persistenceEnabled
              ? " Changes are saved to Supabase and visible to all students."
              : " Supabase is not configured yet — changes stay in this browser until you add keys to .env.local."}
          </p>
          {teacherEmail ? (
            <p className="text-sm text-slate-500">Signed in as {teacherEmail}</p>
          ) : null}
          <p
            className={`text-xs font-bold uppercase tracking-wide ${
              persistenceEnabled ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {persistenceEnabled ? "Cloud sync on" : "Cloud sync off"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-primary hover:text-primary"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>

      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full min-w-0 flex-1 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(34,100,108,0.06)] sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {editingId ? "Edit material" : "Add material"}
            </h2>
            {editingId ? (
              <button
                type="button"
                onClick={requestCancelEdit}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Cancel edit
              </button>
            ) : null}
          </div>

          {pendingDiscard ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
              <p className="font-semibold text-amber-900">
                Discard unsaved changes?
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={confirmDiscard}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDiscard(null)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100"
                >
                  Keep editing
                </button>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-foreground">
              Title
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              placeholder="e.g. Facts About the Sun"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-bold text-foreground"
            >
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              placeholder="Short summary for students"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="grade"
                className="text-sm font-bold text-foreground"
              >
                Grade
              </label>
              <select
                id="grade"
                value={form.grade}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    grade: Number(e.target.value) as Grade,
                  }))
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {formatGradeLabel(g)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="week" className="text-sm font-bold text-foreground">
                Week
              </label>
              <input
                id="week"
                type="number"
                min={1}
                max={52}
                value={form.week}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, week: Number(e.target.value) }))
                }
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="level"
                className="text-sm font-bold text-foreground"
              >
                Level
              </label>
              <select
                id="level"
                value={form.level}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    level: Number(e.target.value) as Level,
                  }))
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="text-sm font-bold text-foreground"
            >
              Subject
            </label>
            <select
              id="subject"
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  subject: e.target.value as Subject,
                }))
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-foreground">
                  Page files{" "}
                  <span className="font-normal text-muted">(required)</span>
                </p>
                <p className="text-xs text-muted">
                  Paste an image/PDF URL or attach a file from your device.
                </p>
              </div>
              <button
                type="button"
                onClick={addPageUrl}
                className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add page
              </button>
            </div>

            <div className="space-y-3">
              {form.pages.map((page, index) => (
                <div
                  key={`page-media-${index}`}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                >
                  <MediaPreview page={page} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <label
                      htmlFor={`page-url-${index}`}
                      className="text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Page {index + 1}
                      {page.fileName ? ` · ${page.fileName}` : ""}
                    </label>
                    <input
                      id={`page-url-${index}`}
                      type="text"
                      value={page.fileName ? page.fileName : page.url}
                      onChange={(e) => {
                        if (page.fileName) return;
                        updatePageUrl(index, e.target.value);
                      }}
                      readOnly={Boolean(page.fileName)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 read-only:bg-slate-100 read-only:text-slate-600"
                      placeholder="/materials/worksheet.jpg or https://…"
                      required={index === 0 && !page.fileName && !page.url}
                    />
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-primary hover:text-primary">
                        <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                        Attach image or PDF
                        <input
                          type="file"
                          accept={ACCEPTED_FILES}
                          className="sr-only"
                          onChange={(e) => {
                            attachPageFile(index, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {page.fileName ? (
                        <button
                          type="button"
                          onClick={() => updatePageUrl(index, "")}
                          className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                        >
                          Clear file
                        </button>
                      ) : null}
                    </div>
                  </div>
                  {form.pages.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removePageUrl(index)}
                      className="mt-6 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove page ${index + 1}`}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {error ? (
            <p className="text-sm font-semibold text-rose-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editingId ? (
                <>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Checking images…" : "Update Material"}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Checking images…" : "Add Material"}
                </>
              )}
            </button>
            <Link
              href="/reading-materials"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary-soft px-6 text-sm font-bold text-primary-dark transition hover:bg-[#d0e6e8]"
            >
              Back to library
            </Link>
          </div>
        </form>

        <section
          className="flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(34,100,108,0.06)] sm:p-6"
          style={panelHeight ? { height: panelHeight } : undefined}
        >
          <div className="mb-4 shrink-0">
            <h2 className="font-display text-xl font-semibold text-foreground">
              All materials
            </h2>
            <p className="text-sm text-muted">
              Showing {filteredMaterials.length} of {sortedMaterials.length}
            </p>
          </div>

          <div className="mb-4 shrink-0 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <select
                value={filterGrade === "all" ? "all" : String(filterGrade)}
                onChange={(e) =>
                  setFilterGrade(
                    e.target.value === "all"
                      ? "all"
                      : (Number(e.target.value) as Grade),
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-2 text-sm outline-none focus:border-primary"
                aria-label="Filter by grade"
              >
                <option value="all">All grades</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {formatGradeLabel(g)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={52}
                value={filterWeek}
                onChange={(e) => setFilterWeek(e.target.value)}
                placeholder="All weeks"
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter by week"
              />
              <select
                value={filterSubject}
                onChange={(e) =>
                  setFilterSubject(
                    e.target.value === "all"
                      ? "all"
                      : (e.target.value as Subject),
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-2 text-sm outline-none focus:border-primary"
                aria-label="Filter by subject"
              >
                <option value="all">All subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-bold text-primary hover:text-primary-dark"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {sortedMaterials.length === 0 ? (
            <p className="flex h-full min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-muted">
              No materials yet. Add one using the form.
            </p>
          ) : filteredMaterials.length === 0 ? (
            <p className="flex h-full min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-muted">
              No materials match your filters.
            </p>
          ) : (
            <>
              <ul className="space-y-3 md:hidden">
                {filteredMaterials.map((material) => {
                  const deleting = pendingDeleteId === material.id;
                  return (
                    <li
                      key={material.id}
                      className={`rounded-xl border border-slate-100 px-3 py-3 ${
                        editingId === material.id ? "bg-primary-soft/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">
                            {material.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {material.grade === 0
                              ? "Kinder"
                              : `G${material.grade}`}{" "}
                            · W{material.week} · L{material.level} ·{" "}
                            {material.subject}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => requestEdit(material)}
                            className="rounded-lg px-2 py-1.5 text-xs font-bold text-primary hover:bg-primary-soft"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(material.id)}
                            className="rounded-lg px-2 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {deleting ? (
                        <div className="mt-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs">
                          <p className="font-semibold text-rose-800">
                            Delete &quot;{material.title}&quot;?
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => confirmDelete(material.id)}
                              className="rounded-md bg-rose-600 px-2.5 py-1 font-bold text-white hover:bg-rose-700"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(null)}
                              className="rounded-md px-2.5 py-1 font-bold text-rose-700 hover:bg-rose-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-2 py-3 font-bold">Title</th>
                      <th className="px-2 py-3 font-bold">Grade</th>
                      <th className="px-2 py-3 font-bold">Week</th>
                      <th className="px-2 py-3 font-bold">Level</th>
                      <th className="px-2 py-3 font-bold">Subject</th>
                      <th className="px-2 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((material) => {
                      const deleting = pendingDeleteId === material.id;
                      return (
                        <tr
                          key={material.id}
                          className={`border-b border-slate-100 ${
                            editingId === material.id
                              ? "bg-primary-soft/50"
                              : ""
                          }`}
                        >
                          <td className="px-2 py-3">
                            <span className="font-semibold text-foreground">
                              {material.title}
                            </span>
                            {deleting ? (
                              <div className="mt-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs">
                                <p className="font-semibold text-rose-800">
                                  Delete &quot;{material.title}&quot;?
                                </p>
                                <div className="mt-2 flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => confirmDelete(material.id)}
                                    className="rounded-md bg-rose-600 px-2.5 py-1 font-bold text-white hover:bg-rose-700"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPendingDeleteId(null)}
                                    className="rounded-md px-2.5 py-1 font-bold text-rose-700 hover:bg-rose-100"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </td>
                          <td className="px-2 py-3 text-slate-600">
                            {formatGradeLabel(material.grade)}
                          </td>
                          <td className="px-2 py-3 text-slate-600">
                            {material.week}
                          </td>
                          <td className="px-2 py-3 text-slate-600">
                            {material.level}
                          </td>
                          <td className="px-2 py-3 text-slate-600">
                            {material.subject}
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => requestEdit(material)}
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-bold text-primary transition hover:bg-primary-soft"
                              >
                                <Pencil
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteId(material.id)}
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-bold text-rose-600 transition hover:bg-rose-50"
                              >
                                <Trash2
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
          </div>
        </section>
      </div>

      {pendingReplace ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => {
            if (!saving) setPendingReplace(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="replace-material-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="replace-material-title"
              className="font-display text-xl font-semibold text-foreground"
            >
              Replace existing material?
            </h2>
            <p className="mt-2 text-sm text-muted">
              A material already exists for {formatGradeLabel(form.grade)}, Week{" "}
              {form.week}, Level {form.level}, {form.subject}.
            </p>
            <p className="mt-2 text-sm text-foreground">
              Replace &quot;{pendingReplace.title}&quot; with this one?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => setPendingReplace(null)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Keep existing
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  void saveMaterial({ replaceConflict: pendingReplace })
                }
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-60"
              >
                {saving ? "Replacing…" : "Replace it"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Toast
        message={toastMessage}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}

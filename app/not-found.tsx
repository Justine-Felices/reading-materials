import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-3xl" aria-hidden="true">
        📚
      </div>
      <h1 className="font-display text-3xl text-foreground">Material not found</h1>
      <p className="mt-2 text-muted">
        We could not find that reading material. Try browsing the library instead.
      </p>
      <Link
        href="/reading-materials"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-dark"
      >
        Back to Reading Materials
      </Link>
    </div>
  );
}

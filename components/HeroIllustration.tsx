/**
 * Friendly CSS illustration of a child reading — matches the reference hero art.
 */
export default function HeroIllustration({
  variant = "library",
}: {
  variant?: "home" | "library";
}) {
  const isLibrary = variant === "library";

  return (
    <div
      className="animate-float relative mx-auto aspect-[5/4] w-full max-w-md lg:max-w-lg"
      aria-hidden="true"
    >
      {/* soft ground */}
      <div className="absolute bottom-6 left-1/2 h-12 w-64 -translate-x-1/2 rounded-full bg-sky-200/50 blur-[1px]" />

      {/* stacked books (library style) */}
      {isLibrary ? (
        <>
          <div className="absolute bottom-14 left-1/2 h-10 w-52 -translate-x-1/2 rounded-md bg-sky-500 shadow-md" />
          <div className="absolute bottom-[5.75rem] left-1/2 h-10 w-48 -translate-x-1/2 rounded-md bg-amber-400 shadow-md" />
        </>
      ) : (
        <div className="absolute bottom-14 left-1/2 z-10 h-28 w-44 -translate-x-1/2">
          <div className="absolute inset-0 rotate-[-4deg] rounded-md bg-amber-100 shadow-md" />
          <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-amber-300/80" />
          <div className="absolute left-3 top-4 h-2 w-14 rounded bg-sky-300/70" />
          <div className="absolute left-3 top-8 h-2 w-10 rounded bg-sky-200/80" />
          <div className="absolute right-3 top-4 h-2 w-14 rounded bg-rose-300/70" />
          <div className="absolute right-3 top-8 h-2 w-10 rounded bg-rose-200/80" />
        </div>
      )}

      {/* child */}
      <div
        className={`absolute left-1/2 z-20 h-40 w-32 -translate-x-1/2 ${
          isLibrary ? "bottom-[7.5rem]" : "bottom-[5.5rem] h-36 w-28"
        }`}
      >
        <div
          className={`absolute bottom-0 left-1/2 h-28 w-28 -translate-x-1/2 rounded-t-[2rem] ${
            isLibrary ? "bg-sky-400" : "bg-rose-300"
          }`}
        />
        {/* open book in hands for library */}
        {isLibrary ? (
          <div className="absolute bottom-8 left-1/2 z-30 h-14 w-24 -translate-x-1/2">
            <div className="absolute inset-0 rounded-md bg-sky-200 shadow-sm" />
            <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-sky-400/60" />
            <div className="absolute left-2 top-3 h-1.5 w-7 rounded bg-white/80" />
            <div className="absolute right-2 top-3 h-1.5 w-7 rounded bg-rose-200/90" />
          </div>
        ) : null}
        <div className="absolute bottom-14 left-0 h-4 w-10 -rotate-12 rounded-full bg-amber-200" />
        <div className="absolute bottom-14 right-0 h-4 w-10 rotate-12 rounded-full bg-amber-200" />
        <div className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full bg-amber-200 shadow-sm">
          <div className="absolute -top-2 left-1/2 h-10 w-16 -translate-x-1/2 rounded-t-full bg-amber-800" />
          <div className="absolute -left-1 top-2 h-10 w-5 rounded-full bg-amber-800" />
          <div className="absolute -right-1 top-2 h-10 w-5 rounded-full bg-amber-800" />
          <div className="absolute left-4 top-7 h-2 w-2 rounded-full bg-slate-800" />
          <div className="absolute right-4 top-7 h-2 w-2 rounded-full bg-slate-800" />
          <div className="absolute bottom-3 left-1/2 h-2 w-5 -translate-x-1/2 rounded-b-full border-b-2 border-slate-700" />
        </div>
      </div>

      {/* decorative shapes */}
      <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-yellow-300/90" />
      <div className="absolute left-6 top-12 h-5 w-5 rounded-full bg-pink-300/80" />
      <div className="absolute bottom-28 right-2 h-7 w-7 rotate-12 rounded-md bg-emerald-300/80" />
      {isLibrary ? (
        <div className="absolute bottom-20 left-4 h-12 w-8 rounded-t-lg bg-sky-300 shadow-sm">
          <div className="mx-auto mt-1 h-8 w-1 rounded bg-amber-600/70" />
          <div className="mx-auto mt-0.5 h-8 w-1 rounded bg-rose-400/70" />
        </div>
      ) : null}
    </div>
  );
}

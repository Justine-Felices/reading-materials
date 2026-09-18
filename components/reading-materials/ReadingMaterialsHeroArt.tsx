/** Compact hero illustration matching the Reading Materials mockup. */
export default function ReadingMaterialsHeroArt() {
  return (
    <div
      className="relative h-[200px] w-full max-w-[280px] sm:h-[220px] sm:max-w-[300px]"
      aria-hidden="true"
    >
      {/* leaves */}
      <div className="absolute bottom-8 left-2 h-16 w-10 rotate-[-25deg] rounded-full bg-emerald-300/70" />
      <div className="absolute bottom-10 left-6 h-12 w-8 rotate-[-10deg] rounded-full bg-lime-300/80" />

      {/* books stack */}
      <div className="absolute bottom-4 left-1/2 h-9 w-44 -translate-x-1/2 rounded-md bg-[#5b9cf5] shadow-md" />
      <div className="absolute bottom-[2.35rem] left-1/2 h-9 w-40 -translate-x-1/2 rounded-md bg-[#f5c542] shadow-md" />

      {/* pencil cup */}
      <div className="absolute bottom-5 right-1 h-14 w-9 rounded-t-md bg-[#7eb6f5]">
        <div className="absolute -top-5 left-1.5 h-8 w-1.5 rotate-[-8deg] rounded-full bg-amber-500" />
        <div className="absolute -top-6 left-3.5 h-9 w-1.5 rotate-[4deg] rounded-full bg-rose-400" />
        <div className="absolute -top-4 left-6 h-7 w-1.5 rotate-[12deg] rounded-full bg-sky-700" />
      </div>

      {/* child */}
      <div className="absolute bottom-[4.25rem] left-1/2 z-10 h-28 w-24 -translate-x-1/2">
        <div className="absolute bottom-0 left-1/2 h-20 w-[5.5rem] -translate-x-1/2 rounded-t-[1.75rem] bg-[#6eb0f7]" />
        {/* open book */}
        <div className="absolute bottom-6 left-1/2 z-20 h-11 w-20 -translate-x-1/2">
          <div className="absolute inset-0 rounded-md bg-[#a8d0ff] shadow-sm" />
          <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-sky-500/50" />
          <div className="absolute left-1.5 top-2.5 h-1 w-6 rounded bg-white/90" />
          <div className="absolute right-1.5 top-2.5 h-1 w-6 rounded bg-rose-200" />
          <div className="absolute left-1.5 top-5 h-1 w-4 rounded bg-white/70" />
        </div>
        <div className="absolute bottom-10 left-0 h-3.5 w-8 -rotate-12 rounded-full bg-amber-200" />
        <div className="absolute bottom-10 right-0 h-3.5 w-8 rotate-12 rounded-full bg-amber-200" />
        {/* head */}
        <div className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 rounded-full bg-amber-200">
          <div className="absolute -top-1.5 left-1/2 h-9 w-14 -translate-x-1/2 rounded-t-full bg-[#6b4423]" />
          <div className="absolute -left-0.5 top-2 h-8 w-4 rounded-full bg-[#6b4423]" />
          <div className="absolute -right-0.5 top-2 h-8 w-4 rounded-full bg-[#6b4423]" />
          <div className="absolute left-3.5 top-6 h-1.5 w-1.5 rounded-full bg-slate-800" />
          <div className="absolute right-3.5 top-6 h-1.5 w-1.5 rounded-full bg-slate-800" />
          <div className="absolute bottom-2.5 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-b-full border-b-2 border-slate-700" />
        </div>
      </div>

      {/* floating accents */}
      <div className="absolute right-8 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-lg">
        💡
      </div>
      <div className="absolute left-8 top-8 rotate-[-12deg] text-xl">📘</div>
      <div className="absolute right-2 top-16 text-lg">⭐</div>
    </div>
  );
}

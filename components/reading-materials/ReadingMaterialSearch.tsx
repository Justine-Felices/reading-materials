"use client";

import { Search } from "lucide-react";

interface ReadingMaterialSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ReadingMaterialSearch({
  value,
  onChange,
}: ReadingMaterialSearchProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="material-search" className="sr-only">
        Search reading materials
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        id="material-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search reading materials..."
        className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-5 text-base text-foreground shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </div>
  );
}

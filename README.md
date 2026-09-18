# Learn & Grow — Reading Materials

A student-facing digital reading library for elementary learners, built with Next.js App Router, TypeScript, Tailwind CSS, and Lucide React.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Home landing page with featured materials
- Browse, search, and filter reading materials
- Storybook-style reading viewer with zoom, paging, and fullscreen
- Mock download toast (ready for real PDF URLs later)
- Fully responsive, kid-friendly UI

## Project Structure

- `app/` — routes (home, materials list, material reader)
- `components/` — reusable UI and reading components
- `data/reading-materials.ts` — typed mock content
- `types/reading-material.ts` — shared TypeScript types

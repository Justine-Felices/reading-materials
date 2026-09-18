"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readingMaterials as seedMaterials } from "@/data/reading-materials";
import type { Grade, ReadingMaterial } from "@/types/reading-material";

interface MaterialsContextValue {
  materials: ReadingMaterial[];
  addMaterial: (material: ReadingMaterial) => void;
  updateMaterial: (id: string, patch: Partial<ReadingMaterial>) => void;
  deleteMaterial: (id: string) => void;
  getById: (id: string) => ReadingMaterial | undefined;
  getByGrade: (grade: Grade) => ReadingMaterial[];
  getFeatured: (limit?: number) => ReadingMaterial[];
}

const MaterialsContext = createContext<MaterialsContextValue | null>(null);

function cloneSeedMaterials(): ReadingMaterial[] {
  return seedMaterials.map((material) => ({
    ...material,
    pages: material.pages.map((page) => ({
      ...page,
      content: [...page.content],
    })),
  }));
}

export function MaterialsProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<ReadingMaterial[]>(cloneSeedMaterials);

  const addMaterial = useCallback((material: ReadingMaterial) => {
    setMaterials((current) => [material, ...current]);
  }, []);

  const updateMaterial = useCallback(
    (id: string, patch: Partial<ReadingMaterial>) => {
      setMaterials((current) =>
        current.map((material) =>
          material.id === id ? { ...material, ...patch, id } : material,
        ),
      );
    },
    [],
  );

  const deleteMaterial = useCallback((id: string) => {
    setMaterials((current) => current.filter((material) => material.id !== id));
  }, []);

  const getById = useCallback(
    (id: string) => materials.find((material) => material.id === id),
    [materials],
  );

  const getByGrade = useCallback(
    (grade: Grade) =>
      materials
        .filter((material) => material.grade === grade)
        .sort(
          (a, b) =>
            a.week - b.week ||
            a.level - b.level ||
            a.title.localeCompare(b.title),
        ),
    [materials],
  );

  const getFeatured = useCallback(
    (limit = 4) => {
      const featured = materials.filter((material) => material.featured);
      return (featured.length > 0 ? featured : materials).slice(0, limit);
    },
    [materials],
  );

  const value = useMemo(
    () => ({
      materials,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      getById,
      getByGrade,
      getFeatured,
    }),
    [
      materials,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      getById,
      getByGrade,
      getFeatured,
    ],
  );

  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials() {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error("useMaterials must be used within MaterialsProvider");
  }
  return context;
}

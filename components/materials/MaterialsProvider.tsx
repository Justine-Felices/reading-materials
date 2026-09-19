"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readingMaterials as seedMaterials } from "@/data/reading-materials";
import type { Grade, ReadingMaterial } from "@/types/reading-material";

interface MaterialsContextValue {
  materials: ReadingMaterial[];
  loading: boolean;
  persistenceEnabled: boolean;
  refreshMaterials: () => Promise<void>;
  addMaterial: (material: ReadingMaterial) => Promise<boolean>;
  updateMaterial: (
    id: string,
    patch: Partial<ReadingMaterial>,
  ) => Promise<boolean>;
  deleteMaterial: (id: string) => Promise<boolean>;
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

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export function MaterialsProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<ReadingMaterial[]>(cloneSeedMaterials);
  const [loading, setLoading] = useState(true);
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);

  const refreshMaterials = useCallback(async () => {
    const response = await fetch("/api/materials", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(await readError(response));
    }
    const body = (await response.json()) as {
      materials: ReadingMaterial[];
      configured?: boolean;
    };
    setMaterials(body.materials);
    setPersistenceEnabled(Boolean(body.configured));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        await refreshMaterials();
      } catch (error) {
        console.error("[MaterialsProvider] load failed", error);
        if (!cancelled) {
          setMaterials(cloneSeedMaterials());
          setPersistenceEnabled(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [refreshMaterials]);

  const addMaterial = useCallback(async (material: ReadingMaterial) => {
    const response = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(material),
    });

    if (response.status === 503) {
      setMaterials((current) => [material, ...current]);
      setPersistenceEnabled(false);
      return false;
    }

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    const body = (await response.json()) as { material: ReadingMaterial };
    setMaterials((current) => [
      body.material,
      ...current.filter((item) => item.id !== body.material.id),
    ]);
    setPersistenceEnabled(true);
    return true;
  }, []);

  const updateMaterial = useCallback(
    async (id: string, patch: Partial<ReadingMaterial>) => {
      const response = await fetch(`/api/materials/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (response.status === 503) {
        setMaterials((current) =>
          current.map((material) =>
            material.id === id ? { ...material, ...patch, id } : material,
          ),
        );
        setPersistenceEnabled(false);
        return false;
      }

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const body = (await response.json()) as { material: ReadingMaterial };
      setMaterials((current) =>
        current.map((material) =>
          material.id === id ? body.material : material,
        ),
      );
      setPersistenceEnabled(true);
      return true;
    },
    [],
  );

  const deleteMaterial = useCallback(async (id: string) => {
    const response = await fetch(`/api/materials/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (response.status === 503) {
      setMaterials((current) => current.filter((material) => material.id !== id));
      setPersistenceEnabled(false);
      return false;
    }

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    setMaterials((current) => current.filter((material) => material.id !== id));
    setPersistenceEnabled(true);
    return true;
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
      loading,
      persistenceEnabled,
      refreshMaterials,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      getById,
      getByGrade,
      getFeatured,
    }),
    [
      materials,
      loading,
      persistenceEnabled,
      refreshMaterials,
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

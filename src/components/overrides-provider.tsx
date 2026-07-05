"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  effectivePrice,
  effectiveStock,
  loadOverrides,
  saveOverrides,
  type Override,
  type Overrides,
} from "@/lib/overrides";
import type { Product } from "@/lib/catalog";

type OverridesContextValue = {
  overrides: Overrides;
  ready: boolean;
  set: (id: string, patch: Override) => void;
  reset: (id: string) => void;
  stockOf: (product: Product) => number;
  priceOf: (product: Product) => number;
};

const OverridesContext = createContext<OverridesContextValue | null>(null);

export function OverridesProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverrides(loadOverrides());
    setReady(true);
    // 他タブ・管理⇔ストア間の同期
    const onStorage = (e: StorageEvent) => {
      if (e.key === "kounan_overrides_v1") setOverrides(loadOverrides());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Overrides) => {
    setOverrides(next);
    saveOverrides(next);
  }, []);

  const set = useCallback(
    (id: string, patch: Override) => {
      setOverrides((cur) => {
        const merged: Overrides = { ...cur, [id]: { ...cur[id], ...patch } };
        saveOverrides(merged);
        return merged;
      });
    },
    [],
  );

  const reset = useCallback((id: string) => {
    setOverrides((cur) => {
      const next = { ...cur };
      delete next[id];
      saveOverrides(next);
      return next;
    });
  }, []);

  void persist;

  const stockOf = useCallback((product: Product) => effectiveStock(product, overrides), [overrides]);
  const priceOf = useCallback((product: Product) => effectivePrice(product, overrides), [overrides]);

  const value = useMemo<OverridesContextValue>(
    () => ({ overrides, ready, set, reset, stockOf, priceOf }),
    [overrides, ready, set, reset, stockOf, priceOf],
  );

  return <OverridesContext.Provider value={value}>{children}</OverridesContext.Provider>;
}

export function useOverrides(): OverridesContextValue {
  const ctx = useContext(OverridesContext);
  if (!ctx) throw new Error("useOverrides must be used within OverridesProvider");
  return ctx;
}

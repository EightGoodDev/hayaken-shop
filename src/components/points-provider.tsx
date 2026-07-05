"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "kounan_points_v1";

type PointsContextValue = {
  balance: number;
  /** 獲得(earn)と利用(use)を同時に反映して残高を更新する */
  apply: (earn: number, use: number) => void;
  ready: boolean;
};

const PointsContext = createContext<PointsContextValue | null>(null);

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const n = raw ? Number(raw) : 0;
      if (Number.isFinite(n) && n >= 0) setBalance(n);
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(balance));
    } catch {
      /* noop */
    }
  }, [balance, ready]);

  const apply = useCallback((earn: number, use: number) => {
    setBalance((b) => Math.max(0, b - use + earn));
  }, []);

  const value = useMemo<PointsContextValue>(() => ({ balance, apply, ready }), [balance, apply, ready]);

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints(): PointsContextValue {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints must be used within PointsProvider");
  return ctx;
}

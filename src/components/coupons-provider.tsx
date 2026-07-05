"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "kounan_coupons_disabled_v1";

type CouponsContextValue = {
  disabled: string[];
  ready: boolean;
  isEnabled: (code: string) => boolean;
  toggle: (code: string) => void;
};

const CouponsContext = createContext<CouponsContextValue | null>(null);

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function CouponsProvider({ children }: { children: ReactNode }) {
  const [disabled, setDisabled] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDisabled(load());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setDisabled(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((code: string) => {
    setDisabled((cur) => {
      const next = cur.includes(code) ? cur.filter((x) => x !== code) : [...cur, code];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const isEnabled = useCallback((code: string) => !disabled.includes(code), [disabled]);
  const value = useMemo<CouponsContextValue>(() => ({ disabled, ready, isEnabled, toggle }), [disabled, ready, isEnabled, toggle]);

  return <CouponsContext.Provider value={value}>{children}</CouponsContext.Provider>;
}

export function useCoupons(): CouponsContextValue {
  const ctx = useContext(CouponsContext);
  if (!ctx) throw new Error("useCoupons must be used within CouponsProvider");
  return ctx;
}

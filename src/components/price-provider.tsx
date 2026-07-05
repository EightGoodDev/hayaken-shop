"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { yen } from "@/lib/format";

export type PriceMode = "incl" | "excl";
const STORAGE_KEY = "kounan_pricemode_v1";

type PriceContextValue = {
  mode: PriceMode;
  toggle: () => void;
  ready: boolean;
};

const PriceContext = createContext<PriceContextValue | null>(null);

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PriceMode>("incl");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "incl" || raw === "excl") setMode(raw);
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* noop */
    }
  }, [mode, ready]);

  const toggle = useCallback(() => setMode((m) => (m === "incl" ? "excl" : "incl")), []);
  const value = useMemo<PriceContextValue>(() => ({ mode, toggle, ready }), [mode, toggle, ready]);

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
}

export function usePriceMode(): PriceContextValue {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error("usePriceMode must be used within PriceProvider");
  return ctx;
}

/** 税込価格(value)を、現在の表示モードに応じて税込/税抜で描画する */
export function Price({ value, className, label = true }: { value: number; className?: string; label?: boolean }) {
  const { mode } = usePriceMode();
  const amount = mode === "excl" ? Math.floor(value / 1.1) : value;
  return (
    <span className={className}>
      {yen(amount)}
      {label ? <span className="tax">{mode === "excl" ? "税抜" : "税込"}</span> : null}
    </span>
  );
}

/** ヘッダー用の税込/税抜トグル */
export function PriceModeToggle() {
  const { mode, toggle } = usePriceMode();
  return (
    <button type="button" className="pricemode-toggle" onClick={toggle} aria-label="価格表示の税込・税抜を切替">
      価格: <b>{mode === "incl" ? "税込" : "税抜"}</b>表示
    </button>
  );
}

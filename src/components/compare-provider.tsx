"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { ProductImage } from "./product-image";

const STORAGE_KEY = "kounan_compare_v1";
export const COMPARE_MAX = 4;

type CompareContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  addIds: (ids: string[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  full: boolean;
  ready: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) setIds(parsed.filter((x): x is string => typeof x === "string").slice(0, COMPARE_MAX));
      }
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* noop */
    }
  }, [ids, ready]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string) =>
      setIds((cur) => {
        if (cur.includes(id)) return cur.filter((x) => x !== id);
        if (cur.length >= COMPARE_MAX) return cur;
        return [...cur, id];
      }),
    [],
  );
  const remove = useCallback((id: string) => setIds((cur) => cur.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);
  const addIds = useCallback(
    (incoming: string[]) =>
      setIds((cur) => {
        const merged = [...cur];
        for (const id of incoming) {
          if (getProduct(id) && !merged.includes(id) && merged.length < COMPARE_MAX) merged.push(id);
        }
        return merged;
      }),
    [],
  );

  const value = useMemo<CompareContextValue>(
    () => ({ ids, has, toggle, addIds, remove, clear, count: ids.length, full: ids.length >= COMPARE_MAX, ready }),
    [ids, has, toggle, addIds, remove, clear, ready],
  );

  const products = ids.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

  return (
    <CompareContext.Provider value={value}>
      {children}
      {ready && products.length > 0 ? (
        <div className="compare-bar">
          <div className="container compare-bar-inner">
            <div className="compare-bar-items">
              {products.map((p) => (
                <div key={p.id} className="compare-chip">
                  <span className="compare-chip-thumb">
                    <ProductImage product={p} />
                  </span>
                  <button type="button" aria-label="比較から削除" onClick={() => remove(p.id)}>
                    ✕
                  </button>
                </div>
              ))}
              {Array.from({ length: COMPARE_MAX - products.length }).map((_, i) => (
                <div key={`empty-${i}`} className="compare-chip empty" aria-hidden />
              ))}
            </div>
            <div className="compare-bar-actions">
              <button type="button" className="compare-clear" onClick={clear}>
                クリア
              </button>
              <Link href="/compare" className="btn btn-accent" style={{ padding: "10px 22px", fontSize: 14 }}>
                比較する（{products.length}）
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

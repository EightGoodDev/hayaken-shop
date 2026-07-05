import type { Product } from "./catalog";

/** 管理画面で編集した在庫・価格の上書き（localStorage） */
export type Override = { stock?: number; price?: number };
export type Overrides = Record<string, Override>;

export const OVERRIDES_KEY = "kounan_overrides_v1";

export function loadOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Overrides) : {};
  } catch {
    return {};
  }
}

export function saveOverrides(o: Overrides): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o));
  } catch {
    /* noop */
  }
}

export function effectiveStock(product: Product, ov: Overrides): number {
  const o = ov[product.id];
  return o && typeof o.stock === "number" ? o.stock : product.stock;
}

export function effectivePrice(product: Product, ov: Overrides): number {
  const o = ov[product.id];
  return o && typeof o.price === "number" ? o.price : product.price;
}

export function hasOverride(id: string, ov: Overrides): boolean {
  const o = ov[id];
  return !!o && (typeof o.stock === "number" || typeof o.price === "number");
}

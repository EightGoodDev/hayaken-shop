/** 最近チェックした商品（localStorage、最大12件） */
const STORAGE_KEY = "kounan_recent_v1";
const MAX = 12;

export function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function pushRecent(id: string): string[] {
  if (typeof window === "undefined") return [];
  const list = [id, ...loadRecent().filter((x) => x !== id)].slice(0, MAX);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* noop */
  }
  return list;
}

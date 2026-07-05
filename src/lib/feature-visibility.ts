/** トップページに表示する特集（キャンペーン）の公開/非公開管理（この端末のlocalStorage） */

export const FEATURE_HIDDEN_KEY = "kounan_features_hidden_v1";

export function loadHiddenFeatures(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FEATURE_HIDDEN_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveHiddenFeatures(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FEATURE_HIDDEN_KEY, JSON.stringify(slugs));
  } catch {
    /* noop */
  }
}

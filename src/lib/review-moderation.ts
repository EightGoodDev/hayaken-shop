/** 投稿レビューの非表示管理（この端末のlocalStorageに保存） */

import type { UserReview } from "./user-reviews";

const KEY = "kounan_review_hidden_v1";

/** 商品ID＋投稿内容から安定したキーを生成（indexに依存しない） */
export function reviewKey(productId: string, r: UserReview): string {
  return `${productId}##${r.date}##${r.author}##${r.title}`;
}

export function loadHiddenReviews(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveHiddenReviews(keys: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(keys));
  } catch {
    /* noop */
  }
}

export function isReviewHidden(hidden: string[], productId: string, r: UserReview): boolean {
  return hidden.includes(reviewKey(productId, r));
}

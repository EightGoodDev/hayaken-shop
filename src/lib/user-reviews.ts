/** ユーザー投稿レビュー（商品IDごとにlocalStorageへ保存） */

export type UserReview = {
  stars: number;
  title: string;
  body: string;
  author: string;
  date: string; // YYYY/MM/DD
};

const KEY_PREFIX = "kounan_review_";

export function loadUserReviews(productId: string): UserReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_PREFIX + productId);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as UserReview[]) : [];
  } catch {
    return [];
  }
}

export function addUserReview(productId: string, review: UserReview): UserReview[] {
  if (typeof window === "undefined") return [];
  const list = [review, ...loadUserReviews(productId)];
  try {
    localStorage.setItem(KEY_PREFIX + productId, JSON.stringify(list));
  } catch {
    /* noop */
  }
  return list;
}

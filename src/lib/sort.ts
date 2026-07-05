import type { Product } from "./catalog";

export type SortKey = "recommended" | "price-asc" | "price-desc" | "rating" | "reviews";

export const SORT_LABELS: Record<SortKey, string> = {
  recommended: "おすすめ順",
  "price-asc": "価格の安い順",
  "price-desc": "価格の高い順",
  rating: "評価の高い順",
  reviews: "レビューの多い順",
};

export function sortProducts(products: Product[], key: SortKey): Product[] {
  const list = [...products];
  switch (key) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "reviews":
      return list.sort((a, b) => b.reviews - a.reviews);
    case "recommended":
    default:
      return list.sort((a, b) => {
        const ra = a.rank ?? 999;
        const rb = b.rank ?? 999;
        if (ra !== rb) return ra - rb;
        return b.reviews - a.reviews;
      });
  }
}

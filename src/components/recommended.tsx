"use client";

import { useEffect, useState } from "react";
import { getProduct, PRODUCTS, rankingProducts, type Product } from "@/lib/catalog";
import { loadRecent } from "@/lib/recent";
import { ProductGrid } from "./product-card";

/**
 * 閲覧履歴のカテゴリから「あなたへのおすすめ」を生成。
 * 履歴が無ければ売れ筋ランキングにフォールバック。
 */
export function RecommendedForYou({ limit = 5 }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    const recent = loadRecent();
    const viewed = new Set(recent);
    const cats = Array.from(
      new Set(recent.map((id) => getProduct(id)?.category).filter((c): c is string => Boolean(c))),
    );

    let recs: Product[];
    if (cats.length > 0) {
      recs = PRODUCTS.filter((p) => cats.includes(p.category) && !viewed.has(p.id) && p.stock > 0).sort(
        (a, b) => (a.rank ?? 999) - (b.rank ?? 999) || b.reviews - a.reviews,
      );
      setPersonalized(recs.length > 0);
    } else {
      recs = [];
    }
    if (recs.length < limit) {
      // 不足分は売れ筋で補完
      const fill = rankingProducts(20).filter((p) => !viewed.has(p.id) && !recs.some((r) => r.id === p.id));
      recs = [...recs, ...fill];
    }
    setProducts(recs.slice(0, limit));
    setReady(true);
  }, [limit]);

  if (!ready || products.length === 0) return null;

  return (
    <section className="section">
      <div className="section-head">
        <h2>🎯 あなたへのおすすめ</h2>
        <span className="result-count">{personalized ? "閲覧履歴をもとに厳選" : "人気の商品"}</span>
      </div>
      <ProductGrid products={products} dense />
    </section>
  );
}

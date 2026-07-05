"use client";

import { useEffect, useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { loadRecent, pushRecent } from "@/lib/recent";
import { ProductGrid } from "./product-card";

/** 商品詳細で閲覧を記録する（表示なし） */
export function RecordRecentView({ id }: { id: string }) {
  useEffect(() => {
    pushRecent(id);
  }, [id]);
  return null;
}

/** 最近チェックした商品の一覧。excludeId で現在の商品を除外。 */
export function RecentlyViewed({ excludeId, limit = 6 }: { excludeId?: string; limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const list = loadRecent()
      .filter((id) => id !== excludeId)
      .map((id) => getProduct(id))
      .filter((p): p is Product => Boolean(p))
      .slice(0, limit);
    setProducts(list);
    setReady(true);
  }, [excludeId, limit]);

  if (!ready || products.length === 0) return null;

  return (
    <section className="section">
      <div className="section-head">
        <h2>🕘 最近チェックした商品</h2>
      </div>
      <ProductGrid products={products} dense />
    </section>
  );
}

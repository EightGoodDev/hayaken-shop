"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ProductGrid } from "./product-card";

/** ページネーション付き商品グリッド（「もっと見る」で追加読み込み） */
export function PagedGrid({ products, pageSize = 12, dense }: { products: Product[]; pageSize?: number; dense?: boolean }) {
  const [shown, setShown] = useState(pageSize);

  // 商品リストが変わったら先頭ページに戻す
  useEffect(() => {
    setShown(pageSize);
  }, [products, pageSize]);

  const visible = products.slice(0, shown);
  const remaining = products.length - visible.length;

  return (
    <div>
      <ProductGrid products={visible} dense={dense} />
      {remaining > 0 ? (
        <div style={{ textAlign: "center", marginTop: 22 }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: "12px 32px" }}
            onClick={() => setShown((s) => s + pageSize)}
          >
            もっと見る（残り{remaining}件）
          </button>
        </div>
      ) : null}
    </div>
  );
}

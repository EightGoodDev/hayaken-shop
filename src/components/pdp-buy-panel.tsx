"use client";

import type { Product } from "@/lib/catalog";
import { originalPrice } from "@/lib/format";
import { Price } from "./price-provider";
import { BuyBox } from "./buy-box";
import { useOverrides } from "./overrides-provider";

/** 商品詳細の価格・在庫・購入ボックス（在庫/価格の上書きを反映） */
export function PdpBuyPanel({ product }: { product: Product }) {
  const { stockOf, priceOf, ready } = useOverrides();
  const stock = ready ? stockOf(product) : product.stock;
  const price = ready ? priceOf(product) : product.price;
  const was = product.off > 0 ? originalPrice(price, product.off) : null;
  const lowStock = stock > 0 && stock <= 15;

  return (
    <div className="price-block">
      <div className="price-row">
        <Price value={price} className="price" />
        {was ? <Price value={was} className="price-was" label={false} /> : null}
        {product.off > 0 ? <span className="off-tag">{product.off}%OFF</span> : null}
      </div>
      <div className={`stock ${lowStock ? "low" : ""}`}>
        {stock > 0 ? (lowStock ? `残りわずか（在庫 ${stock}）` : "在庫あり ｜ 即日発送") : "在庫切れ"}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{Math.floor(price / 100)}ポイント還元</div>
      <div style={{ marginTop: 14 }}>
        <BuyBox id={product.id} stock={stock} />
      </div>
    </div>
  );
}

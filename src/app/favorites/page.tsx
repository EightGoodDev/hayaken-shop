"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useFavorites } from "@/components/favorites-provider";
import { ProductGrid } from "@/components/product-card";
import { getProduct, type Product } from "@/lib/catalog";

export default function FavoritesPage() {
  const { ids, ready } = useFavorites();
  const { add } = useCart();
  const [addedAll, setAddedAll] = useState(false);
  const products = ids.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));
  const inStock = products.filter((p) => p.stock > 0);

  function addAll() {
    inStock.forEach((p) => add(p.id, 1));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 1600);
  }

  if (!ready) {
    return (
      <div className="container">
        <p style={{ padding: "40px 0", color: "var(--muted)" }}>読み込み中…</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container">
        <div className="empty">
          <div className="e" aria-hidden>♡</div>
          <h3>お気に入りはまだありません</h3>
          <p>商品カードや商品ページの ♡ を押すと、ここに保存されます。</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            商品を探す
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>お気に入り</span>
      </nav>
      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>♥ お気に入り</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="result-count">{products.length}件</span>
          {inStock.length > 0 ? (
            <button type="button" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={addAll}>
              {addedAll ? "✓ カートに追加しました" : `🛒 在庫のある${inStock.length}件をまとめてカートに`}
            </button>
          ) : null}
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { saleProducts } from "@/lib/catalog";
import { PagedGrid } from "@/components/paged-grid";

export const metadata: Metadata = { title: "セール・お買い得" };

export default function SalePage() {
  const products = saleProducts(50);
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>セール</span>
      </nav>
      <div
        className="hero"
        style={{ background: "linear-gradient(120deg,#ffe0e6,#ffd0c2)", marginTop: 8, gridTemplateColumns: "1fr" }}
      >
        <div>
          <span className="pill" style={{ background: "#fde8ec", color: "var(--accent-dark)" }}>期間限定</span>
          <h1 style={{ color: "var(--accent-dark)" }}>🔥 タイムセール・お買い得市</h1>
          <p>対象商品が今だけおトク。数量限定・なくなり次第終了です。</p>
        </div>
      </div>
      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-head">
          <h2>セール対象商品</h2>
          <span className="result-count">{products.length}件</span>
        </div>
        <PagedGrid products={products} />
      </div>
    </div>
  );
}

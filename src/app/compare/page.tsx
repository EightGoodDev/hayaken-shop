"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCompare } from "@/components/compare-provider";
import { CardCartButton } from "@/components/add-to-cart-button";
import { ProductImage } from "@/components/product-image";
import { Price } from "@/components/price-provider";
import { Stars } from "@/components/stars";
import { getCategory, getProduct, type Product } from "@/lib/catalog";
import { originalPrice } from "@/lib/format";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "40px 0", color: "var(--muted)" }}>読み込み中…</div>}>
      <CompareInner />
    </Suspense>
  );
}

function CompareInner() {
  const { ids, addIds, remove, clear, ready } = useCompare();
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);

  // 共有URL（?ids=）で来たら比較リストに取り込む
  useEffect(() => {
    const raw = params.get("ids");
    if (raw) addIds(raw.split(",").map((s) => s.trim()).filter(Boolean));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = ids.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

  function share() {
    const url = `${window.location.origin}/compare?ids=${ids.join(",")}`;
    try {
      navigator.clipboard?.writeText(url);
    } catch {
      /* noop */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
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
          <div className="e" aria-hidden>⇄</div>
          <h3>比較する商品がありません</h3>
          <p>商品カードや商品ページの「⇄ 比較」を押すと、ここで比べられます（最大4件）。</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            商品を探す
          </Link>
        </div>
      </div>
    );
  }

  const rows: Array<{ label: string; render: (p: Product) => React.ReactNode }> = [
    {
      label: "価格",
      render: (p) => {
        const was = p.off > 0 ? originalPrice(p.price, p.off) : null;
        return (
          <div>
            <Price value={p.price} className="price" />
            {was ? (
              <div>
                <Price value={was} className="price-was" label={false} /> <span className="off-tag">{p.off}%OFF</span>
              </div>
            ) : null}
          </div>
        );
      },
    },
    { label: "評価", render: (p) => <Stars rating={p.rating} reviews={p.reviews} /> },
    { label: "ブランド", render: (p) => p.brand },
    { label: "カテゴリ", render: (p) => getCategory(p.category)?.name ?? "-" },
    {
      label: "在庫",
      render: (p) => (p.stock > 0 ? <span style={{ color: "var(--ok)" }}>在庫あり</span> : <span style={{ color: "var(--accent-dark)" }}>在庫切れ</span>),
    },
    {
      label: "主な仕様",
      render: (p) => (
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7, textAlign: "left" }}>
          {p.specs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>商品比較</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>商品比較</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button type="button" className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }} onClick={share}>
            {copied ? "✓ リンクをコピー" : "🔗 共有リンクをコピー"}
          </button>
          <button type="button" className="link-remove" onClick={clear}>
            すべてクリア
          </button>
        </div>
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <tbody>
            <tr>
              <th className="compare-rowhead" />
              {products.map((p) => (
                <td key={p.id} className="compare-col-head">
                  <div style={{ position: "relative" }}>
                    <button type="button" className="compare-col-remove" aria-label="削除" onClick={() => remove(p.id)}>
                      ✕
                    </button>
                    <Link href={`/product/${p.id}`}>
                      <span className="compare-thumb">
                        <ProductImage product={p} />
                      </span>
                      <span className="compare-name">{p.name}</span>
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
            {rows.map((row) => (
              <tr key={row.label}>
                <th className="compare-rowhead">{row.label}</th>
                {products.map((p) => (
                  <td key={p.id} className="compare-cell">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="compare-rowhead" />
              {products.map((p) => (
                <td key={p.id} className="compare-cell">
                  <CardCartButton id={p.id} soldOut={p.stock === 0} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

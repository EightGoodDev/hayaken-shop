"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, searchProducts } from "@/lib/catalog";
import { PagedGrid } from "@/components/paged-grid";

const POPULAR_KEYWORDS = [
  "インパクトドライバー",
  "培養土",
  "LED",
  "洗剤",
  "作業手袋",
  "収納ケース",
  "防災",
  "ペンキ",
  "電池",
  "包丁",
];

function SearchResults() {
  const query = (useSearchParams().get("q") ?? "").trim();
  const results = query ? searchProducts(query) : [];

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>検索結果</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>{query ? `「${query}」の検索結果` : "商品を検索"}</h2>
        {query ? <span className="result-count">{results.length}件</span> : null}
      </div>

      {query && results.length > 0 ? (
        <PagedGrid products={results} />
      ) : query ? (
        <div className="empty">
          <div className="e" aria-hidden>🔍</div>
          <h3>「{query}」に一致する商品が見つかりませんでした</h3>
          <p>キーワードを変えるか、カテゴリから探してみてください。</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="pill">
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 8 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 10px" }}>🔥 人気のキーワード</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {POPULAR_KEYWORDS.map((k) => (
                <Link key={k} href={`/search?q=${encodeURIComponent(k)}`} className="pill">
                  {k}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 10px" }}>カテゴリから探す</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="pill">
                  {c.emoji} {c.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container">
          <p style={{ padding: "40px 0", color: "var(--muted)" }}>読み込み中…</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}

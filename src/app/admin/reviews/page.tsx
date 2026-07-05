"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, getCategory } from "@/lib/catalog";
import { loadUserReviews, type UserReview } from "@/lib/user-reviews";
import {
  loadHiddenReviews,
  reviewKey,
  saveHiddenReviews,
} from "@/lib/review-moderation";

type Row = { productId: string; productName: string; category: string; review: UserReview; key: string };

export default function AdminReviews() {
  const [rows, setRows] = useState<Row[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");

  useEffect(() => {
    const all: Row[] = [];
    for (const p of PRODUCTS) {
      for (const r of loadUserReviews(p.id)) {
        all.push({
          productId: p.id,
          productName: p.name,
          category: getCategory(p.category)?.name ?? "-",
          review: r,
          key: reviewKey(p.id, r),
        });
      }
    }
    all.sort((a, b) => (a.review.date < b.review.date ? 1 : -1));
    setRows(all);
    setHidden(loadHiddenReviews());
    setReady(true);
  }, []);

  function toggle(key: string) {
    setHidden((cur) => {
      const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
      saveHiddenReviews(next);
      return next;
    });
  }

  const hiddenSet = useMemo(() => new Set(hidden), [hidden]);
  const shown = rows.filter((row) => {
    const isHidden = hiddenSet.has(row.key);
    if (filter === "visible") return !isHidden;
    if (filter === "hidden") return isHidden;
    return true;
  });
  const hiddenCount = rows.filter((r) => hiddenSet.has(r.key)).length;
  const avg = rows.length > 0 ? rows.reduce((s, r) => s + r.review.stars, 0) / rows.length : 0;

  return (
    <div>
      <div className="admin-head">
        <h1>レビュー管理</h1>
        <p>この端末に投稿されたカスタマーレビューです。不適切な投稿は非表示にできます（ストア側に即時反映）。</p>
      </div>

      <div className="admin-kpis" style={{ gridTemplateColumns: "repeat(3,1fr)", maxWidth: 620 }}>
        <div className="admin-kpi">
          <span className="admin-kpi-label">投稿レビュー</span>
          <b>{ready ? rows.length : "—"}</b>
          <span className="admin-kpi-sub">この端末</span>
        </div>
        <div className={`admin-kpi ${hiddenCount > 0 ? "warn" : ""}`}>
          <span className="admin-kpi-label">非表示</span>
          <b>{ready ? hiddenCount : "—"}</b>
          <span className="admin-kpi-sub">モデレート済み</span>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi-label">平均評価</span>
          <b>{ready && rows.length > 0 ? avg.toFixed(2) : "—"}</b>
          <span className="admin-kpi-sub">投稿の平均</span>
        </div>
      </div>

      <div className="admin-toolbar" style={{ marginTop: 16 }}>
        <div className="admin-seg" role="group" aria-label="表示フィルタ">
          {([
            ["all", "すべて"],
            ["visible", "表示中"],
            ["hidden", "非表示"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`admin-seg-btn ${filter === key ? "on" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, marginTop: 14, overflowX: "auto" }}>
        <table className="admin-table admin-table-wide">
          <thead>
            <tr>
              <th style={{ width: 80 }}>評価</th>
              <th>レビュー</th>
              <th>商品</th>
              <th>投稿者・日付</th>
              <th style={{ textAlign: "center" }}>状態</th>
              <th style={{ textAlign: "right" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {!ready ? (
              <tr>
                <td colSpan={6} className="admin-muted" style={{ textAlign: "center", padding: 24 }}>読み込み中…</td>
              </tr>
            ) : shown.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-muted" style={{ textAlign: "center", padding: 24 }}>
                  {rows.length === 0
                    ? "この端末にはまだ投稿レビューがありません。商品ページで投稿すると表示されます。"
                    : "該当するレビューはありません。"}
                </td>
              </tr>
            ) : (
              shown.map((row) => {
                const isHidden = hiddenSet.has(row.key);
                return (
                  <tr key={row.key} style={isHidden ? { opacity: 0.55 } : undefined}>
                    <td>
                      <span className="stars" aria-label={`${row.review.stars}つ星`}>
                        {"★".repeat(row.review.stars)}
                        {"☆".repeat(5 - row.review.stars)}
                      </span>
                    </td>
                    <td>
                      <b style={{ display: "block" }}>{row.review.title}</b>
                      <span className="admin-muted" style={{ fontSize: 12.5 }}>{row.review.body}</span>
                    </td>
                    <td>
                      <Link href={`/product/${row.productId}`} className="admin-link">{row.productName}</Link>
                      <div className="admin-muted" style={{ fontSize: 12 }}>{row.category}</div>
                    </td>
                    <td>
                      {row.review.author}
                      <div className="admin-muted" style={{ fontSize: 12 }}>{row.review.date}</div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`admin-stock ${isHidden ? "out" : ""}`}
                        style={isHidden ? undefined : { background: "#e6f4ea", color: "#1a7f37" }}
                      >
                        {isHidden ? "非表示" : "表示中"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className={`btn ${isHidden ? "btn-primary" : "btn-ghost"}`}
                        style={{ padding: "6px 14px", fontSize: 13 }}
                        onClick={() => toggle(row.key)}
                      >
                        {isHidden ? "再表示" : "非表示にする"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="admin-muted" style={{ fontSize: 12, marginTop: 12 }}>
        ※ 合成レビュー（サンプル）は対象外です。ここで管理できるのは実際に投稿された内容のみです。
      </p>
    </div>
  );
}

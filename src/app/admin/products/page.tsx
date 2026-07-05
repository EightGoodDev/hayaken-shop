"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, getCategory, PRODUCTS } from "@/lib/catalog";
import { originalPrice, yen } from "@/lib/format";
import { useOverrides } from "@/components/overrides-provider";

export default function AdminProducts() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const { overrides, ready, set, reset, stockOf, priceOf } = useOverrides();

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const stock = ready ? stockOf(p) : p.stock;
      if (cat !== "all" && p.category !== cat) return false;
      if (stockFilter === "out" && stock !== 0) return false;
      if (stockFilter === "low" && !(stock > 0 && stock <= 5)) return false;
      if (stockFilter === "sale" && p.off === 0) return false;
      if (query && !(p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.id.includes(query)))
        return false;
      return true;
    });
  }, [q, cat, stockFilter, ready, stockOf]);

  function exportCsv() {
    const header = ["商品コード", "商品名", "ブランド", "カテゴリ", "サブカテゴリ", "税込価格", "割引率", "在庫", "評価", "レビュー数"];
    const lines = rows.map((p) =>
      [
        p.id.toUpperCase(),
        `"${p.name.replace(/"/g, '""')}"`,
        p.brand,
        getCategory(p.category)?.name ?? "",
        p.sub,
        priceOf(p),
        p.off,
        stockOf(p),
        p.rating,
        p.reviews,
      ].join(","),
    );
    const csv = "﻿" + [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="admin-head">
        <h1>商品管理</h1>
        <p>全{PRODUCTS.length}商品。在庫・価格はその場で編集できます（この端末に保存され、ストア表示にも反映されます）。</p>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="商品名・ブランド・コードで検索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="admin-input" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">全カテゴリ</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="admin-input" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="all">在庫：すべて</option>
          <option value="out">在庫切れ</option>
          <option value="low">在庫わずか（1〜5）</option>
          <option value="sale">セール中</option>
        </select>
        <span className="admin-muted" style={{ marginLeft: "auto" }}>{rows.length}件</span>
        <button type="button" className="admin-btn" onClick={exportCsv}>
          ⬇ CSV書き出し
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="admin-table admin-table-wide">
          <thead>
            <tr>
              <th>コード</th>
              <th>商品名</th>
              <th>カテゴリ</th>
              <th style={{ textAlign: "right" }}>価格(税込)</th>
              <th style={{ textAlign: "center" }}>割引</th>
              <th style={{ textAlign: "right" }}>在庫</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const price = ready ? priceOf(p) : p.price;
              const stock = ready ? stockOf(p) : p.stock;
              const edited = ready && !!overrides[p.id];
              return (
                <tr key={p.id} className={edited ? "admin-row-edited" : ""}>
                  <td className="admin-mono">{p.id.toUpperCase()}</td>
                  <td>
                    <Link href={`/product/${p.id}`} className="admin-link">{p.name}</Link>
                    <div className="admin-muted" style={{ fontSize: 11 }}>{p.brand}{edited ? " ・変更あり" : ""}</div>
                  </td>
                  <td>
                    {getCategory(p.category)?.name}
                    <div className="admin-muted" style={{ fontSize: 11 }}>{p.sub}</div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <input
                      className="admin-cell-input"
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => set(p.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                      aria-label={`${p.name}の価格`}
                    />
                    {p.off > 0 ? <div className="admin-muted" style={{ fontSize: 11 }}><s>{yen(originalPrice(price, p.off))}</s></div> : null}
                  </td>
                  <td style={{ textAlign: "center" }}>{p.off > 0 ? <span className="admin-tag sale">{p.off}%</span> : "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <input
                      className={`admin-cell-input ${stock === 0 ? "danger" : stock <= 5 ? "warn" : ""}`}
                      type="number"
                      min={0}
                      value={stock}
                      onChange={(e) => set(p.id, { stock: Math.max(0, Math.floor(Number(e.target.value) || 0)) })}
                      aria-label={`${p.name}の在庫`}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {edited ? (
                      <button type="button" className="admin-link" style={{ background: "none", border: 0, fontSize: 12 }} onClick={() => reset(p.id)}>
                        取消
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

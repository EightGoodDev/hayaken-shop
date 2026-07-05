"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogStats, lowStockProducts } from "@/lib/admin-stats";
import { getCategory } from "@/lib/catalog";
import { loadOrders, orderStatus, type OrderRecord } from "@/lib/orders";
import { AdminSalesChart } from "@/components/admin-sales-chart";
import { useOverrides } from "@/components/overrides-provider";
import { yen } from "@/lib/format";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ready, setReady] = useState(false);
  const { overrides, ready: ovReady } = useOverrides();
  const ovMap = ovReady ? overrides : {};
  const stats = catalogStats(ovMap);
  const low = lowStockProducts(ovMap);

  useEffect(() => {
    setOrders(loadOrders());
    setReady(true);
  }, []);

  const activeOrders = orders.filter((o) => orderStatus(o) !== "cancelled");
  const revenue = activeOrders.reduce((s, o) => s + o.total, 0);
  const aov = activeOrders.length > 0 ? Math.round(revenue / activeOrders.length) : 0;

  const tiles = [
    { label: "売上合計（この端末）", value: ready ? yen(revenue) : "—", sub: `${activeOrders.length}件の注文` },
    { label: "平均注文額", value: ready ? yen(aov) : "—", sub: "AOV" },
    { label: "登録商品数", value: `${stats.total}`, sub: `${stats.categories}カテゴリ` },
    { label: "在庫金額", value: yen(stats.inventoryValue), sub: "在庫×価格の合計" },
    { label: "在庫切れ", value: `${stats.outOfStock}`, sub: "要発注", tone: stats.outOfStock > 0 ? "warn" : undefined },
    { label: "在庫わずか", value: `${stats.lowStock}`, sub: "残り5点以下", tone: stats.lowStock > 0 ? "warn" : undefined },
    { label: "セール中", value: `${stats.onSale}`, sub: "割引適用商品" },
    { label: "平均評価", value: stats.avgRating.toFixed(2), sub: "全商品平均" },
  ];

  return (
    <div>
      <div className="admin-head">
        <h1>ダッシュボード</h1>
        <p>ストアの概況です。注文・売上はこの端末（localStorage）のデータを表示します。</p>
      </div>

      <div className="admin-kpis">
        {tiles.map((t) => (
          <div className={`admin-kpi ${t.tone ?? ""}`} key={t.label}>
            <span className="admin-kpi-label">{t.label}</span>
            <b>{t.value}</b>
            <span className="admin-kpi-sub">{t.sub}</span>
          </div>
        ))}
      </div>

      {ready ? (
        <div style={{ marginTop: 18 }}>
          <AdminSalesChart orders={orders} />
        </div>
      ) : null}

      <div className="admin-grid2">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>最近の注文</h2>
            <Link href="/admin/orders" className="admin-link">すべて見る →</Link>
          </div>
          {!ready ? (
            <p className="admin-muted">読み込み中…</p>
          ) : activeOrders.length === 0 ? (
            <p className="admin-muted">この端末にはまだ注文がありません。ストア側で注文すると表示されます。</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>注文番号</th>
                  <th>日時</th>
                  <th>点数</th>
                  <th style={{ textAlign: "right" }}>金額</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/mypage/orders/${o.id}`} className="admin-link">{o.id}</Link>
                    </td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{o.itemCount}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      {orderStatus(o) === "cancelled" ? <s style={{ color: "var(--muted)" }}>{yen(o.total)}</s> : yen(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card">
          <div className="admin-card-head">
            <h2>在庫アラート</h2>
            <Link href="/admin/inventory" className="admin-link">在庫管理 →</Link>
          </div>
          {low.length === 0 ? (
            <p className="admin-muted">在庫の少ない商品はありません。</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>商品</th>
                  <th>カテゴリ</th>
                  <th style={{ textAlign: "right" }}>在庫</th>
                </tr>
              </thead>
              <tbody>
                {low.slice(0, 6).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/product/${p.id}`} className="admin-link">{p.name}</Link>
                    </td>
                    <td>{getCategory(p.category)?.name ?? "-"}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`admin-stock ${p.stock === 0 ? "out" : "low"}`}>
                        {p.stock === 0 ? "在庫切れ" : `残り${p.stock}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

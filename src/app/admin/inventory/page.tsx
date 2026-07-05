"use client";

"use client";

import Link from "next/link";
import { getCategory } from "@/lib/catalog";
import { lowStockProducts } from "@/lib/admin-stats";
import { useOverrides } from "@/components/overrides-provider";
import { yen } from "@/lib/format";

export default function AdminInventory() {
  const { overrides, ready, stockOf, priceOf } = useOverrides();
  const ovMap = ready ? overrides : {};
  const low = lowStockProducts(ovMap);
  const stockOfP = (p: (typeof low)[number]) => (ready ? stockOf(p) : p.stock);
  const out = low.filter((p) => stockOfP(p) === 0);
  const warn = low.filter((p) => stockOfP(p) > 0);

  return (
    <div>
      <div className="admin-head">
        <h1>在庫アラート</h1>
        <p>在庫切れ・在庫わずか（5点以下）の商品です。要発注の目安にご利用ください。</p>
      </div>

      <div className="admin-kpis" style={{ gridTemplateColumns: "repeat(2,1fr)", maxWidth: 520 }}>
        <div className="admin-kpi warn">
          <span className="admin-kpi-label">在庫切れ</span>
          <b>{out.length}</b>
          <span className="admin-kpi-sub">要発注</span>
        </div>
        <div className="admin-kpi warn">
          <span className="admin-kpi-label">在庫わずか</span>
          <b>{warn.length}</b>
          <span className="admin-kpi-sub">残り5点以下</span>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, marginTop: 18, overflowX: "auto" }}>
        <table className="admin-table admin-table-wide">
          <thead>
            <tr>
              <th>商品名</th>
              <th>ブランド</th>
              <th>カテゴリ</th>
              <th style={{ textAlign: "right" }}>価格</th>
              <th style={{ textAlign: "right" }}>在庫</th>
              <th style={{ textAlign: "right" }}>推奨</th>
            </tr>
          </thead>
          <tbody>
            {low.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-muted" style={{ textAlign: "center", padding: 24 }}>
                  在庫の少ない商品はありません。
                </td>
              </tr>
            ) : (
              low.map((p) => {
                const st = stockOfP(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/product/${p.id}`} className="admin-link">{p.name}</Link>
                    </td>
                    <td>{p.brand}</td>
                    <td>{getCategory(p.category)?.name}</td>
                    <td style={{ textAlign: "right" }}>{yen(ready ? priceOf(p) : p.price)}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`admin-stock ${st === 0 ? "out" : "low"}`}>
                        {st === 0 ? "在庫切れ" : `残り${st}`}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", color: "var(--brand-dark)", fontWeight: 700 }}>
                      +{st === 0 ? 20 : 10}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="admin-muted" style={{ fontSize: 12, marginTop: 12 }}>
        ※ デモのため、発注・在庫更新は行われません（「推奨」は補充目安の例示です）。
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCoupons } from "@/components/coupons-provider";
import { COUPONS } from "@/lib/coupons";
import { yen } from "@/lib/format";

export default function AdminCoupons() {
  const { ready, isEnabled, toggle } = useCoupons();
  const activeCount = ready ? COUPONS.filter((c) => isEnabled(c.code)).length : COUPONS.length;
  const stoppedCount = COUPONS.length - activeCount;

  return (
    <div>
      <div className="admin-head">
        <h1>クーポン管理</h1>
        <p>配布中のクーポンの受付を停止・再開できます。停止するとストア側で適用できなくなります。</p>
      </div>

      <div className="admin-kpis" style={{ gridTemplateColumns: "repeat(3,1fr)", maxWidth: 620 }}>
        <div className="admin-kpi">
          <span className="admin-kpi-label">登録クーポン</span>
          <b>{COUPONS.length}</b>
          <span className="admin-kpi-sub">種類</span>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi-label">受付中</span>
          <b>{ready ? activeCount : "—"}</b>
          <span className="admin-kpi-sub">利用可能</span>
        </div>
        <div className={`admin-kpi ${stoppedCount > 0 ? "warn" : ""}`}>
          <span className="admin-kpi-label">停止中</span>
          <b>{ready ? stoppedCount : "—"}</b>
          <span className="admin-kpi-sub">利用不可</span>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, marginTop: 18, overflowX: "auto" }}>
        <table className="admin-table admin-table-wide">
          <thead>
            <tr>
              <th>コード</th>
              <th>内容</th>
              <th style={{ textAlign: "right" }}>割引</th>
              <th style={{ textAlign: "right" }}>最低小計</th>
              <th style={{ textAlign: "right" }}>割引上限</th>
              <th style={{ textAlign: "center" }}>状態</th>
              <th style={{ textAlign: "right" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {COUPONS.map((c) => {
              const on = !ready || isEnabled(c.code);
              return (
                <tr key={c.code}>
                  <td>
                    <code className="coupon-code" style={{ margin: 0 }}>{c.code}</code>
                  </td>
                  <td>{c.label}</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    {c.type === "fixed" ? yen(c.value) : `${c.value}%`}
                  </td>
                  <td style={{ textAlign: "right" }}>{yen(c.minSubtotal)}</td>
                  <td style={{ textAlign: "right" }}>{c.maxDiscount ? yen(c.maxDiscount) : "—"}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className={`admin-stock ${on ? "" : "out"}`} style={on ? { background: "var(--ok-bg, #e6f4ea)", color: "var(--ok, #1a7f37)" } : undefined}>
                      {ready ? (on ? "受付中" : "停止中") : "…"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className={`btn ${on ? "btn-ghost" : "btn-primary"}`}
                      style={{ padding: "6px 14px", fontSize: 13 }}
                      onClick={() => toggle(c.code)}
                      disabled={!ready}
                    >
                      {on ? "停止する" : "再開する"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="admin-muted" style={{ fontSize: 12, marginTop: 12 }}>
        ※ 設定はこの端末（localStorage）に保存され、ストアのクーポン一覧・カート・注文手続きに即時反映されます。
        {" "}
        <Link href="/coupons" className="admin-link">ストアのクーポン一覧を見る →</Link>
      </p>
    </div>
  );
}

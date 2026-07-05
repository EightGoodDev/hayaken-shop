"use client";

import { orderStatus, type OrderRecord } from "@/lib/orders";
import { yen } from "@/lib/format";

type Day = { key: string; label: string; revenue: number; count: number };

/** 直近 days 日分の日次売上を集計（キャンセル除く） */
function buildDays(orders: OrderRecord[], days: number): Day[] {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const buckets: Day[] = [];
  const index = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    index.set(key, buckets.length);
    buckets.push({ key, label: `${d.getMonth() + 1}/${d.getDate()}`, revenue: 0, count: 0 });
  }
  for (const o of orders) {
    if (orderStatus(o) === "cancelled") continue;
    const d = new Date(o.createdAt);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const idx = index.get(key);
    if (idx === undefined) continue;
    buckets[idx].revenue += o.total;
    buckets[idx].count += 1;
  }
  return buckets;
}

export function AdminSalesChart({ orders, days = 14 }: { orders: OrderRecord[]; days?: number }) {
  const data = buildDays(orders, days);
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const peak = data.reduce((m, d) => Math.max(m, d.revenue), 0);
  const max = Math.max(peak, 1);

  // SVG座標
  const W = 720;
  const H = 200;
  const padL = 12;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const n = data.length;
  const slot = (W - padL - padR) / n;
  const barW = slot * 0.62;
  const plotH = H - padT - padB;
  const y0 = H - padB;

  const summary = `直近${days}日の日次売上。合計 ${yen(total)}、最大 ${yen(peak)}。`;

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h2>売上推移（直近{days}日）</h2>
        <span className="admin-muted" style={{ fontSize: 12 }}>合計 {yen(total)}</span>
      </div>

      {total === 0 ? (
        <p className="admin-muted">この期間の売上データはありません（ストア側で注文すると反映されます）。</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="sales-chart" role="img" aria-label={summary} preserveAspectRatio="none">
          {/* ゼロ基線 */}
          <line x1={padL} y1={y0} x2={W - padR} y2={y0} stroke="var(--line-strong)" strokeWidth="1" />
          {/* 目盛（最大値の半分・最大） */}
          {[0.5, 1].map((f) => (
            <line
              key={f}
              x1={padL}
              y1={y0 - plotH * f}
              x2={W - padR}
              y2={y0 - plotH * f}
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          ))}
          {data.map((d, i) => {
            const h = (d.revenue / max) * plotH;
            const x = padL + i * slot + (slot - barW) / 2;
            const y = y0 - h;
            return (
              <g key={d.key}>
                {d.revenue > 0 ? (
                  <rect x={x} y={y} width={barW} height={h} rx="3" fill="var(--brand)">
                    <title>{`${d.label}：${yen(d.revenue)}（${d.count}件）`}</title>
                  </rect>
                ) : null}
                {i % 2 === 0 || i === n - 1 ? (
                  <text x={x + barW / 2} y={H - 10} fontSize="11" textAnchor="middle" fill="var(--muted)">
                    {d.label}
                  </text>
                ) : null}
              </g>
            );
          })}
          {/* 最大値ラベル */}
          <text x={padL} y={y0 - plotH - 2} fontSize="10" fill="var(--muted)">
            {yen(peak)}
          </text>
        </svg>
      )}
    </section>
  );
}

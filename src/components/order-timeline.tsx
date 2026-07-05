"use client";

import { orderStatus, STATUS_FLOW, type OrderRecord } from "@/lib/orders";

const STEPS = [
  { label: "注文受付", icon: "📝" },
  { label: "発送準備中", icon: "📦" },
  { label: "発送完了", icon: "🚚" },
  { label: "お届け完了", icon: "🏠" },
];

/** 注文日からの経過日数でおおよその進捗を表示する（デモ） */
export function OrderTimeline({ order }: { order: OrderRecord }) {
  const cancelled = orderStatus(order) === "cancelled";

  if (cancelled) {
    return (
      <div className="timeline-cancelled">
        <span aria-hidden>🚫</span> この注文はキャンセルされました
      </div>
    );
  }

  const created = new Date(order.createdAt).getTime();
  const days = Number.isNaN(created) ? 0 : Math.floor((Date.now() - created) / 86400000);
  const daysStep = Math.min(STEPS.length - 1, Math.max(0, days));
  // 管理画面で設定した明示ステータスと、経過日数の進捗の大きい方を採用
  const statusStep = Math.max(0, STATUS_FLOW.indexOf(orderStatus(order)));
  const current = Math.max(statusStep, daysStep);

  return (
    <div className="timeline" role="list" aria-label="注文ステータス">
      {STEPS.map((step, i) => {
        const state = i < current ? "done" : i === current ? "current" : "pending";
        return (
          <div className={`timeline-step ${state}`} key={step.label} role="listitem">
            {i > 0 ? <span className="timeline-line" aria-hidden /> : null}
            <span className="timeline-dot" aria-hidden>
              {state === "done" ? "✓" : step.icon}
            </span>
            <span className="timeline-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

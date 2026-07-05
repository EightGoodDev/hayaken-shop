"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  deliveryLabel,
  loadOrders,
  orderStatus,
  paymentLabel,
  statusLabel,
  STATUS_FLOW,
  updateOrder,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders";
import { yen } from "@/lib/format";

const ALL_STATUSES: OrderStatus[] = [...STATUS_FLOW, "cancelled"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(
    d.getHours(),
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
    setReady(true);
  }, []);

  function changeStatus(id: string, status: OrderStatus) {
    setOrders(updateOrder(id, { status }));
  }

  function exportCsv() {
    const header = ["注文番号", "注文日時", "状態", "受取方法", "支払方法", "点数", "小計", "送料", "割引", "利用ポイント", "合計"];
    const rows = orders.map((o) =>
      [
        o.id,
        `"${formatDate(o.createdAt)}"`,
        statusLabel(orderStatus(o)),
        `"${deliveryLabel(o.delivery)}"`,
        `"${paymentLabel(o.payment)}"`,
        o.itemCount,
        o.subtotal,
        o.shipping,
        o.discount ?? 0,
        o.usedPoints ?? 0,
        o.total,
      ].join(","),
    );
    const csv = "﻿" + [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const active = orders.filter((o) => orderStatus(o) !== "cancelled");
  const revenue = active.reduce((s, o) => s + o.total, 0);

  const query = q.trim().toLowerCase();
  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && orderStatus(o) !== statusFilter) return false;
    if (query && !o.id.toLowerCase().includes(query)) return false;
    return true;
  });
  const statusCounts = (s: OrderStatus) => orders.filter((o) => orderStatus(o) === s).length;

  return (
    <div>
      <div className="admin-head admin-head-row">
        <div>
          <h1>注文管理</h1>
          <p>この端末（localStorage）に保存された注文を表示します。</p>
        </div>
        <button
          type="button"
          className="admin-btn"
          onClick={exportCsv}
          disabled={!ready || orders.length === 0}
        >
          ⬇ CSVエクスポート
        </button>
      </div>

      <div className="admin-kpis" style={{ gridTemplateColumns: "repeat(3,1fr)", maxWidth: 640 }}>
        <div className="admin-kpi">
          <span className="admin-kpi-label">注文件数</span>
          <b>{ready ? orders.length : "—"}</b>
          <span className="admin-kpi-sub">{active.length}件 有効</span>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi-label">売上合計</span>
          <b>{ready ? yen(revenue) : "—"}</b>
          <span className="admin-kpi-sub">キャンセル除く</span>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi-label">キャンセル</span>
          <b>{ready ? orders.length - active.length : "—"}</b>
          <span className="admin-kpi-sub">件</span>
        </div>
      </div>

      <div className="admin-toolbar" style={{ marginTop: 18 }}>
        <div className="admin-seg" role="group" aria-label="ステータスで絞り込み">
          <button
            type="button"
            className={`admin-seg-btn ${statusFilter === "all" ? "on" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            すべて（{orders.length}）
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`admin-seg-btn ${statusFilter === s ? "on" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {statusLabel(s)}（{statusCounts(s)}）
            </button>
          ))}
        </div>
        <input
          className="admin-input"
          placeholder="注文番号で検索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ marginLeft: "auto", minWidth: 200 }}
        />
      </div>

      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="admin-table admin-table-wide">
          <thead>
            <tr>
              <th>注文番号</th>
              <th>日時</th>
              <th>状態</th>
              <th>受取/支払</th>
              <th style={{ textAlign: "right" }}>点数</th>
              <th style={{ textAlign: "right" }}>金額</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!ready ? (
              <tr>
                <td colSpan={7} className="admin-muted" style={{ textAlign: "center", padding: 24 }}>読み込み中…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-muted" style={{ textAlign: "center", padding: 24 }}>
                  {orders.length === 0
                    ? "この端末にはまだ注文がありません。ストア側で注文すると表示されます。"
                    : "条件に一致する注文はありません。"}
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id}>
                  <td className="admin-mono">{o.id}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>
                    <select
                      className={`admin-status-select ${orderStatus(o)}`}
                      value={orderStatus(o)}
                      onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                      aria-label="注文ステータス"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {deliveryLabel(o.delivery)}
                    <div className="admin-muted">{paymentLabel(o.payment)}</div>
                  </td>
                  <td style={{ textAlign: "right" }}>{o.itemCount}</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{yen(o.total)}</td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`/mypage/order?id=${o.id}`} className="admin-link">詳細</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

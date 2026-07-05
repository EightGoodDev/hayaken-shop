"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AddressManager } from "@/components/address-manager";
import { useFavorites } from "@/components/favorites-provider";
import { usePoints } from "@/components/points-provider";
import { deliveryLabel, loadOrders, orderStatus, orderStatusLabel, paymentLabel, type OrderRecord } from "@/lib/orders";
import { yen } from "@/lib/format";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(
    d.getHours(),
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function MyPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ready, setReady] = useState(false);
  const { count: favCount } = useFavorites();
  const { balance } = usePoints();

  useEffect(() => {
    setOrders(loadOrders());
    setReady(true);
  }, []);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>マイページ</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>マイページ</h2>
      </div>

      <div className="mypage-stats">
        <div className="stat-card">
          <span className="stat-label">注文回数</span>
          <b>{ready ? orders.length : "-"}</b>
        </div>
        <div className="stat-card">
          <span className="stat-label">利用金額合計</span>
          <b>{ready ? yen(totalSpent) : "-"}</b>
        </div>
        <div className="stat-card">
          <span className="stat-label">保有ポイント</span>
          <b>{ready ? `${balance.toLocaleString("ja-JP")} pt` : "-"}</b>
        </div>
        <Link href="/favorites" className="stat-card" style={{ textDecoration: "none" }}>
          <span className="stat-label">お気に入り</span>
          <b>{favCount}件 →</b>
        </Link>
      </div>

      <div className="section-head" style={{ marginTop: 28 }}>
        <h2>お届け先の管理</h2>
      </div>
      <AddressManager />

      <div className="section-head" style={{ marginTop: 28 }}>
        <h2>注文履歴</h2>
        <span className="result-count">{orders.length}件</span>
      </div>

      {!ready ? (
        <p style={{ color: "var(--muted)" }}>読み込み中…</p>
      ) : orders.length === 0 ? (
        <div className="empty">
          <div className="e" aria-hidden>📦</div>
          <h3>まだ注文履歴がありません</h3>
          <p>ご注文が完了すると、ここに履歴が表示されます。</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            買い物を始める
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((o) => (
            <div key={o.id} className="order-card">
              <div className="order-head">
                <div>
                  <span className={`order-status ${orderStatus(o)}`}>{orderStatusLabel(o)}</span>
                  <span className="pill" style={{ marginLeft: 8 }}>注文番号 {o.id}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 10 }}>{formatDate(o.createdAt)}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "var(--accent-dark)" }}>{yen(o.total)}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {deliveryLabel(o.delivery)}・{paymentLabel(o.payment)}
                  </div>
                </div>
              </div>
              <div className="order-items">
                {o.items.slice(0, 3).map((it) => (
                  <div key={it.id} className="order-item">
                    <Link href={`/product/${it.id}`} className="order-item-name">
                      {it.name}
                    </Link>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {yen(it.price)} × {it.qty}
                    </span>
                  </div>
                ))}
                {o.items.length > 3 ? (
                  <div style={{ fontSize: 12, color: "var(--muted)", padding: "8px 0 0" }}>
                    ほか {o.items.length - 3} 商品
                  </div>
                ) : null}
                <Link href={`/mypage/orders/${o.id}`} className="btn btn-ghost" style={{ marginTop: 12, padding: "8px 18px", fontSize: 13 }}>
                  注文の詳細を見る →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

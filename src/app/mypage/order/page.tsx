"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { usePoints } from "@/components/points-provider";
import {
  deliveryLabel,
  loadOrders,
  orderStatus,
  orderStatusLabel,
  paymentLabel,
  updateOrder,
  type OrderRecord,
} from "@/lib/orders";
import { getProduct } from "@/lib/catalog";
import { OrderTimeline } from "@/components/order-timeline";
import { OrderEmailPreview } from "@/components/order-email-preview";
import { yen } from "@/lib/format";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(
    d.getHours(),
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function OrderDetail() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { add } = useCart();
  const { apply } = usePoints();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = loadOrders().find((o) => o.id === id) ?? null;
    setOrder(found);
    setReady(true);
  }, [id]);

  function cancel() {
    if (!order || orderStatus(order) === "cancelled") return;
    if (!confirm("この注文をキャンセルしますか？（デモ）")) return;
    updateOrder(order.id, { status: "cancelled" });
    // ポイントを巻き戻す（獲得を取消・利用分を返還）
    apply(order.usedPoints, order.earnedPoints);
    setOrder({ ...order, status: "cancelled" });
  }

  function reorder() {
    if (!order) return;
    order.items.forEach((it) => {
      const p = getProduct(it.id);
      if (p && p.stock > 0) add(it.id, it.qty);
    });
    router.push("/cart");
  }

  if (!ready) {
    return (
      <div className="container">
        <p style={{ padding: "40px 0", color: "var(--muted)" }}>読み込み中…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <div className="empty">
          <div className="e" aria-hidden>🔍</div>
          <h3>注文が見つかりませんでした</h3>
          <p>この端末に保存された注文履歴にありません。</p>
          <Link href="/mypage" className="btn btn-primary" style={{ marginTop: 12 }}>
            マイページに戻る
          </Link>
        </div>
      </div>
    );
  }

  const rows: Array<[string, string]> = [
    ["注文番号", order.id],
    ["注文日時", formatDate(order.createdAt)],
    ["お受け取り方法", deliveryLabel(order.delivery)],
    ["お支払い方法", paymentLabel(order.payment)],
    ["お届け希望日", order.deliveryDate ?? "最短でお届け"],
    ...(order.timeSlot ? ([["時間帯", order.timeSlot]] as Array<[string, string]>) : []),
    ...(order.gift ? ([["ギフト包装", "あり"]] as Array<[string, string]>) : []),
    ...(order.giftMessage ? ([["メッセージ", order.giftMessage]] as Array<[string, string]>) : []),
  ];

  return (
    <div className="container" style={{ maxWidth: 820 }}>
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <Link href="/mypage">マイページ</Link>
        <span>›</span>
        <span>注文詳細</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>注文詳細</h2>
        <span className={`order-status ${orderStatus(order)}`}>{orderStatusLabel(order)}</span>
      </div>

      <div className="co-card" style={{ marginBottom: 18 }}>
        <OrderTimeline order={order} />
        <OrderEmailPreview order={order} />
      </div>

      <div className="order-detail-grid">
        <div>
          {order.shipments && order.shipments.length > 0 ? (
            order.shipments.map((s, i) => (
              <div key={s.address.id + i} className="cart-list" style={{ marginBottom: 14 }}>
                <div style={{ padding: "12px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    {order.shipments!.length > 1 ? `お届け先${i + 1}：` : "お届け先："}
                    <span className="addr-label">{s.address.label}</span> {s.address.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    〒{s.address.zip} {s.address.address}
                    <span style={{ marginLeft: 8 }}>送料 {s.shipping === 0 ? "無料" : yen(s.shipping)}</span>
                  </div>
                </div>
                {s.items.map((it) => (
                  <div className="order-item" key={it.id} style={{ padding: "14px 16px" }}>
                    <Link href={`/product/${it.id}`} className="order-item-name">
                      <span style={{ display: "block", fontSize: 11, color: "var(--muted)" }}>{it.brand}</span>
                      {it.name}
                    </Link>
                    <span style={{ whiteSpace: "nowrap" }}>
                      {yen(it.price)} × {it.qty}
                      <b style={{ display: "block", textAlign: "right", color: "var(--accent-dark)" }}>{yen(it.price * it.qty)}</b>
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="cart-list">
              {order.items.map((it) => (
                <div className="order-item" key={it.id} style={{ padding: "14px 16px" }}>
                  <Link href={`/product/${it.id}`} className="order-item-name">
                    <span style={{ display: "block", fontSize: 11, color: "var(--muted)" }}>{it.brand}</span>
                    {it.name}
                  </Link>
                  <span style={{ whiteSpace: "nowrap" }}>
                    {yen(it.price)} × {it.qty}
                    <b style={{ display: "block", textAlign: "right", color: "var(--accent-dark)" }}>{yen(it.price * it.qty)}</b>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="summary" style={{ position: "static" }}>
          <h3>ご注文情報</h3>
          {rows.map(([k, v]) => (
            <div className="summary-row" key={k}>
              <span>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div className="summary-row" style={{ borderTop: "1px solid var(--line)", marginTop: 8, paddingTop: 12 }}>
            <span>小計</span>
            <span>{yen(order.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>送料</span>
            <span>{order.shipping === 0 ? "無料" : yen(order.shipping)}</span>
          </div>
          {order.discount > 0 ? (
            <div className="summary-row" style={{ color: "var(--accent-dark)" }}>
              <span>クーポン{order.coupon ? `（${order.coupon}）` : ""}</span>
              <span>−{yen(order.discount)}</span>
            </div>
          ) : null}
          {order.usedPoints > 0 ? (
            <div className="summary-row" style={{ color: "var(--accent-dark)" }}>
              <span>ポイント利用</span>
              <span>−{order.usedPoints.toLocaleString("ja-JP")} pt</span>
            </div>
          ) : null}
          <div className="summary-row total">
            <span>お支払い合計</span>
            <span className="accent">{yen(order.total)}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right", marginTop: 4 }}>
            {orderStatus(order) === "cancelled" ? "この注文はキャンセルされました" : `${order.earnedPoints.toLocaleString("ja-JP")} ポイント獲得`}
          </div>
          <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={reorder}>
            🛒 もう一度カートに入れる
          </button>
          {orderStatus(order) === "ordered" ? (
            <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={cancel}>
              注文をキャンセル
            </button>
          ) : null}
          <Link href="/mypage" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
            マイページに戻る
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container">
          <p style={{ padding: "40px 0", color: "var(--muted)" }}>読み込み中…</p>
        </div>
      }
    >
      <OrderDetail />
    </Suspense>
  );
}

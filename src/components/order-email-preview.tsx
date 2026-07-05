"use client";

import { useState } from "react";
import { deliveryLabel, paymentLabel, type OrderRecord } from "@/lib/orders";
import { yen } from "@/lib/format";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}

/** 注文確認メールのプレビュー（デモ：実送信はされません） */
export function OrderEmailPreview({ order }: { order: OrderRecord }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 16 }}>
      <button type="button" className="btn btn-ghost" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => setOpen((o) => !o)}>
        📧 確認メールのプレビュー{open ? "を閉じる" : ""}
      </button>

      {open ? (
        <div className="email-preview">
          <div className="email-head">
            <div><span>From</span> ハヤケン eショップ &lt;order@hayaken-shop.example.com&gt;</div>
            <div><span>件名</span> 【ハヤケン】ご注文ありがとうございます（{order.id}）</div>
          </div>
          <div className="email-body">
            <p>紺南 太郎 様</p>
            <p>この度はハヤケン eショップをご利用いただきありがとうございます。<br />ご注文を下記のとおり承りました。</p>

            <p>
              ■ ご注文番号：{order.id}<br />
              ■ ご注文日時：{formatDate(order.createdAt)}<br />
              ■ お受け取り：{deliveryLabel(order.delivery)}<br />
              ■ お支払い：{paymentLabel(order.payment)}
              {order.deliveryDate ? <><br />■ お届け希望日：{order.deliveryDate}{order.timeSlot ? `／${order.timeSlot}` : ""}</> : null}
            </p>

            <p style={{ margin: 0, fontWeight: 700 }}>［ご注文商品］</p>
            <pre className="email-items">
{order.items.map((it) => `・${it.name}\n   ${yen(it.price)} × ${it.qty} = ${yen(it.price * it.qty)}`).join("\n")}
            </pre>

            <pre className="email-items">
{`小計：${yen(order.subtotal)}
送料：${order.shipping === 0 ? "無料" : yen(order.shipping)}${order.discount > 0 ? `\nクーポン：-${yen(order.discount)}` : ""}${order.usedPoints > 0 ? `\nポイント利用：-${order.usedPoints.toLocaleString("ja-JP")}pt` : ""}
──────────────
お支払い合計：${yen(order.total)}
獲得ポイント：${order.earnedPoints.toLocaleString("ja-JP")}pt`}
            </pre>

            <p>商品の発送準備が整いましたら、あらためて発送のご案内メールをお送りします。</p>
            <p style={{ color: "var(--muted)", fontSize: 12 }}>
              ※ これはデモの表示です。実際にメールは送信されません。
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

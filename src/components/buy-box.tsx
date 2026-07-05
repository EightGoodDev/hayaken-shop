"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { FavButton } from "./fav-button";
import { CompareToggle } from "./compare-toggle";

export function BuyBox({ id, stock }: { id: string; stock: number }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [notified, setNotified] = useState(false);
  const max = Math.min(stock, 10);

  if (stock === 0) {
    return (
      <div>
        <div className="buy-row">
          <button
            type="button"
            className={`btn ${notified ? "btn-ghost" : "btn-primary"}`}
            onClick={() => setNotified(true)}
            disabled={notified}
          >
            {notified ? "✓ 入荷お知らせを登録しました" : "🔔 入荷お知らせを受け取る"}
          </button>
          <FavButton id={id} variant="inline" />
        </div>
        <div className="trust">
          <span className="chip">現在在庫切れです</span>
          <span className="chip">🏬 店舗在庫はお近くの店舗へ</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="buy-row">
        <div className="qty" role="group" aria-label="数量">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="数量を減らす">
            −
          </button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label="数量を増やす">
            ＋
          </button>
        </div>
        <button type="button" className="btn btn-accent" onClick={() => add(id, qty)}>
          🛒 カートに入れる
        </button>
        <Link href="/cart" className="btn btn-ghost" onClick={() => add(id, qty)}>
          今すぐ購入
        </Link>
        <FavButton id={id} variant="inline" />
        <CompareToggle id={id} variant="inline" />
      </div>
      <div className="trust">
        <span className="chip">🚚 3,980円以上で送料無料</span>
        <span className="chip">🏬 店舗受取OK</span>
        <span className="chip">↩️ 30日以内返品可</span>
      </div>
    </div>
  );
}

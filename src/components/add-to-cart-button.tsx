"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

/** 商品カード内の小さな「カートに入れる」ボタン */
export function CardCartButton({ id, soldOut }: { id: string; soldOut?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (soldOut) {
    return (
      <button type="button" className="card-cart sold-out" disabled>
        在庫切れ
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`card-cart ${added ? "added" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        add(id, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "✓ 追加しました" : "🛒 カートに入れる"}
    </button>
  );
}

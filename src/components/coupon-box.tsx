"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import { useCoupons } from "./coupons-provider";
import { validateCoupon } from "@/lib/coupons";

/** クーポン入力＋適用状態表示。適用可否は subtotal を渡して判定する。 */
export function CouponBox({ subtotal }: { subtotal: number }) {
  const { couponCode, setCouponCode } = useCart();
  const { disabled } = useCoupons();
  const [input, setInput] = useState("");

  const result = couponCode ? validateCoupon(couponCode, subtotal, disabled) : null;

  function apply() {
    const code = input.trim().toUpperCase();
    if (!code) return;
    setCouponCode(code);
    setInput("");
  }

  return (
    <div className="coupon-box">
      {result?.ok ? (
        <div className="coupon-applied">
          <span>
            🎟️ <b>{couponCode}</b>
            <span style={{ display: "block", fontSize: 11, color: "var(--ok)" }}>{result.message}</span>
          </span>
          <button type="button" onClick={() => setCouponCode("")} className="coupon-remove">
            削除
          </button>
        </div>
      ) : (
        <>
          <div className="coupon-input-row">
            <input
              type="text"
              placeholder="クーポンコード"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  apply();
                }
              }}
              aria-label="クーポンコード"
            />
            <button type="button" onClick={apply}>
              適用
            </button>
          </div>
          {couponCode && result && !result.ok ? (
            <div className="coupon-error">{result.message}</div>
          ) : (
            <div className="coupon-hint">例: WELCOME500 / SPRING10 / DIY1000</div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useCoupons } from "@/components/coupons-provider";
import { COUPONS } from "@/lib/coupons";
import { yen } from "@/lib/format";

export default function CouponsPage() {
  const { setCouponCode } = useCart();
  const { isEnabled, ready } = useCoupons();
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);

  function copy(code: string) {
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      /* noop */
    }
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  function useInCart(code: string) {
    setCouponCode(code);
    router.push("/cart");
  }

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>クーポン</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>🎟️ 利用できるクーポン</h2>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: -6 }}>
        コードをカートまたはご注文手続きで入力すると割引が適用されます。
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
        {COUPONS.map((c) => {
          const stopped = ready && !isEnabled(c.code);
          return (
          <div key={c.code} className={`coupon-card${stopped ? " coupon-card-off" : ""}`}>
            <div className="coupon-card-main">
              <div className="coupon-value">
                {c.type === "fixed" ? yen(c.value) : `${c.value}%`}
                <span>OFF</span>
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>
                  {c.label}
                  {stopped ? <span className="coupon-off-badge">受付停止中</span> : null}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  {yen(c.minSubtotal)}以上のご購入で利用可能
                  {c.maxDiscount ? ` ／ 割引上限 ${yen(c.maxDiscount)}` : ""}
                </div>
                <code className="coupon-code">{c.code}</code>
              </div>
            </div>
            <div className="coupon-card-actions">
              <button type="button" className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => copy(c.code)} disabled={stopped}>
                {copied === c.code ? "✓ コピー" : "コードをコピー"}
              </button>
              <button type="button" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => useInCart(c.code)} disabled={stopped}>
                {stopped ? "利用不可" : "カートで使う"}
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

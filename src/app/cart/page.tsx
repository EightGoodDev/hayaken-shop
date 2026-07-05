"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { useCoupons } from "@/components/coupons-provider";
import { CouponBox } from "@/components/coupon-box";
import { ProductImage } from "@/components/product-image";
import { RecommendedForYou } from "@/components/recommended";
import {
  FREE_SHIPPING_THRESHOLD,
  grandTotal,
  resolveLines,
  shippingFee,
  subtotal,
} from "@/lib/cart";
import { validateCoupon } from "@/lib/coupons";
import { yen } from "@/lib/format";

export default function CartPage() {
  const { cart, setQuantity, remove, couponCode, ready } = useCart();
  const { disabled } = useCoupons();
  const lines = resolveLines(cart);
  const sub = subtotal(cart);
  const ship = shippingFee(cart);
  const couponResult = couponCode ? validateCoupon(couponCode, sub, disabled) : null;
  const discount = couponResult?.ok ? couponResult.discount : 0;
  const total = grandTotal(cart) - discount;
  const remain = Math.max(0, FREE_SHIPPING_THRESHOLD - sub);
  const points = Math.floor((sub - discount) / 100);

  if (!ready) {
    return (
      <div className="container">
        <p style={{ padding: "40px 0", color: "var(--muted)" }}>読み込み中…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container">
        <div className="empty">
          <div className="e" aria-hidden>🛒</div>
          <h3>カートは空です</h3>
          <p>気になる商品をカートに追加しましょう。</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            買い物を続ける
          </Link>
        </div>
        <RecommendedForYou limit={5} />
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>カート</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>ショッピングカート</h2>
        <span className="result-count">{lines.length}商品</span>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {lines.map(({ product, qty, lineTotal }) => (
            <div className="cart-row" key={product.id}>
              <Link href={`/product/${product.id}`}>
                <ProductImage product={product} />
              </Link>
              <div>
                <div className="ci-brand">{product.brand}</div>
                <Link href={`/product/${product.id}`}>
                  <div className="ci-name">{product.name}</div>
                </Link>
                <div className="qty" style={{ marginTop: 10 }}>
                  <button type="button" onClick={() => setQuantity(product.id, qty - 1)} aria-label="数量を減らす">
                    −
                  </button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => setQuantity(product.id, qty + 1)} aria-label="数量を増やす">
                    ＋
                  </button>
                </div>
                <button type="button" className="link-remove" onClick={() => remove(product.id)}>
                  削除する
                </button>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="ci-price">{yen(lineTotal)}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>単価 {yen(product.price)}</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>ご注文サマリー</h3>
          <div className="freeship" aria-live="polite">
            <div className="freeship-msg">
              {ship === 0 ? (
                <>🎉 <b>送料無料</b>の対象です</>
              ) : (
                <>あと <b className="accent">{yen(remain)}</b> で送料無料</>
              )}
            </div>
            <div
              className="freeship-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={FREE_SHIPPING_THRESHOLD}
              aria-valuenow={Math.min(sub, FREE_SHIPPING_THRESHOLD)}
            >
              <span
                className={`freeship-fill${ship === 0 ? " done" : ""}`}
                style={{ width: `${Math.min(100, Math.round((sub / FREE_SHIPPING_THRESHOLD) * 100))}%` }}
              />
            </div>
          </div>
          <div className="summary-row">
            <span>小計（税込）</span>
            <span>{yen(sub)}</span>
          </div>
          <div className="summary-row">
            <span>送料</span>
            <span>{ship === 0 ? "無料" : yen(ship)}</span>
          </div>
          {discount > 0 ? (
            <div className="summary-row" style={{ color: "var(--accent-dark)" }}>
              <span>クーポン割引</span>
              <span>−{yen(discount)}</span>
            </div>
          ) : null}
          <div style={{ margin: "12px 0" }}>
            <CouponBox subtotal={sub} />
          </div>
          <div className="summary-row">
            <span>獲得予定ポイント</span>
            <span>{points.toLocaleString("ja-JP")} pt</span>
          </div>
          <div className="summary-row total">
            <span>合計</span>
            <span className="accent">{yen(total)}</span>
          </div>
          <Link href="/checkout" className="btn btn-accent btn-block" style={{ marginTop: 14 }}>
            レジに進む
          </Link>
          <Link href="/" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
            買い物を続ける
          </Link>
        </aside>
      </div>
    </div>
  );
}

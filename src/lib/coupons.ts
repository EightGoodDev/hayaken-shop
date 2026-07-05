export type Coupon = {
  code: string;
  label: string;
  type: "fixed" | "percent";
  value: number; // fixed:円 / percent:%
  minSubtotal: number; // 適用に必要な最低小計
  maxDiscount?: number; // percent時の割引上限（円）
};

export const COUPONS: Coupon[] = [
  { code: "WELCOME500", label: "初回500円OFF", type: "fixed", value: 500, minSubtotal: 3000 },
  { code: "SPRING10", label: "春の10%OFF（上限2,000円）", type: "percent", value: 10, minSubtotal: 5000, maxDiscount: 2000 },
  { code: "DIY1000", label: "DIY応援1,000円OFF", type: "fixed", value: 1000, minSubtotal: 8000 },
];

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: number; message: string }
  | { ok: false; discount: 0; message: string };

/** クーポンコードを検証し、割引額を算出する。disabled に含まれるコードは停止中として扱う */
export function validateCoupon(code: string, subtotal: number, disabled: string[] = []): CouponResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, discount: 0, message: "クーポンコードを入力してください" };

  const coupon = COUPONS.find((c) => c.code === normalized);
  if (!coupon) return { ok: false, discount: 0, message: "無効なクーポンコードです" };

  if (disabled.includes(coupon.code)) {
    return { ok: false, discount: 0, message: "このクーポンは現在ご利用いただけません" };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      discount: 0,
      message: `このクーポンは小計 ¥${coupon.minSubtotal.toLocaleString("ja-JP")} 以上でご利用いただけます`,
    };
  }

  let discount =
    coupon.type === "fixed" ? coupon.value : Math.floor((subtotal * coupon.value) / 100);
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal); // 小計を超えない

  return { ok: true, coupon, discount, message: `${coupon.label} を適用しました` };
}

import { describe, expect, it } from "vitest";
import { validateCoupon } from "./coupons";

describe("validateCoupon", () => {
  it("rejects empty and unknown codes", () => {
    expect(validateCoupon("", 5000).ok).toBe(false);
    expect(validateCoupon("NOPE", 5000).ok).toBe(false);
  });

  it("applies a fixed coupon when subtotal meets the minimum", () => {
    const r = validateCoupon("WELCOME500", 3000);
    expect(r.ok).toBe(true);
    expect(r.discount).toBe(500);
  });

  it("rejects a coupon below its minimum subtotal", () => {
    const r = validateCoupon("WELCOME500", 2999);
    expect(r.ok).toBe(false);
    expect(r.discount).toBe(0);
  });

  it("caps a percent coupon at maxDiscount", () => {
    // SPRING10: 10% (上限2000), min5000 → 30000の10%=3000 だが上限2000
    const r = validateCoupon("spring10", 30000);
    expect(r.ok).toBe(true);
    expect(r.discount).toBe(2000);
  });

  it("computes percent discount under the cap", () => {
    const r = validateCoupon("SPRING10", 6000);
    expect(r.ok).toBe(true);
    expect(r.discount).toBe(600);
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(validateCoupon("  welcome500 ", 3000).ok).toBe(true);
  });

  it("rejects a coupon that has been disabled by admin", () => {
    const r = validateCoupon("WELCOME500", 3000, ["WELCOME500"]);
    expect(r.ok).toBe(false);
    expect(r.discount).toBe(0);
  });

  it("still applies other coupons when an unrelated one is disabled", () => {
    const r = validateCoupon("WELCOME500", 3000, ["SPRING10"]);
    expect(r.ok).toBe(true);
    expect(r.discount).toBe(500);
  });
});

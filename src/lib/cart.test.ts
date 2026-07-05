import { describe, expect, it } from "vitest";
import { PRODUCTS } from "./catalog";
import {
  addLine,
  EMPTY_CART,
  FREE_SHIPPING_THRESHOLD,
  grandTotal,
  removeLine,
  setQty,
  shippingFee,
  subtotal,
  totalCount,
} from "./cart";

const cheap = PRODUCTS.find((p) => p.price < 1000)!;
const pricey = PRODUCTS.find((p) => p.price >= FREE_SHIPPING_THRESHOLD)!;

describe("cart", () => {
  it("adds and merges lines", () => {
    let c = addLine(EMPTY_CART, cheap.id, 1);
    c = addLine(c, cheap.id, 2);
    expect(c.lines).toHaveLength(1);
    expect(totalCount(c)).toBe(3);
  });

  it("computes subtotal from resolved products", () => {
    const c = addLine(EMPTY_CART, cheap.id, 2);
    expect(subtotal(c)).toBe(cheap.price * 2);
  });

  it("charges shipping below the threshold and free above", () => {
    const below = addLine(EMPTY_CART, cheap.id, 1);
    expect(shippingFee(below)).toBe(550);

    const above = addLine(EMPTY_CART, pricey.id, 1);
    expect(shippingFee(above)).toBe(0);
    expect(grandTotal(above)).toBe(subtotal(above));
  });

  it("removes and updates quantity", () => {
    let c = addLine(EMPTY_CART, cheap.id, 3);
    c = setQty(c, cheap.id, 1);
    expect(totalCount(c)).toBe(1);
    c = setQty(c, cheap.id, 0); // 0以下は削除扱い
    expect(c.lines).toHaveLength(0);

    c = addLine(EMPTY_CART, cheap.id, 1);
    c = removeLine(c, cheap.id);
    expect(c.lines).toHaveLength(0);
  });

  it("keeps empty cart shipping at zero", () => {
    expect(shippingFee(EMPTY_CART)).toBe(0);
  });
});

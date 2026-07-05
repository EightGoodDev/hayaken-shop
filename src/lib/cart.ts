import { getProduct, type Product } from "./catalog";

export type CartLine = {
  id: string; // product id
  qty: number;
};

export type CartState = {
  lines: CartLine[];
};

export type CartLineDetail = {
  product: Product;
  qty: number;
  lineTotal: number;
};

export const EMPTY_CART: CartState = { lines: [] };

export function getProductName(id: string): string {
  return getProduct(id)?.name ?? "商品";
}

export function addLine(state: CartState, id: string, qty = 1): CartState {
  const existing = state.lines.find((l) => l.id === id);
  const lines = existing
    ? state.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
    : [...state.lines, { id, qty }];
  return { lines };
}

export function setQty(state: CartState, id: string, qty: number): CartState {
  if (qty <= 0) return removeLine(state, id);
  return { lines: state.lines.map((l) => (l.id === id ? { ...l, qty } : l)) };
}

export function removeLine(state: CartState, id: string): CartState {
  return { lines: state.lines.filter((l) => l.id !== id) };
}

export function totalCount(state: CartState): number {
  return state.lines.reduce((sum, l) => sum + l.qty, 0);
}

/** 商品情報を解決した明細（存在しない商品は除外） */
export function resolveLines(state: CartState): CartLineDetail[] {
  return state.lines
    .map((l) => {
      const product = getProduct(l.id);
      if (!product) return null;
      return { product, qty: l.qty, lineTotal: product.price * l.qty };
    })
    .filter((x): x is CartLineDetail => x !== null);
}

export function subtotal(state: CartState): number {
  return resolveLines(state).reduce((sum, l) => sum + l.lineTotal, 0);
}

/** 送料: 3,980円以上で無料、未満は550円 */
export const FREE_SHIPPING_THRESHOLD = 3980;
export const SHIPPING_FEE = 550;

/** 小計に対する送料（配送先ごとの計算に再利用） */
export function shippingForSubtotal(sub: number): number {
  if (sub <= 0) return 0;
  return sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function shippingFee(state: CartState): number {
  return shippingForSubtotal(subtotal(state));
}

export function grandTotal(state: CartState): number {
  return subtotal(state) + shippingFee(state);
}

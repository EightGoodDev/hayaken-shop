"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  addLine,
  EMPTY_CART,
  getProductName,
  removeLine,
  setQty,
  totalCount,
  type CartState,
} from "@/lib/cart";

const STORAGE_KEY = "kounan_cart_v1";
const COUPON_KEY = "kounan_coupon_v1";

type ToastMsg = { text: string; withLink?: boolean } | null;

type CartContextValue = {
  cart: CartState;
  count: number;
  add: (id: string, qty?: number) => void;
  setQuantity: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>(EMPTY_CART);
  const [couponCode, setCouponCodeState] = useState("");
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<ToastMsg>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初期ロード
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.lines)) setCart(parsed);
      }
      const coupon = localStorage.getItem(COUPON_KEY);
      if (coupon) setCouponCodeState(coupon);
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  // 永続化
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* noop */
    }
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(COUPON_KEY, couponCode);
    } catch {
      /* noop */
    }
  }, [couponCode, ready]);

  const setCouponCode = useCallback((code: string) => setCouponCodeState(code), []);

  const showToast = useCallback((msg: ToastMsg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback(
    (id: string, qty = 1) => {
      setCart((c) => addLine(c, id, qty));
      showToast({ text: `「${getProductName(id)}」をカートに追加しました`, withLink: true });
    },
    [showToast],
  );

  const setQuantity = useCallback((id: string, qty: number) => setCart((c) => setQty(c, id, qty)), []);
  const remove = useCallback((id: string) => setCart((c) => removeLine(c, id)), []);
  const clear = useCallback(() => {
    setCart(EMPTY_CART);
    setCouponCodeState("");
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({ cart, count: totalCount(cart), add, setQuantity, remove, clear, couponCode, setCouponCode, ready }),
    [cart, add, setQuantity, remove, clear, couponCode, setCouponCode, ready],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        <span>✓</span>
        <span>{toast?.text}</span>
        {toast?.withLink ? <a href="/cart">カートを見る</a> : null}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

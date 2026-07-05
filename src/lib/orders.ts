/** 注文履歴（localStorage永続化）。クライアントからのみ使用する。 */

import type { Address } from "./addresses";

export type OrderItem = {
  id: string;
  name: string;
  brand: string;
  qty: number;
  price: number;
};

/** 配送先ごとの内訳（複数配送先対応） */
export type OrderShipment = {
  address: Address;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
};

export type OrderRecord = {
  id: string; // 注文番号 KN-YYYYMMDD-XXXX
  createdAt: string; // ISO文字列
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon?: string;
  usedPoints: number;
  earnedPoints: number;
  total: number;
  payment: string;
  delivery: string;
  /** 複数配送先の内訳（単一配送先でも1件入る） */
  shipments?: OrderShipment[];
  /** お届け希望日（例: 9月20日(土)）。未指定は最短 */
  deliveryDate?: string;
  /** お届け時間帯 */
  timeSlot?: string;
  /** ギフト包装の有無 */
  gift?: boolean;
  /** ギフトメッセージ */
  giftMessage?: string;
  /** 注文ステータス（未設定は受付済み扱い） */
  status?: OrderStatus;
};

export type OrderStatus = "ordered" | "preparing" | "shipped" | "delivered" | "cancelled";

/** 進行フロー（キャンセルは含まない）。タイムラインの段階に対応 */
export const STATUS_FLOW: OrderStatus[] = ["ordered", "preparing", "shipped", "delivered"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  ordered: "ご注文受付",
  preparing: "発送準備中",
  shipped: "発送完了",
  delivered: "お届け完了",
  cancelled: "キャンセル済み",
};

export function orderStatus(o: OrderRecord): OrderStatus {
  return o.status ?? "ordered";
}

export function orderStatusLabel(o: OrderRecord): string {
  return STATUS_LABELS[orderStatus(o)];
}

export function statusLabel(s: OrderStatus): string {
  return STATUS_LABELS[s];
}

const STORAGE_KEY = "kounan_orders_v1";

export function loadOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: OrderRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = loadOrders();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...list].slice(0, 50)));
  } catch {
    /* noop */
  }
}

/** 既存の注文を更新（該当なしは何もしない） */
export function updateOrder(id: string, patch: Partial<OrderRecord>): OrderRecord[] {
  if (typeof window === "undefined") return [];
  const list = loadOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* noop */
  }
  return list;
}

const PAYMENT_LABELS: Record<string, string> = {
  card: "クレジットカード",
  cod: "代金引換",
  store: "店頭支払い",
};
const DELIVERY_LABELS: Record<string, string> = {
  home: "自宅へ配送",
  store: "店舗受取",
};

export function paymentLabel(key: string): string {
  return PAYMENT_LABELS[key] ?? key;
}
export function deliveryLabel(key: string): string {
  return DELIVERY_LABELS[key] ?? key;
}

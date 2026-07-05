"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useCoupons } from "@/components/coupons-provider";
import { usePoints } from "@/components/points-provider";
import { ProductImage } from "@/components/product-image";
import {
  resolveLines,
  shippingForSubtotal,
  subtotal,
  totalCount,
  type CartLineDetail,
} from "@/lib/cart";
import { validateCoupon } from "@/lib/coupons";
import { deliveryDateOptions, TIME_SLOTS, type DateOption } from "@/lib/delivery";
import {
  formatAddress,
  loadAddresses,
  nextAddressId,
  saveAddresses,
  type Address,
} from "@/lib/addresses";
import { saveOrder, type OrderRecord, type OrderShipment } from "@/lib/orders";
import { yen } from "@/lib/format";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 8,
  border: "1px solid var(--line-strong)",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "12px 0 6px" };

function orderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = String(Math.floor(1000 + (Date.now() % 9000)));
  return `KN-${ymd}-${rand}`;
}

type ShipGroup = { address: Address; lines: CartLineDetail[]; sub: number; ship: number };

export default function CheckoutPage() {
  const { cart, couponCode, clear, ready } = useCart();
  const { disabled } = useCoupons();
  const { balance, apply, ready: pointsReady } = usePoints();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrReady, setAddrReady] = useState(false);
  const [shipMode, setShipMode] = useState<"single" | "multi">("single");
  const [singleAddrId, setSingleAddrId] = useState("");
  const [assign, setAssign] = useState<Record<string, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "自宅", name: "", zip: "", address: "", tel: "" });

  const [payment, setPayment] = useState("card");
  const [usePointsFlag, setUsePointsFlag] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [gift, setGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  const lines = resolveLines(cart);
  const sub = subtotal(cart);

  // 住所録ロード・お届け日候補生成
  useEffect(() => {
    const list = loadAddresses();
    setAddresses(list);
    if (list.length > 0) setSingleAddrId(list[0].id);
    else setShowAddForm(true);
    setAddrReady(true);
    setDateOptions(deliveryDateOptions(new Date()));
  }, []);

  // 複数配送: 未割当の行を先頭住所へ初期化
  useEffect(() => {
    if (shipMode !== "multi" || addresses.length === 0) return;
    setAssign((prev) => {
      const next = { ...prev };
      for (const l of lines) {
        if (!next[l.product.id] || !addresses.some((a) => a.id === next[l.product.id])) {
          next[l.product.id] = addresses[0].id;
        }
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipMode, addresses.length]);

  const groups: ShipGroup[] = useMemo(() => {
    if (shipMode === "single") {
      const addr = addresses.find((a) => a.id === singleAddrId);
      return addr ? [{ address: addr, lines, sub, ship: shippingForSubtotal(sub) }] : [];
    }
    const map = new Map<string, CartLineDetail[]>();
    for (const l of lines) {
      const aid = assign[l.product.id];
      if (!aid || !addresses.some((a) => a.id === aid)) continue;
      if (!map.has(aid)) map.set(aid, []);
      map.get(aid)!.push(l);
    }
    return [...map.entries()].map(([aid, ls]) => {
      const addr = addresses.find((a) => a.id === aid)!;
      const gsub = ls.reduce((s, l) => s + l.lineTotal, 0);
      return { address: addr, lines: ls, sub: gsub, ship: shippingForSubtotal(gsub) };
    });
  }, [shipMode, addresses, singleAddrId, assign, lines, sub]);

  const ship = groups.reduce((s, g) => s + g.ship, 0);
  const couponResult = couponCode ? validateCoupon(couponCode, sub, disabled) : null;
  const discount = couponResult?.ok ? couponResult.discount : 0;
  const beforePoints = Math.max(0, sub + ship - discount);
  const usedPoints = usePointsFlag ? Math.min(balance, beforePoints) : 0;
  const total = beforePoints - usedPoints;
  const earnedPoints = Math.floor(total / 100);

  const addressReady =
    shipMode === "single"
      ? addresses.some((a) => a.id === singleAddrId)
      : lines.length > 0 && lines.every((l) => addresses.some((a) => a.id === assign[l.product.id]));
  const canSubmit = lines.length > 0 && addressReady && !submitting;

  function commitNewAddress(): Address | null {
    if (!newAddr.name.trim() || !newAddr.zip.trim() || !newAddr.address.trim()) return null;
    const addr: Address = {
      id: nextAddressId(addresses),
      label: newAddr.label.trim() || "お届け先",
      name: newAddr.name.trim(),
      zip: newAddr.zip.trim(),
      address: newAddr.address.trim(),
      tel: newAddr.tel.trim(),
    };
    const list = [...addresses, addr];
    setAddresses(list);
    saveAddresses(list);
    setSingleAddrId(addr.id);
    setShowAddForm(false);
    setNewAddr({ label: "自宅", name: "", zip: "", address: "", tel: "" });
    return addr;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    const order = orderNumber();
    const items = totalCount(cart);
    const shipments: OrderShipment[] = groups.map((g) => ({
      address: g.address,
      items: g.lines.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        qty,
        price: product.price,
      })),
      subtotal: g.sub,
      shipping: g.ship,
    }));
    const record: OrderRecord = {
      id: order,
      createdAt: new Date().toISOString(),
      items: lines.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        qty,
        price: product.price,
      })),
      itemCount: items,
      subtotal: sub,
      shipping: ship,
      discount,
      coupon: discount > 0 ? couponCode : undefined,
      usedPoints,
      earnedPoints,
      total,
      payment,
      delivery: shipMode === "multi" && groups.length > 1 ? "複数のお届け先" : "自宅へ配送",
      shipments,
      deliveryDate: deliveryDate || undefined,
      timeSlot: timeSlot || undefined,
      gift: gift || undefined,
      giftMessage: gift && giftMessage.trim() ? giftMessage.trim() : undefined,
    };
    saveOrder(record);
    apply(earnedPoints, usedPoints);
    clear();
    router.push(`/checkout/complete?order=${order}&total=${total}&items=${items}&earned=${earnedPoints}&used=${usedPoints}`);
  }

  if (!ready || !addrReady) {
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
          <div className="e" aria-hidden>🧾</div>
          <h3>カートが空のため、お手続きに進めません</h3>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            買い物を続ける
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <Link href="/cart">カート</Link>
        <span>›</span>
        <span>ご注文手続き</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>ご注文手続き</h2>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", marginTop: -8 }}>
        ※ デモサイトのため、実際の決済・配送は行われません。
      </p>

      <form className="cart-layout" onSubmit={submit}>
        <div>
          {/* お届け先 */}
          <section className="co-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>お届け先</h3>
              {addresses.length > 0 ? (
                <div className="ship-mode">
                  <button type="button" className={shipMode === "single" ? "on" : ""} onClick={() => setShipMode("single")}>
                    1か所に配送
                  </button>
                  <button type="button" className={shipMode === "multi" ? "on" : ""} onClick={() => setShipMode("multi")}>
                    複数のお届け先に分ける
                  </button>
                </div>
              ) : null}
            </div>

            {/* 単一配送: 住所選択 */}
            {shipMode === "single" && addresses.length > 0 ? (
              <div style={{ marginTop: 12 }}>
                {addresses.map((a) => (
                  <label key={a.id} style={radioRow(singleAddrId === a.id)}>
                    <input type="radio" name="single" checked={singleAddrId === a.id} onChange={() => setSingleAddrId(a.id)} />
                    <span>
                      <b>
                        <span className="addr-label">{a.label}</span> {a.name}
                      </b>
                      <span style={{ display: "block", fontSize: 12, color: "var(--muted)" }}>
                        {formatAddress(a)}
                        {a.tel ? ` ／ ${a.tel}` : ""}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : null}

            {/* 複数配送: 商品ごとに配送先を割当 */}
            {shipMode === "multi" && addresses.length > 0 ? (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
                  商品ごとにお届け先を選べます。お届け先ごとに送料を計算します。
                </p>
                {lines.map(({ product, qty }) => (
                  <div key={product.id} className="assign-row">
                    <span className="assign-thumb">
                      <ProductImage product={product} />
                    </span>
                    <span className="assign-name">
                      {product.name}
                      <span style={{ color: "var(--muted)" }}> ×{qty}</span>
                    </span>
                    <select
                      className="assign-select"
                      value={assign[product.id] ?? ""}
                      onChange={(e) => setAssign((p) => ({ ...p, [product.id]: e.target.value }))}
                    >
                      {addresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}（{a.name}）
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : null}

            {/* 住所追加フォーム */}
            {showAddForm || addresses.length === 0 ? (
              <div className="add-addr" style={{ marginTop: 14 }}>
                <b style={{ fontSize: 14 }}>{addresses.length === 0 ? "お届け先を登録" : "お届け先を追加"}</b>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>ラベル</label>
                    <input style={inputStyle} value={newAddr.label} onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))} placeholder="自宅 / 実家 / 会社" />
                  </div>
                  <div>
                    <label style={labelStyle}>お名前 *</label>
                    <input style={inputStyle} value={newAddr.name} onChange={(e) => setNewAddr((a) => ({ ...a, name: e.target.value }))} placeholder="紺南 太郎" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>郵便番号 *</label>
                    <input style={inputStyle} value={newAddr.zip} onChange={(e) => setNewAddr((a) => ({ ...a, zip: e.target.value }))} placeholder="000-0000" />
                  </div>
                  <div>
                    <label style={labelStyle}>電話番号</label>
                    <input style={inputStyle} value={newAddr.tel} onChange={(e) => setNewAddr((a) => ({ ...a, tel: e.target.value }))} placeholder="090-0000-0000" />
                  </div>
                </div>
                <label style={labelStyle}>ご住所 *</label>
                <input style={inputStyle} value={newAddr.address} onChange={(e) => setNewAddr((a) => ({ ...a, address: e.target.value }))} placeholder="大阪府大阪市○○区○○ 1-2-3" />
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button type="button" className="btn btn-primary" style={{ padding: "9px 18px", fontSize: 14 }} onClick={commitNewAddress}>
                    このお届け先を保存
                  </button>
                  {addresses.length > 0 ? (
                    <button type="button" className="btn btn-ghost" style={{ padding: "9px 18px", fontSize: 14 }} onClick={() => setShowAddForm(false)}>
                      キャンセル
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-ghost" style={{ marginTop: 12, padding: "9px 18px", fontSize: 13 }} onClick={() => setShowAddForm(true)}>
                ＋ 別のお届け先を追加
              </button>
            )}
          </section>

          {/* お届け日時・ギフト */}
          <section className="co-card" style={{ marginTop: 16 }}>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>お届け日時</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>お届け希望日</label>
                <select
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{ ...inputStyle, appearance: "auto" }}
                >
                  {dateOptions.map((o) => (
                    <option key={o.value || "asap"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>時間帯</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{ ...inputStyle, appearance: "auto" }}
                >
                  {TIME_SLOTS.map((o) => (
                    <option key={o.value || "any"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: 16 }}>ギフト設定</h3>
            <label style={radioRow(gift)}>
              <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} />
              <span>
                <b>ギフト包装（無料）</b>
                <span style={{ display: "block", fontSize: 12, color: "var(--muted)" }}>のし・ラッピングを承ります</span>
              </span>
            </label>
            {gift ? (
              <div style={{ marginTop: 8 }}>
                <label style={labelStyle}>メッセージカード（任意・50字まで）</label>
                <textarea
                  value={giftMessage}
                  maxLength={50}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="お誕生日おめでとうございます 等"
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            ) : null}
          </section>

          {/* お支払い・ポイント */}
          <section className="co-card" style={{ marginTop: 16 }}>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>お支払い方法</h3>
            {[
              { v: "card", label: "クレジットカード" },
              { v: "cod", label: "代金引換" },
              { v: "store", label: "店頭支払い" },
            ].map((o) => (
              <label key={o.v} style={radioRow(payment === o.v)}>
                <input type="radio" name="payment" checked={payment === o.v} onChange={() => setPayment(o.v)} />
                <b>{o.label}</b>
              </label>
            ))}

            {pointsReady && balance > 0 ? (
              <>
                <h3 style={{ fontSize: 16 }}>ポイント利用</h3>
                <label style={radioRow(usePointsFlag)}>
                  <input type="checkbox" checked={usePointsFlag} onChange={(e) => setUsePointsFlag(e.target.checked)} />
                  <span>
                    <b>保有ポイントを使う</b>
                    <span style={{ display: "block", fontSize: 12, color: "var(--muted)" }}>
                      保有 {balance.toLocaleString("ja-JP")} pt ／ このご注文で {Math.min(balance, beforePoints).toLocaleString("ja-JP")} pt まで利用可能
                    </span>
                  </span>
                </label>
              </>
            ) : null}
          </section>
        </div>

        <aside className="summary">
          <h3>ご注文サマリー</h3>

          {/* 配送先ごとの内訳 */}
          {groups.length > 0 ? (
            <div style={{ margin: "6px 0 14px", display: "flex", flexDirection: "column", gap: 12 }}>
              {groups.map((g, i) => (
                <div key={g.address.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
                  {groups.length > 1 ? (
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                      お届け先{i + 1}：<span className="addr-label">{g.address.label}</span> {g.address.name}
                    </div>
                  ) : null}
                  {g.lines.map(({ product, qty, lineTotal }) => (
                    <div key={product.id} style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 8, alignItems: "center", padding: "3px 0" }}>
                      <div style={{ width: 34 }}>
                        <ProductImage product={product} />
                      </div>
                      <span style={{ fontSize: 11.5, lineHeight: 1.35 }}>
                        {product.name}
                        <span style={{ color: "var(--muted)" }}> ×{qty}</span>
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap" }}>{yen(lineTotal)}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "right", marginTop: 4 }}>
                    送料 {g.ship === 0 ? "無料" : yen(g.ship)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "var(--accent-dark)" }}>お届け先を選択してください</p>
          )}

          <div className="summary-row">
            <span>小計</span>
            <span>{yen(sub)}</span>
          </div>
          <div className="summary-row">
            <span>送料{groups.length > 1 ? `（${groups.length}件）` : ""}</span>
            <span>{ship === 0 ? "無料" : yen(ship)}</span>
          </div>
          {discount > 0 ? (
            <div className="summary-row" style={{ color: "var(--accent-dark)" }}>
              <span>クーポン（{couponCode}）</span>
              <span>−{yen(discount)}</span>
            </div>
          ) : null}
          {usedPoints > 0 ? (
            <div className="summary-row" style={{ color: "var(--accent-dark)" }}>
              <span>ポイント利用</span>
              <span>−{yen(usedPoints)}</span>
            </div>
          ) : null}
          <div className="summary-row total">
            <span>合計</span>
            <span className="accent">{yen(total)}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right", marginTop: 4 }}>
            {earnedPoints.toLocaleString("ja-JP")} ポイント獲得予定
          </div>
          {deliveryDate || timeSlot || gift ? (
            <div style={{ fontSize: 12, color: "var(--ink-soft)", background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px", marginTop: 10 }}>
              {deliveryDate ? <div>🗓️ {deliveryDate}{timeSlot ? `／${timeSlot}` : ""}</div> : timeSlot ? <div>🗓️ {timeSlot}</div> : null}
              {gift ? <div>🎁 ギフト包装あり</div> : null}
            </div>
          ) : null}
          <button type="submit" className="btn btn-accent btn-block" style={{ marginTop: 14 }} disabled={!canSubmit}>
            {submitting ? "処理中…" : "注文を確定する"}
          </button>
          {!addressReady ? (
            <div style={{ fontSize: 11.5, color: "var(--accent-dark)", textAlign: "center", marginTop: 8 }}>
              すべての商品にお届け先を設定してください
            </div>
          ) : null}
          <Link href="/cart" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
            カートに戻る
          </Link>
        </aside>
      </form>
    </div>
  );
}

function radioRow(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: `1px solid ${active ? "var(--brand)" : "var(--line-strong)"}`,
    background: active ? "var(--brand-light)" : "#fff",
    borderRadius: 8,
    padding: "12px 14px",
    marginBottom: 8,
    cursor: "pointer",
    fontSize: 14,
  };
}

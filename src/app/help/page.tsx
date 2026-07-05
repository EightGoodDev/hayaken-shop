import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ご利用ガイド" };

const FAQ = [
  { q: "送料はいくらですか？", a: "全国一律550円（税込）です。3,980円以上のご購入で送料無料になります。" },
  { q: "店舗受取はできますか？", a: "対象商品はお近くの店舗でお受け取りいただけます。在庫がある場合は当日お渡しも可能です。" },
  { q: "支払い方法は？", a: "クレジットカード・代金引換・店頭支払いに対応（本デモでは決済は動作しません）。" },
  { q: "返品・交換について", a: "商品到着後30日以内であれば、未使用品の返品・交換を承ります。" },
  { q: "ポイントは貯まりますか？", a: "ご購入金額100円ごとに1ポイント貯まり、次回以降のお買い物にご利用いただけます。" },
];

export default function HelpPage() {
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>ご利用ガイド</span>
      </nav>
      <h1 style={{ fontSize: 24 }}>ご利用ガイド・よくあるご質問</h1>

      <div className="doc-cards" style={{ marginTop: 16, marginBottom: 8 }}>
        <Link href="/guide/shipping" className="doc-card">
          <b>🚚 配送・送料について</b>
          <span>送料・お届け日数・店舗受取</span>
        </Link>
        <Link href="/guide/returns" className="doc-card">
          <b>↩️ 返品・交換について</b>
          <span>条件・手順・返金</span>
        </Link>
        <Link href="/stores" className="doc-card">
          <b>🏬 店舗検索・店舗受取</b>
          <span>お近くの店舗を探す</span>
        </Link>
        <Link href="/contact" className="doc-card">
          <b>✉️ お問い合わせ</b>
          <span>解決しない場合はこちら</span>
        </Link>
      </div>

      <h2 style={{ fontSize: 18, marginTop: 24 }}>よくあるご質問</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
        {FAQ.map((f) => (
          <div
            key={f.q}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: "16px 18px",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Q. {f.q}</div>
            <div style={{ color: "var(--ink-soft)", fontSize: 14 }}>A. {f.a}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 24, fontSize: 13, color: "var(--muted)" }}>
        ※ 本サイトはホームセンター通販を参考に制作したデモです。実際の取引・決済・配送は行われません。
      </p>
    </div>
  );
}

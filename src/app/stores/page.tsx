import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "店舗検索" };

const STORES = [
  { name: "ハヤケン 大阪本店", area: "大阪府大阪市", hours: "9:00-21:00", tel: "06-0000-0000" },
  { name: "ハヤケン 堺インター店", area: "大阪府堺市", hours: "8:00-21:00", tel: "072-000-0000" },
  { name: "ハヤケン 神戸ハーバー店", area: "兵庫県神戸市", hours: "9:00-20:00", tel: "078-000-0000" },
  { name: "ハヤケン 京都伏見店", area: "京都府京都市", hours: "9:00-21:00", tel: "075-000-0000" },
  { name: "ハヤケン 名古屋みなと店", area: "愛知県名古屋市", hours: "9:00-20:00", tel: "052-000-0000" },
  { name: "ハヤケン 横浜金沢店", area: "神奈川県横浜市", hours: "9:00-21:00", tel: "045-000-0000" },
];

export default function StoresPage() {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>店舗検索</span>
      </nav>
      <h1 style={{ fontSize: 24 }}>店舗検索・店舗受取</h1>
      <p style={{ color: "var(--ink-soft)" }}>ネットで注文して、お近くの店舗で受け取れます（デモ）。</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        {STORES.map((s) => (
          <div
            key={s.name}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>🏬 {s.name}</div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.9 }}>
              {s.area}
              <br />
              営業時間 {s.hours}
              <br />
              TEL {s.tel}
            </div>
            <span className="pill" style={{ marginTop: 10 }}>店舗受取OK</span>
          </div>
        ))}
      </div>
    </div>
  );
}

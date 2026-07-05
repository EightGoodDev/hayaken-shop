import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty">
        <div className="e" aria-hidden>🧭</div>
        <h3>ページが見つかりませんでした</h3>
        <p>お探しのページは移動または削除された可能性があります。</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
          <Link href="/" className="btn btn-primary">
            トップに戻る
          </Link>
          <Link href="/search" className="btn btn-ghost">
            商品を検索
          </Link>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>カテゴリから探す</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="pill">
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

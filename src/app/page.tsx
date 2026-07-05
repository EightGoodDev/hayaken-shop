import Link from "next/link";
import { CATEGORIES, newProducts, rankingProducts, saleProducts } from "@/lib/catalog";
import { FeatureCards } from "@/components/feature-cards";
import { HeroSlider } from "@/components/hero-slider";
import { ProductGrid } from "@/components/product-card";
import { RecommendedForYou } from "@/components/recommended";
import { RecentlyViewed } from "@/components/recently-viewed";

export default function HomePage() {
  const ranking = rankingProducts(5);
  const sale = saleProducts(5);
  const fresh = newProducts(5);

  const promos = [
    { title: "夏のDIYフェア", sub: "対象の電動工具が最大25%OFF", bg: "linear-gradient(135deg,#e8631a,#cf5a2a)", href: "/features/diy-fair" },
    { title: "園芸シーズン応援", sub: "培養土・肥料まとめ買いでお得", bg: "linear-gradient(135deg,#5f8a6b,#4f7a5b)", href: "/features/garden" },
    { title: "防災の備え特集", sub: "いざという時のために今できること", bg: "linear-gradient(135deg,#5a7a97,#4a6784)", href: "/features/bousai" },
    { title: "会員ポイント2倍", sub: "毎月5日・15日・25日はポイントデー", bg: "linear-gradient(135deg,#7b6f92,#655a7a)", href: "/coupons" },
  ];

  return (
    <div className="container">
      {/* Hero slider */}
      <HeroSlider />

      {/* Promo strip */}
      <div className="promo-strip">
        {promos.map((p) => (
          <Link className="promo" key={p.title} href={p.href} style={{ background: p.bg }}>
            <b>{p.title}</b>
            <span>{p.sub}</span>
          </Link>
        ))}
      </div>

      {/* Categories */}
      <section className="section">
        <div className="section-head">
          <h2>カテゴリから探す</h2>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link href={`/category/${c.slug}`} className="cat-tile" key={c.slug}>
              <span className="e" aria-hidden>{c.emoji}</span>
              <b>{c.name}</b>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-head">
          <h2>特集・キャンペーン</h2>
        </div>
        <FeatureCards />
      </section>

      {/* Ranking */}
      <section className="section">
        <div className="section-head">
          <h2>🏆 売れ筋ランキング</h2>
          <Link href="/category/tools" className="more">もっと見る →</Link>
        </div>
        <ProductGrid products={ranking} dense />
      </section>

      {/* Sale */}
      <section className="section">
        <div className="section-head">
          <h2>🔥 タイムセール・お買い得</h2>
          <Link href="/sale" className="more">セール一覧 →</Link>
        </div>
        <ProductGrid products={sale} dense />
      </section>

      {/* New */}
      <section className="section">
        <div className="section-head">
          <h2>✨ 新着商品</h2>
        </div>
        <ProductGrid products={fresh} dense />
      </section>

      {/* Recommended for you */}
      <RecommendedForYou />

      {/* Recently viewed */}
      <RecentlyViewed />
    </div>
  );
}

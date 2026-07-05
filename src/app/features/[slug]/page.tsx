import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FEATURES, featureProducts, getFeature } from "@/lib/features";
import { PagedGrid } from "@/components/paged-grid";

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = getFeature(slug);
  return { title: f ? f.title : "特集" };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const products = featureProducts(feature);

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>特集</span>
        <span>›</span>
        <span>{feature.title}</span>
      </nav>

      <section className="feature-hero" style={{ background: feature.bg }}>
        <span className="pill" style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
          特集
        </span>
        <h1>{feature.title}</h1>
        <p className="feature-sub">{feature.subtitle}</p>
        <p className="feature-lead">{feature.lead}</p>
      </section>

      <div className="section-head" style={{ marginTop: 24 }}>
        <h2>対象商品</h2>
        <span className="result-count">{products.length}件</span>
      </div>

      {products.length > 0 ? (
        <PagedGrid products={products} />
      ) : (
        <div className="empty">
          <div className="e" aria-hidden>📭</div>
          <h3>対象商品は準備中です</h3>
        </div>
      )}

      <div className="section" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {FEATURES.filter((f) => f.slug !== slug).map((f) => (
            <Link key={f.slug} href={`/features/${f.slug}`} className="pill">
              {f.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

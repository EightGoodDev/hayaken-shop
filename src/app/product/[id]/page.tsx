import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getProduct, PRODUCTS, relatedProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import { yen } from "@/lib/format";
import { ProductImage } from "@/components/product-image";
import { ProductGrid } from "@/components/product-card";
import { Stars } from "@/components/stars";
import { PdpBuyPanel } from "@/components/pdp-buy-panel";
import { Reviews } from "@/components/reviews";
import { ProductTabs } from "@/components/product-tabs";
import { RecentlyViewed, RecordRecentView } from "@/components/recently-viewed";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "商品" };
  const desc = `${product.brand} ${product.name} ｜ ${yen(product.price)}（税込）。${product.description}`.slice(0, 120);
  return {
    title: product.name,
    description: desc,
    openGraph: { title: product.name, description: desc, type: "website" },
    alternates: { canonical: `/product/${product.id}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const cat = getCategory(product.category);
  const related = relatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id.toUpperCase(),
    brand: { "@type": "Brand", name: product.brand },
    category: cat?.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "JPY",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "トップ", item: `${SITE_URL}/` },
      ...(cat
        ? [
            { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE_URL}/category/${cat.slug}` },
            {
              "@type": "ListItem",
              position: 3,
              name: product.sub,
              item: `${SITE_URL}/category/${cat.slug}?sub=${encodeURIComponent(product.sub)}`,
            },
            { "@type": "ListItem", position: 4, name: product.name, item: `${SITE_URL}/product/${product.id}` },
          ]
        : [{ "@type": "ListItem", position: 2, name: product.name, item: `${SITE_URL}/product/${product.id}` }]),
    ],
  };

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <RecordRecentView id={product.id} />
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        {cat ? (
          <>
            <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
            <span>›</span>
            <Link href={`/category/${cat.slug}?sub=${encodeURIComponent(product.sub)}`}>{product.sub}</Link>
            <span>›</span>
          </>
        ) : null}
        <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp-media">
          <ProductImage product={product} />
        </div>

        <div>
          <div className="brand-line">{product.brand}</div>
          <h1>{product.name}</h1>
          <Stars rating={product.rating} reviews={product.reviews} />

          <PdpBuyPanel product={product} />
        </div>
      </div>

      <ProductTabs
        description={product.description}
        specs={[
          `ブランド: ${product.brand}`,
          `カテゴリ: ${cat?.name ?? "-"}`,
          `サブカテゴリ: ${product.sub}`,
          `商品コード: ${product.id.toUpperCase()}`,
          ...product.specs,
        ]}
        reviewCount={product.reviews}
        reviews={<Reviews product={product} bare />}
      />

      {related.length > 0 ? (
        <section className="section">
          <div className="section-head">
            <h2>関連商品</h2>
            {cat ? <Link href={`/category/${cat.slug}`} className="more">同じカテゴリを見る →</Link> : null}
          </div>
          <ProductGrid products={related} />
        </section>
      ) : null}

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}

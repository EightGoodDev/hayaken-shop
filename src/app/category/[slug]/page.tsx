import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategory, productsByCategory } from "@/lib/catalog";
import { CategoryBrowser } from "@/components/category-browser";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  return { title: cat ? cat.name : "カテゴリ" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const products = productsByCategory(slug);
  const validSub = sub && products.some((p) => p.sub === sub) ? sub : undefined;

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        {validSub ? (
          <>
            <Link href={`/category/${slug}`}>{cat.name}</Link>
            <span>›</span>
            <span>{validSub}</span>
          </>
        ) : (
          <span>{cat.name}</span>
        )}
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>
          <span aria-hidden style={{ marginRight: 2 }}>{cat.emoji}</span>
          {cat.name}
        </h2>
        <span className="result-count">全{products.length}件</span>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: -6 }}>{cat.blurb}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0 20px" }}>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="pill"
            style={c.slug === slug ? { background: "var(--brand)", color: "#fff" } : undefined}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <CategoryBrowser products={products} initialSub={validSub} />
    </div>
  );
}

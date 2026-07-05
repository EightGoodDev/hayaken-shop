import { getCategory, type Product } from "@/lib/catalog";

/**
 * 実画像の代わりにカテゴリカラー＋絵文字で生成するプレースホルダ画像。
 * 外部アセット不要で、商品ごとに安定した見た目になる。
 */
export function ProductImage({ product, className }: { product: Product; className?: string }) {
  const cat = getCategory(product.category);
  const color = cat?.color ?? "#e8631a";
  const emoji = cat?.emoji ?? "📦";
  // 商品idから決定的にわずかな傾きを付ける
  const seed = product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tilt = (seed % 6) - 3;

  return (
    <svg viewBox="0 0 300 300" className={className ?? "thumb-svg"} role="img" aria-label={product.name}>
      <defs>
        <linearGradient id={`g-${product.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="1" stopColor="#eceef2" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill={`url(#g-${product.id})`} />
      {/* カテゴリ色はごく控えめなアクセントのみ */}
      <rect x="0" y="0" width="300" height="4" fill={color} opacity="0.5" />
      <circle cx="150" cy="128" r="78" fill="#ffffff" stroke="#e7e9ee" strokeWidth="1" />
      <text
        x="150"
        y="128"
        fontSize="82"
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(${tilt} 150 128)`}
      >
        {emoji}
      </text>
      <text x="150" y="246" fontSize="14" fontWeight="700" textAnchor="middle" dominantBaseline="central" fill="#8a93a2">
        {product.brand}
      </text>
    </svg>
  );
}

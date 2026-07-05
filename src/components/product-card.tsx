"use client";

import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { originalPrice } from "@/lib/format";
import { ProductImage } from "./product-image";
import { Stars } from "./stars";
import { CardCartButton } from "./add-to-cart-button";
import { FavButton } from "./fav-button";
import { CompareToggle } from "./compare-toggle";
import { Price } from "./price-provider";
import { useOverrides } from "./overrides-provider";

export function ProductCard({ product }: { product: Product }) {
  const { stockOf, priceOf, ready } = useOverrides();
  // ready前は静的値でSSRと一致させ、ハイドレーション不整合を防ぐ
  const stock = ready ? stockOf(product) : product.stock;
  const price = ready ? priceOf(product) : product.price;
  const was = product.off > 0 ? originalPrice(price, product.off) : null;

  return (
    <div className="card">
      <Link href={`/product/${product.id}`} className="card-thumb">
        <ProductImage product={product} />
        {stock === 0 ? <span className="soldout-overlay">在庫切れ</span> : null}
        <span className="card-flags">
          {product.rank !== undefined && product.rank <= 5 ? <span className="flag rank">ランキング{product.rank}位</span> : null}
          {product.off > 0 ? <span className="flag sale">{product.off}%OFF</span> : null}
          {product.isNew ? <span className="flag new">NEW</span> : null}
        </span>
        <FavButton id={product.id} />
      </Link>
      <div className="card-body">
        <div className="card-brand">{product.brand}</div>
        <Link href={`/product/${product.id}`}>
          <div className="card-name">{product.name}</div>
        </Link>
        <Stars rating={product.rating} reviews={product.reviews} />
        <div className="price-row">
          <Price value={price} className="price" />
          {was ? <Price value={was} className="price-was" label={false} /> : null}
          {product.off > 0 ? <span className="off-tag">{product.off}%OFF</span> : null}
        </div>
        {stock > 0 && stock <= 5 ? (
          <div className="stock-hint low">残り{stock}点</div>
        ) : stock === 0 ? (
          <div className="stock-hint out">在庫切れ・入荷予定</div>
        ) : null}
        <CardCartButton id={product.id} soldOut={stock === 0} />
        <div style={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
          <CompareToggle id={product.id} />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, dense }: { products: Product[]; dense?: boolean }) {
  return (
    <div className={`product-grid ${dense ? "dense" : ""}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

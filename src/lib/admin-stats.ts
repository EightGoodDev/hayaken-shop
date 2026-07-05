import { CATEGORIES, PRODUCTS } from "./catalog";
import { effectivePrice, effectiveStock, type Overrides } from "./overrides";

/** 商品カタログから算出する在庫・商品の統計（在庫/価格の上書きを反映） */
export function catalogStats(ov: Overrides = {}) {
  const total = PRODUCTS.length;
  const stock = (p: (typeof PRODUCTS)[number]) => effectiveStock(p, ov);
  const price = (p: (typeof PRODUCTS)[number]) => effectivePrice(p, ov);
  const outOfStock = PRODUCTS.filter((p) => stock(p) === 0).length;
  const lowStock = PRODUCTS.filter((p) => stock(p) > 0 && stock(p) <= 5).length;
  const onSale = PRODUCTS.filter((p) => p.off > 0).length;
  const inventoryValue = PRODUCTS.reduce((s, p) => s + price(p) * stock(p), 0);
  const avgRating = total > 0 ? PRODUCTS.reduce((s, p) => s + p.rating, 0) / total : 0;
  return {
    total,
    categories: CATEGORIES.length,
    outOfStock,
    lowStock,
    onSale,
    inventoryValue,
    avgRating,
  };
}

export function lowStockProducts(ov: Overrides = {}) {
  return PRODUCTS.filter((p) => effectiveStock(p, ov) <= 5).sort((a, b) => effectiveStock(a, ov) - effectiveStock(b, ov));
}

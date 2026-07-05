import { PRODUCTS, searchProducts, type Product } from "./catalog";

export type Feature = {
  slug: string;
  title: string;
  subtitle: string;
  lead: string;
  bg: string;
  select: (all: Product[]) => Product[];
};

export const FEATURES: Feature[] = [
  {
    slug: "diy-fair",
    title: "夏のDIYフェア",
    subtitle: "対象の電動工具・作業用品が最大25%OFF",
    lead: "この夏のものづくりを応援。人気の電動工具から作業用品まで、お買い得価格でそろえよう。",
    bg: "linear-gradient(135deg,#e8631a,#cf5a2a)",
    select: (all) => all.filter((p) => (p.category === "tools" || p.category === "safety") && (p.off > 0 || p.rank !== undefined)),
  },
  {
    slug: "garden",
    title: "園芸シーズン応援",
    subtitle: "培養土・肥料・園芸道具をまとめてお得に",
    lead: "植え付けシーズン到来。土づくりから道具まで、ガーデニングに必要なものを一挙にご紹介。",
    bg: "linear-gradient(135deg,#5f8a6b,#4f7a5b)",
    select: (all) => all.filter((p) => p.category === "garden"),
  },
  {
    slug: "bousai",
    title: "防災の備え特集",
    subtitle: "いざという時のために、今できること",
    lead: "災害への備えは日頃から。非常用の水・食料・ライト・簡易トイレなど、備えておきたい品を集めました。",
    bg: "linear-gradient(135deg,#5a7a97,#4a6784)",
    select: () => [
      ...searchProducts("防災"),
      ...searchProducts("ランタン"),
      ...searchProducts("ポリタンク"),
      ...searchProducts("簡易トイレ"),
      ...searchProducts("乾電池"),
      ...searchProducts("モバイルバッテリー"),
    ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i),
  },
  {
    slug: "new",
    title: "新着アイテム",
    subtitle: "続々入荷。今きてる新商品をチェック",
    lead: "新しく入荷した注目のアイテムをまとめてご紹介します。",
    bg: "linear-gradient(135deg,#7b6f92,#655a7a)",
    select: (all) => all.filter((p) => p.isNew),
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export function featureProducts(feature: Feature): Product[] {
  return feature.select(PRODUCTS);
}

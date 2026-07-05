import type { Product } from "./catalog";

export type Review = {
  author: string;
  stars: number;
  date: string;
  title: string;
  body: string;
  helpful: number;
};

const AUTHORS = [
  "DIY好き",
  "週末大工",
  "ガーデナーT",
  "現場監督K",
  "はじめての一人暮らし",
  "リピーターM",
  "節約ママ",
  "工具コレクター",
  "田舎暮らし",
  "整理収納アドバイザー",
];

const TITLES_HIGH = ["買ってよかった", "期待以上でした", "コスパ最高", "リピート確定", "しっかりした作り"];
const TITLES_MID = ["価格相応かな", "概ね満足", "普通に使えます", "悪くないです"];
const TITLES_LOW = ["少し残念", "人を選ぶかも", "好みが分かれそう"];

const BODIES_HIGH = [
  "思っていたよりも作りがしっかりしていて満足です。この価格でこの品質なら文句なし。また利用します。",
  "届いてすぐ使いましたが、扱いやすく初心者でも問題なく使えました。買って正解でした。",
  "何度もリピートしています。安定した品質で安心して使えるのが良いですね。",
  "配送も早く、梱包も丁寧でした。商品自体も期待以上でおすすめできます。",
];
const BODIES_MID = [
  "価格を考えれば十分だと思います。特別すごいわけではないですが、必要十分でした。",
  "普段使いには問題ありません。こだわる方には物足りないかもしれませんが、私は満足です。",
  "可もなく不可もなく。用途がはっきりしているなら良い選択だと思います。",
];
const BODIES_LOW = [
  "用途によっては少し力不足に感じました。軽い作業向きだと思います。",
  "悪くはないのですが、もう少し頑丈だと嬉しかったです。価格なりといったところ。",
];

/** 商品idから決定的に整数を生成（SSR/CSRで同じ結果） */
function hash(str: string, salt: number): number {
  let h = salt;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** 商品の評価に応じた口コミを決定的に生成する */
export function generateReviews(product: Product): Review {
  return generateReviewList(product, 4)[0];
}

export function generateReviewList(product: Product, count = 4): Review[] {
  const reviews: Review[] = [];
  const baseYear = 2026;
  for (let i = 0; i < count; i++) {
    const s = hash(product.id, i + 1);
    // 商品評価を中心に ±1 で分布させる
    const delta = (s % 3) - 1;
    const stars = Math.max(2, Math.min(5, Math.round(product.rating) + delta));
    const titles = stars >= 5 ? TITLES_HIGH : stars >= 4 ? TITLES_MID : TITLES_LOW;
    const bodies = stars >= 5 ? BODIES_HIGH : stars >= 4 ? BODIES_MID : BODIES_LOW;
    const month = ((s >> 3) % 12) + 1;
    const day = ((s >> 6) % 27) + 1;
    reviews.push({
      author: pick(AUTHORS, s),
      stars,
      date: `${baseYear}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
      title: pick(titles, s >> 2),
      body: pick(bodies, s >> 4),
      helpful: (s >> 5) % 40,
    });
  }
  return reviews;
}

/** 評価分布（★5〜★1の件数）をレビュー総数から近似生成 */
export function ratingDistribution(product: Product): number[] {
  const total = product.reviews;
  const r = product.rating;
  // 平均に近い星に重みを置いた擬似分布
  const weights = [5, 4, 3, 2, 1].map((star) => 1 / (1 + Math.abs(star - r) * 1.8));
  const sum = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.round((w / sum) * total));
  // 合計を total に合わせて調整
  const diff = total - counts.reduce((a, b) => a + b, 0);
  counts[0] += diff;
  return counts; // [★5, ★4, ★3, ★2, ★1]
}

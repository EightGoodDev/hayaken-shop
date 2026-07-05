/** 価格表示（税込・円） */
export function yen(value: number): string {
  return `¥${value.toLocaleString("ja-JP")}`;
}

/** 税抜価格から税込を計算（消費税10%・端数切り捨て） */
export function withTax(exclusive: number, rate = 0.1): number {
  return Math.floor(exclusive * (1 + rate));
}

/** セール前価格（割引率から逆算） */
export function originalPrice(price: number, offPercent: number): number {
  return Math.round(price / (1 - offPercent / 100));
}

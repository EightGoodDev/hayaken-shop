const WEEKDAY = ["日", "月", "火", "水", "木", "金", "土"];

export type DateOption = { value: string; label: string };

/**
 * 明後日から2週間分のお届け日候補を生成する（クライアントで呼ぶ）。
 * value/label ともに日本語表記（例: 9月20日(土)）。
 */
export function deliveryDateOptions(from: Date, days = 14, leadDays = 2): DateOption[] {
  const opts: DateOption[] = [{ value: "", label: "最短でお届け（指定なし）" }];
  for (let i = leadDays; i < leadDays + days; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const label = `${d.getMonth() + 1}月${d.getDate()}日(${WEEKDAY[d.getDay()]})`;
    opts.push({ value: label, label });
  }
  return opts;
}

export const TIME_SLOTS = [
  { value: "", label: "指定なし" },
  { value: "午前中", label: "午前中" },
  { value: "14-16時", label: "14〜16時" },
  { value: "16-18時", label: "16〜18時" },
  { value: "18-20時", label: "18〜20時" },
  { value: "19-21時", label: "19〜21時" },
];

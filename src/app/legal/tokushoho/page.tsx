import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "特定商取引法に基づく表記" };

const ROWS: Array<[string, React.ReactNode]> = [
  ["販売事業者", "ハヤケン eショップ（デモ）"],
  ["運営統括責任者", "紺南 太郎"],
  ["所在地", "〒000-0000 大阪府大阪市○○区○○ 1-2-3（デモ用）"],
  ["お問い合わせ", <Link key="c" href="/contact" style={{ color: "var(--brand-dark)" }}>お問い合わせフォーム</Link>],
  ["販売価格", "各商品ページに税込価格で表示（税抜表示への切替も可能）"],
  ["商品代金以外の必要料金", "送料 全国一律550円（税込）／3,980円以上で無料。決済手数料は決済方法により異なります。"],
  ["お支払い方法", "クレジットカード／代金引換／店頭支払い"],
  ["お支払い時期", "クレジットカード：ご注文時／代金引換：商品受取時／店頭：受取時"],
  ["引渡し時期", "ご注文確認後、通常2〜4営業日以内に発送"],
  ["返品・交換", <Link key="r" href="/guide/returns" style={{ color: "var(--brand-dark)" }}>返品・交換について</Link>],
];

export default function TokushohoPage() {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>特定商取引法に基づく表記</span>
      </nav>

      <article className="doc">
        <h1>特定商取引法に基づく表記</h1>
        <p className="doc-lead">特定商取引に関する法律に基づき、以下のとおり表記します。</p>
        <table className="doc-table">
          <tbody>
            {ROWS.map(([k, v]) => (
              <tr key={k}>
                <th>{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="doc-note">
          ※ 本サイトはホームセンター通販を参考に制作したデモです。記載内容はサンプルであり、実在の事業者・取引を表すものではありません。
        </div>
      </article>
    </div>
  );
}

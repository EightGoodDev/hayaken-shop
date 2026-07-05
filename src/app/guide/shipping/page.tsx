import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "配送・送料について" };

export default function ShippingGuidePage() {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <Link href="/help">ご利用ガイド</Link>
        <span>›</span>
        <span>配送・送料について</span>
      </nav>

      <article className="doc">
        <h1>配送・送料について</h1>
        <p className="doc-lead">お届けにかかる送料・日数・受け取り方法についてご案内します。</p>

        <h2>送料</h2>
        <table className="doc-table">
          <tbody>
            <tr>
              <th>全国一律</th>
              <td>550円（税込）</td>
            </tr>
            <tr>
              <th>送料無料</th>
              <td>1回のご注文金額が 3,980円（税込）以上で無料</td>
            </tr>
            <tr>
              <th>複数のお届け先</th>
              <td>お届け先ごとに上記の条件で送料を計算します</td>
            </tr>
            <tr>
              <th>店舗受取</th>
              <td>送料無料</td>
            </tr>
          </tbody>
        </table>

        <h2>お届け日数</h2>
        <ul>
          <li>ご注文からおおむね2〜4日でお届けします（一部地域・大型商品を除く）。</li>
          <li>お届け希望日・時間帯はご注文手続きで指定できます。</li>
          <li>在庫状況により発送が前後する場合があります。</li>
        </ul>

        <h2>店舗受取</h2>
        <p>
          対象商品はお近くの店舗でお受け取りいただけます。在庫がある場合は最短当日のお渡しも可能です。
          受け取り可能な店舗は <Link href="/stores" style={{ color: "var(--brand-dark)" }}>店舗検索</Link> からご確認ください。
        </p>

        <h2>配送方法</h2>
        <ul>
          <li>通常商品は宅配便でお届けします。</li>
          <li>大型商品・重量物は専用便でのお届けとなる場合があります。</li>
        </ul>

        <div className="doc-note">
          ※ 本サイトはホームセンター通販を参考に制作したデモです。実際の配送・課金は行われません。
        </div>
      </article>
    </div>
  );
}

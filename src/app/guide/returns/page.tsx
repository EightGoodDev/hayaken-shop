import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "返品・交換について" };

export default function ReturnsGuidePage() {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <Link href="/help">ご利用ガイド</Link>
        <span>›</span>
        <span>返品・交換について</span>
      </nav>

      <article className="doc">
        <h1>返品・交換について</h1>
        <p className="doc-lead">お届けした商品の返品・交換の条件と手順をご案内します。</p>

        <h2>返品・交換の条件</h2>
        <table className="doc-table">
          <tbody>
            <tr>
              <th>受付期間</th>
              <td>商品到着後 30日以内</td>
            </tr>
            <tr>
              <th>対象</th>
              <td>未使用・未開封の商品（初期不良・誤配送を除く）</td>
            </tr>
            <tr>
              <th>返送料</th>
              <td>お客様都合の場合はお客様負担／不良・誤配送の場合は当店負担</td>
            </tr>
          </tbody>
        </table>

        <h2>返品・交換できない場合</h2>
        <ul>
          <li>お客様のご使用・開封により価値が損なわれた商品</li>
          <li>お客様の責任で傷・汚れが生じた商品</li>
          <li>食品・塗料などの生鮮・消耗品で衛生上再販できないもの</li>
          <li>オーダー品・加工品など個別対応の商品</li>
        </ul>

        <h2>手順</h2>
        <ol>
          <li><Link href="/contact" style={{ color: "var(--brand-dark)" }}>お問い合わせ</Link>より、注文番号を添えてご連絡ください。</li>
          <li>返品先・手続き方法をご案内します。</li>
          <li>商品到着・確認後、返金または交換品の発送を行います。</li>
        </ol>

        <h2>返金について</h2>
        <ul>
          <li>ご利用の決済方法に応じて返金します。</li>
          <li>ポイント・クーポンをご利用の場合は、利用分を戻したうえで差額を返金します。</li>
          <li>ご注文のキャンセルは <Link href="/mypage" style={{ color: "var(--brand-dark)" }}>マイページ</Link> の注文詳細からも行えます。</li>
        </ul>

        <div className="doc-note">
          ※ 本サイトはホームセンター通販を参考に制作したデモです。実際の返品・返金は行われません。
        </div>
      </article>
    </div>
  );
}

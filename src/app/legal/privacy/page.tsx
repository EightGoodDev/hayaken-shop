import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "プライバシーポリシー" };

export default function PrivacyPage() {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>プライバシーポリシー</span>
      </nav>

      <article className="doc">
        <h1>プライバシーポリシー</h1>
        <p className="doc-lead">
          ハヤケン eショップ（以下「当社」）は、お客様の個人情報を適切に取り扱います。
        </p>

        <h2>1. 取得する情報</h2>
        <ul>
          <li>お名前・住所・電話番号・メールアドレス等の連絡先情報</li>
          <li>ご注文・お支払いに関する情報</li>
          <li>サイトのご利用状況（閲覧履歴・お気に入り等）</li>
        </ul>

        <h2>2. 利用目的</h2>
        <ul>
          <li>商品の発送・ご注文の管理・お問い合わせ対応のため</li>
          <li>おすすめ商品のご案内・サービス改善のため</li>
          <li>不正利用の防止のため</li>
        </ul>

        <h2>3. 第三者提供</h2>
        <p>法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。</p>

        <h2>4. ブラウザ内の保存について</h2>
        <p>
          本デモでは、カート・お気に入り・閲覧履歴・お届け先などをお客様の端末（localStorage）に保存します。
          ブラウザのデータを消去すると、これらの情報は削除されます。
        </p>

        <h2>5. お問い合わせ</h2>
        <p>
          個人情報の取り扱いに関するお問い合わせは
          <Link href="/contact" style={{ color: "var(--brand-dark)" }}>お問い合わせフォーム</Link>
          よりご連絡ください。
        </p>

        <div className="doc-note">
          ※ 本サイトはホームセンター通販を参考に制作したデモです。記載内容はサンプルです。
        </div>
      </article>
    </div>
  );
}

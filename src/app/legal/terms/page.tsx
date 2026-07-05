import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "利用規約" };

export default function TermsPage() {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>利用規約</span>
      </nav>

      <article className="doc">
        <h1>利用規約</h1>
        <p className="doc-lead">
          本規約は、ハヤケン eショップ（以下「当サイト」）のご利用条件を定めるものです。
        </p>

        <h2>第1条（適用）</h2>
        <p>本規約は、当サイトの利用に関わる一切の関係に適用されます。</p>

        <h2>第2条（禁止事項）</h2>
        <ul>
          <li>法令または公序良俗に違反する行為</li>
          <li>当サイトの運営を妨害する行為</li>
          <li>他の利用者・第三者の権利を侵害する行為</li>
          <li>不正な手段による注文・アクセス</li>
        </ul>

        <h2>第3条（注文の成立・キャンセル）</h2>
        <p>
          ご注文は当サイトが受け付けた時点で成立します。発送前のご注文は
          <Link href="/mypage" style={{ color: "var(--brand-dark)" }}>マイページ</Link>
          からキャンセルできます。
        </p>

        <h2>第4条（免責事項）</h2>
        <p>
          当サイトは、提供する情報の正確性・完全性を保証しません。ご利用により生じた損害について、
          法令で認められる範囲で責任を負いません。
        </p>

        <h2>第5条（規約の変更）</h2>
        <p>当サイトは、必要に応じて本規約を変更することがあります。</p>

        <div className="doc-note">
          ※ 本サイトはホームセンター通販を参考に制作したデモです。記載内容はサンプルです。
        </div>
      </article>
    </div>
  );
}

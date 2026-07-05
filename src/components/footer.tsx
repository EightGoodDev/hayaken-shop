import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cols">
          <div className="footer-brand">
            <div className="brand" style={{ marginBottom: 12 }}>
              <span className="brand-mark">H</span>
              <span className="brand-name">
                <b style={{ color: "#fff" }}>HAYAKEN</b>
                <span style={{ color: "#8a93a2" }}>eショップ</span>
              </span>
            </div>
            <p style={{ margin: 0, lineHeight: 1.8 }}>
              暮らしとDIYを支えるホームセンター通販。
              工具・園芸・日用品まで、必要なものがそろう。
            </p>
          </div>

          <div>
            <h4>人気カテゴリ</h4>
            <ul>
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>ご利用案内</h4>
            <ul>
              <li><Link href="/help">ご利用ガイド</Link></li>
              <li><Link href="/guide/shipping">配送・送料について</Link></li>
              <li><Link href="/guide/returns">返品・交換</Link></li>
              <li><Link href="/stores">店舗検索・店舗受取</Link></li>
              <li><Link href="/coupons">クーポン</Link></li>
              <li><Link href="/contact">お問い合わせ</Link></li>
            </ul>
          </div>

          <div>
            <h4>会員サービス</h4>
            <ul>
              <li><Link href="/mypage">マイページ・注文履歴</Link></li>
              <li><Link href="/login">ログイン</Link></li>
              <li><Link href="/login">新規会員登録</Link></li>
              <li><Link href="/favorites">お気に入り</Link></li>
              <li><Link href="/cart">カート</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {`${2020}`}-2026 ハヤケン eショップ（デモ）. All rights reserved.</span>
          <span>
            <Link href="/legal/tokushoho">特定商取引法</Link>　｜　<Link href="/legal/privacy">プライバシーポリシー</Link>　｜
            <Link href="/legal/terms">利用規約</Link>　｜　<Link href="/admin">管理画面(デモ)</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

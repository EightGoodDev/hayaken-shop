"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/catalog";
import { useCart } from "./cart-provider";
import { useFavorites } from "./favorites-provider";
import { MobileMenu } from "./mobile-menu";
import { PriceModeToggle } from "./price-provider";
import { SearchBox } from "./search-box";

export function Header() {
  const { count, ready } = useCart();
  const { count: favCount, ready: favReady } = useFavorites();
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="container">
          <span>🚚 3,980円以上のご購入で送料無料 ／ 店舗受取なら当日OK</span>
          <span className="htop-links">
            <PriceModeToggle />
            <Link href="/coupons">クーポン</Link>
            <Link href="/mypage">マイページ</Link>
            <Link href="/stores">店舗検索</Link>
            <Link href="/contact">お問い合わせ</Link>
          </span>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <MobileMenu />
          <Link href="/" className="brand" aria-label="ハヤケン eショップ トップ">
            <span className="brand-mark">H</span>
            <span className="brand-name">
              <b>HAYAKEN</b>
              <span>eショップ ｜ ホームセンター通販</span>
            </span>
          </Link>

          <SearchBox />

          <nav className="header-actions" aria-label="アカウント">
            <Link href="/login" className="icon-btn">
              <span className="ico" aria-hidden>👤</span>
              ログイン
            </Link>
            <Link href="/favorites" className="icon-btn" aria-label="お気に入り">
              <span className="ico" aria-hidden>♡</span>
              お気に入り
              {favReady && favCount > 0 ? <span className="cart-badge">{favCount}</span> : null}
            </Link>
            <Link href="/cart" className="icon-btn" aria-label="カート">
              <span className="ico" aria-hidden>🛒</span>
              カート
              {ready && count > 0 ? <span className="cart-badge">{count}</span> : null}
            </Link>
          </nav>
        </div>
      </div>

      <nav className="catnav" aria-label="商品カテゴリ">
        <div className="container">
          {CATEGORIES.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                aria-current={active ? "page" : undefined}
                style={active ? { color: "var(--brand-dark)", borderBottomColor: "var(--brand)" } : undefined}
              >
                <span aria-hidden>{c.emoji}</span>
                {c.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/catalog";
import { PriceModeToggle } from "./price-provider";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-label="メニューを開く"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span aria-hidden>☰</span>
      </button>

      {open ? (
        <div className="drawer-backdrop" onClick={() => setOpen(false)} role="presentation">
          <nav className="drawer" onClick={(e) => e.stopPropagation()} aria-label="モバイルメニュー">
            <div className="drawer-head">
              <b>カテゴリ</b>
              <button type="button" className="drawer-close" aria-label="閉じる" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <div className="drawer-list">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setOpen(false)}>
                  <span aria-hidden style={{ marginRight: 8 }}>{c.emoji}</span>
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="drawer-foot">
              <Link href="/mypage" onClick={() => setOpen(false)}>マイページ・注文履歴</Link>
              <Link href="/favorites" onClick={() => setOpen(false)}>お気に入り</Link>
              <Link href="/coupons" onClick={() => setOpen(false)}>クーポン</Link>
              <Link href="/sale" onClick={() => setOpen(false)}>セール</Link>
              <Link href="/stores" onClick={() => setOpen(false)}>店舗検索</Link>
              <Link href="/help" onClick={() => setOpen(false)}>ご利用ガイド</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>お問い合わせ</Link>
            </div>
            <div className="drawer-price">
              <span>価格表示</span>
              <PriceModeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

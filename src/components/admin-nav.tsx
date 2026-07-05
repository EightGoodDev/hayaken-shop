"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "ダッシュボード", icon: "📊", exact: true },
  { href: "/admin/products", label: "商品管理", icon: "📦" },
  { href: "/admin/inventory", label: "在庫アラート", icon: "⚠️" },
  { href: "/admin/coupons", label: "クーポン管理", icon: "🎟️" },
  { href: "/admin/campaigns", label: "特集・キャンペーン", icon: "🏷️" },
  { href: "/admin/reviews", label: "レビュー管理", icon: "⭐" },
  { href: "/admin/orders", label: "注文管理", icon: "🧾" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="管理メニュー">
      {ITEMS.map((it) => {
        const active = it.exact ? pathname === it.href : pathname?.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={`admin-nav-item ${active ? "on" : ""}`} aria-current={active ? "page" : undefined}>
            <span aria-hidden>{it.icon}</span>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

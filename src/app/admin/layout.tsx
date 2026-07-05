import Link from "next/link";
import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";

export const metadata: Metadata = {
  title: "管理画面",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand">
          <span className="brand-mark">H</span>
          <span>
            <b>HAYAKEN</b>
            <span>管理コンソール</span>
          </span>
        </Link>
        <AdminNav />
        <Link href="/" className="admin-back">
          ← ストアを表示
        </Link>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-demo-badge">DEMO 管理環境</span>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>管理者：紺南 太郎</span>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

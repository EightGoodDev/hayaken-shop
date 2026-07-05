import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ログイン" };

export default function LoginPage() {
  return (
    <div className="container" style={{ maxWidth: 440 }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          padding: 28,
          marginTop: 32,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h1 style={{ fontSize: 22, marginTop: 0 }}>ログイン</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: -6 }}>
          ※ デモサイトのため認証は動作しません
        </p>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "14px 0 6px" }}>メールアドレス</label>
        <input
          type="email"
          placeholder="mail@example.com"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid var(--line-strong)", fontSize: 14 }}
        />
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "14px 0 6px" }}>パスワード</label>
        <input
          type="password"
          placeholder="••••••••"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid var(--line-strong)", fontSize: 14 }}
        />
        <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
          ログイン
        </button>
        <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
          新規会員登録（無料）
        </button>
        <p style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/" style={{ color: "var(--brand-dark)", fontSize: 13 }}>
            ← トップに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}

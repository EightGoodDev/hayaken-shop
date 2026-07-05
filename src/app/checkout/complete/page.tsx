"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { yen } from "@/lib/format";

function CompleteInner() {
  const params = useSearchParams();
  const order = params.get("order") ?? "KN-00000000-0000";
  const total = Number(params.get("total") ?? 0);
  const items = Number(params.get("items") ?? 0);
  const earned = params.has("earned") ? Number(params.get("earned")) : Math.floor(total / 100);
  const used = Number(params.get("used") ?? 0);

  return (
    <div className="container" style={{ maxWidth: 620 }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          padding: 32,
          marginTop: 32,
          textAlign: "center",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ fontSize: 56 }} aria-hidden>✅</div>
        <h1 style={{ fontSize: 24, margin: "8px 0 4px" }}>ご注文ありがとうございました</h1>
        <p style={{ color: "var(--ink-soft)", margin: 0 }}>ご注文を承りました。確認メールをお送りします（デモ）。</p>

        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            padding: 18,
            margin: "22px 0",
            textAlign: "left",
          }}
        >
          <div className="summary-row">
            <span>注文番号</span>
            <span style={{ fontWeight: 700 }}>{order}</span>
          </div>
          <div className="summary-row">
            <span>商品点数</span>
            <span>{items}点</span>
          </div>
          {used > 0 ? (
            <div className="summary-row">
              <span>利用ポイント</span>
              <span>−{used.toLocaleString("ja-JP")} pt</span>
            </div>
          ) : null}
          <div className="summary-row">
            <span>お支払い合計</span>
            <span style={{ fontWeight: 800, color: "var(--accent-dark)" }}>{yen(total)}</span>
          </div>
          <div className="summary-row">
            <span>獲得ポイント</span>
            <span>{earned.toLocaleString("ja-JP")} pt</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">
            買い物を続ける
          </Link>
          <Link href="/mypage" className="btn btn-ghost">
            注文履歴を見る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "40px 0", color: "var(--muted)" }}>読み込み中…</div>}>
      <CompleteInner />
    </Suspense>
  );
}

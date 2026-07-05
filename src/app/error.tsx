"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 実運用ではここでエラー監視サービスへ送信する
    console.error(error);
  }, [error]);

  return (
    <div className="container">
      <div className="empty">
        <div className="e" aria-hidden>⚠️</div>
        <h3>問題が発生しました</h3>
        <p>ページの表示中にエラーが発生しました。お手数ですが、もう一度お試しください。</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
          <button type="button" className="btn btn-primary" onClick={() => reset()}>
            再読み込み
          </button>
          <Link href="/" className="btn btn-ghost">
            トップに戻る
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            お問い合わせ
          </Link>
        </div>
        {error.digest ? (
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 16 }}>エラーコード: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}

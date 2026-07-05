"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURES, featureProducts } from "@/lib/features";
import { loadHiddenFeatures, saveHiddenFeatures } from "@/lib/feature-visibility";

export default function AdminCampaigns() {
  const [hidden, setHidden] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHidden(loadHiddenFeatures());
    setReady(true);
  }, []);

  function toggle(slug: string) {
    setHidden((cur) => {
      const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
      saveHiddenFeatures(next);
      return next;
    });
  }

  const isVisible = (slug: string) => !ready || !hidden.includes(slug);
  const visibleCount = ready ? FEATURES.filter((f) => isVisible(f.slug)).length : FEATURES.length;

  return (
    <div>
      <div className="admin-head">
        <h1>特集・キャンペーン管理</h1>
        <p>トップページに表示する特集を公開/非公開で切り替えられます（ストアのトップに即時反映）。</p>
      </div>

      <div className="admin-kpis" style={{ gridTemplateColumns: "repeat(3,1fr)", maxWidth: 620 }}>
        <div className="admin-kpi">
          <span className="admin-kpi-label">特集数</span>
          <b>{FEATURES.length}</b>
          <span className="admin-kpi-sub">登録済み</span>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi-label">公開中</span>
          <b>{ready ? visibleCount : "—"}</b>
          <span className="admin-kpi-sub">トップに表示</span>
        </div>
        <div className={`admin-kpi ${ready && FEATURES.length - visibleCount > 0 ? "warn" : ""}`}>
          <span className="admin-kpi-label">非公開</span>
          <b>{ready ? FEATURES.length - visibleCount : "—"}</b>
          <span className="admin-kpi-sub">非表示</span>
        </div>
      </div>

      <div className="admin-campaign-grid">
        {FEATURES.map((f) => {
          const visible = isVisible(f.slug);
          const count = featureProducts(f).length;
          return (
            <div key={f.slug} className={`admin-campaign${visible ? "" : " off"}`}>
              <div className="admin-campaign-banner" style={{ background: f.bg }}>
                <b>{f.title}</b>
                <span>{f.subtitle}</span>
              </div>
              <div className="admin-campaign-body">
                <div className="admin-campaign-meta">
                  <span className={`admin-stock ${visible ? "" : "out"}`} style={visible ? { background: "#e6f4ea", color: "#1a7f37" } : undefined}>
                    {ready ? (visible ? "公開中" : "非公開") : "…"}
                  </span>
                  <span className="admin-muted" style={{ fontSize: 12 }}>対象 {count}商品</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <Link href={`/features/${f.slug}`} className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }}>
                    プレビュー
                  </Link>
                  <button
                    type="button"
                    className={`btn ${visible ? "btn-ghost" : "btn-primary"}`}
                    style={{ padding: "7px 14px", fontSize: 13, marginLeft: "auto" }}
                    onClick={() => toggle(f.slug)}
                    disabled={!ready}
                  >
                    {visible ? "非公開にする" : "公開する"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="admin-muted" style={{ fontSize: 12, marginTop: 16 }}>
        ※ 非公開にしてもキャンペーンページ自体（/features/…）は残ります。トップページの一覧からのみ非表示になります。
        {" "}
        <Link href="/" className="admin-link">ストアのトップを見る →</Link>
      </p>
    </div>
  );
}

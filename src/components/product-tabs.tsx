"use client";

import { useState } from "react";

type TabKey = "desc" | "spec" | "review";

export function ProductTabs({
  description,
  specs,
  reviewCount,
  reviews,
}: {
  description: string;
  specs: string[];
  reviewCount: number;
  reviews: React.ReactNode;
}) {
  const [tab, setTab] = useState<TabKey>("desc");

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "desc", label: "商品説明" },
    { key: "spec", label: "商品仕様" },
    { key: "review", label: `レビュー（${reviewCount.toLocaleString("ja-JP")}）` },
  ];

  return (
    <section className="section product-tabs">
      <div className="tabbar" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`tab ${tab === t.key ? "on" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {tab === "desc" ? <p className="desc-box" style={{ margin: 0 }}>{description}</p> : null}
        {tab === "spec" ? (
          <table className="spec-table">
            <tbody>
              {specs.map((s) => {
                const [k, ...rest] = s.split(":");
                const v = rest.join(":").trim();
                return (
                  <tr key={s}>
                    <th>{v ? k.trim() : "特長"}</th>
                    <td>{v || k.trim()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
        {tab === "review" ? <div>{reviews}</div> : null}
      </div>
    </section>
  );
}

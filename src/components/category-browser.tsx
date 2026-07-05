"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import { sortProducts, SORT_LABELS, type SortKey } from "@/lib/sort";
import { PagedGrid } from "./paged-grid";

type PriceBand = { key: string; label: string; min: number; max: number };

const PRICE_BANDS: PriceBand[] = [
  { key: "u1000", label: "〜999円", min: 0, max: 999 },
  { key: "1000-3000", label: "1,000〜2,999円", min: 1000, max: 2999 },
  { key: "3000-5000", label: "3,000〜4,999円", min: 3000, max: 4999 },
  { key: "5000-10000", label: "5,000〜9,999円", min: 5000, max: 9999 },
  { key: "o10000", label: "10,000円〜", min: 10000, max: Infinity },
];

export function CategoryBrowser({ products, initialSub }: { products: Product[]; initialSub?: string }) {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [subs, setSubs] = useState<string[]>(initialSub ? [initialSub] : []);
  const [brands, setBrands] = useState<string[]>([]);
  const [bands, setBands] = useState<string[]>([]);
  const [saleOnly, setSaleOnly] = useState(false);

  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort((a, b) => a.localeCompare(b, "ja")),
    [products],
  );
  const subCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.sub, (map.get(p.sub) ?? 0) + 1);
    return [...map.entries()].map(([sub, count]) => ({ sub, count }));
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (subs.length > 0) list = list.filter((p) => subs.includes(p.sub));
    if (brands.length > 0) list = list.filter((p) => brands.includes(p.brand));
    if (saleOnly) list = list.filter((p) => p.off > 0);
    if (bands.length > 0) {
      const selected = PRICE_BANDS.filter((b) => bands.includes(b.key));
      list = list.filter((p) => selected.some((b) => p.price >= b.min && p.price <= b.max));
    }
    return sortProducts(list, sort);
  }, [products, subs, brands, bands, saleOnly, sort]);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  const hasFilter = subs.length > 0 || brands.length > 0 || bands.length > 0 || saleOnly;

  return (
    <div className="browse-layout">
      <aside className="filter-panel">
        <div className="filter-head">
          <b>絞り込み</b>
          {hasFilter ? (
            <button
              type="button"
              className="filter-clear"
              onClick={() => {
                setSubs([]);
                setBrands([]);
                setBands([]);
                setSaleOnly(false);
              }}
            >
              クリア
            </button>
          ) : null}
        </div>

        {subCounts.length > 1 ? (
          <div className="filter-group" style={{ borderTop: 0, paddingTop: 0 }}>
            <span className="filter-title">サブカテゴリ</span>
            {subCounts.map(({ sub, count }) => (
              <label className="filter-opt" key={sub}>
                <input type="checkbox" checked={subs.includes(sub)} onChange={() => toggle(subs, sub, setSubs)} />
                {sub}
                <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 11 }}>{count}</span>
              </label>
            ))}
          </div>
        ) : null}

        <div className="filter-group">
          <span className="filter-title">価格帯</span>
          {PRICE_BANDS.map((b) => (
            <label className="filter-opt" key={b.key}>
              <input type="checkbox" checked={bands.includes(b.key)} onChange={() => toggle(bands, b.key, setBands)} />
              {b.label}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-title">セール</span>
          <label className="filter-opt">
            <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} />
            セール商品のみ
          </label>
        </div>

        <div className="filter-group">
          <span className="filter-title">ブランド</span>
          <div className="filter-scroll">
            {allBrands.map((b) => (
              <label className="filter-opt" key={b}>
                <input type="checkbox" checked={brands.includes(b)} onChange={() => toggle(brands, b, setBrands)} />
                {b}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="browse-toolbar">
          <span className="result-count">{filtered.length}件表示</span>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-soft)" }}>
            並び替え
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--line-strong)",
                background: "#fff",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length > 0 ? (
          <PagedGrid products={filtered} />
        ) : (
          <div className="empty">
            <div className="e" aria-hidden>🔍</div>
            <h3>条件に合う商品がありません</h3>
            <p>絞り込み条件を変更してください。</p>
          </div>
        )}
      </div>
    </div>
  );
}

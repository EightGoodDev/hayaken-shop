"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, searchProducts } from "@/lib/catalog";
import { yen } from "@/lib/format";
import { ProductImage } from "./product-image";

export function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const query = q.trim();
  const products = query ? searchProducts(query).slice(0, 6) : [];
  const cats = query
    ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];
  const hasSuggest = products.length > 0 || cats.length > 0;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <div className="search-wrap" ref={boxRef}>
      <form className="search" onSubmit={submit} role="search">
        <input
          type="search"
          placeholder="工具・園芸・日用品などを検索"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label="商品を検索"
          autoComplete="off"
        />
        <button type="submit">
          <span aria-hidden>🔍</span>検索
        </button>
      </form>

      {open && query && hasSuggest ? (
        <div className="suggest" role="listbox">
          {cats.length > 0 ? (
            <div className="suggest-group">
              <span className="suggest-head">カテゴリ</span>
              {cats.map((c) => (
                <button key={c.slug} type="button" className="suggest-cat" onClick={() => go(`/category/${c.slug}`)}>
                  <span aria-hidden>{c.emoji}</span>
                  {c.name}
                </button>
              ))}
            </div>
          ) : null}
          {products.length > 0 ? (
            <div className="suggest-group">
              <span className="suggest-head">商品</span>
              {products.map((p) => (
                <button key={p.id} type="button" className="suggest-item" onClick={() => go(`/product/${p.id}`)}>
                  <span className="suggest-thumb">
                    <ProductImage product={p} />
                  </span>
                  <span className="suggest-name">{p.name}</span>
                  <span className="suggest-price">{yen(p.price)}</span>
                </button>
              ))}
            </div>
          ) : null}
          <button type="button" className="suggest-all" onClick={() => go(`/search?q=${encodeURIComponent(query)}`)}>
            「{query}」の検索結果をすべて見る →
          </button>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
  bg: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "ホームセンター通販",
    title: "暮らしとDIYの「欲しい」がそろう。",
    text: "工具・金物・園芸・日用品・作業用品まで約12カテゴリ。3,980円以上で送料無料、店舗受取なら当日お渡しも。",
    cta: { label: "人気の工具を見る →", href: "/category/tools" },
    bg: "linear-gradient(120deg,#fff4ea 0%,#ffe6d6 55%,#ffd9c2 100%)",
  },
  {
    eyebrow: "期間限定フェア",
    title: "夏のDIYフェア 最大25%OFF",
    text: "電動工具から作業用品まで、対象商品がお買い得。この夏のものづくりを応援します。",
    cta: { label: "フェアを見る →", href: "/features/diy-fair" },
    bg: "linear-gradient(120deg,#ffe9df 0%,#ffd3c4 60%,#ffbe9f 100%)",
  },
  {
    eyebrow: "特集",
    title: "防災の備え特集",
    text: "非常用の水・食料・ライト・簡易トイレなど、いざという時に備えておきたい品を集めました。",
    cta: { label: "特集を見る →", href: "/features/bousai" },
    bg: "linear-gradient(120deg,#e3f2f6 0%,#cfe6ef 55%,#bfe0e6 100%)",
  },
];

const BADGES = [
  { e: "🚚", b: "3,980円以上で送料無料", s: "全国どこでもお届け" },
  { e: "🏬", b: "店舗受取OK", s: "ネットで注文、お店で受取" },
  { e: "💳", b: "ポイントが貯まる・使える", s: "100円ごとに1ポイント還元" },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((n: number) => setI((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const slide = SLIDES[i];

  return (
    <section className="hero-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero-slide" style={{ background: slide.bg }}>
        <div className="hero-slide-body">
          <span className="pill">{slide.eyebrow}</span>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
          <Link href={slide.cta.href} className="cta">
            {slide.cta.label}
          </Link>
        </div>

        <button type="button" className="hero-arrow prev" aria-label="前へ" onClick={() => go(i - 1)}>
          ‹
        </button>
        <button type="button" className="hero-arrow next" aria-label="次へ" onClick={() => go(i + 1)}>
          ›
        </button>

        <div className="hero-dots" role="tablist">
          {SLIDES.map((_, n) => (
            <button
              key={n}
              type="button"
              className={`hero-dot ${n === i ? "on" : ""}`}
              aria-label={`スライド${n + 1}`}
              aria-selected={n === i}
              onClick={() => go(n)}
            />
          ))}
        </div>
      </div>

      <div className="hero-badges-row">
        {BADGES.map((x) => (
          <div className="hero-badge" key={x.b}>
            <span className="e" aria-hidden>{x.e}</span>
            <div>
              <b>{x.b}</b>
              <span>{x.s}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

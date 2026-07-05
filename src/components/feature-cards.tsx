"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURES } from "@/lib/features";
import { FEATURE_HIDDEN_KEY, loadHiddenFeatures } from "@/lib/feature-visibility";

/**
 * トップページの特集カード。管理画面で非公開にした特集は表示しない。
 * ハイドレーション整合のため、readyになるまでは全件表示（SSRと一致）。
 */
export function FeatureCards() {
  const [hidden, setHidden] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHidden(loadHiddenFeatures());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === FEATURE_HIDDEN_KEY) setHidden(loadHiddenFeatures());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const visible = ready ? FEATURES.filter((f) => !hidden.includes(f.slug)) : FEATURES;

  if (visible.length === 0) return null;

  return (
    <div className="feature-cards">
      {visible.map((f) => (
        <Link key={f.slug} href={`/features/${f.slug}`} className="feature-card" style={{ background: f.bg }}>
          <b>{f.title}</b>
          <span>{f.subtitle}</span>
          <span className="feature-card-cta">詳しく見る →</span>
        </Link>
      ))}
    </div>
  );
}

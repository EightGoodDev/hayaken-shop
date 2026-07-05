"use client";

import { useFavorites } from "./favorites-provider";

export function FavButton({ id, variant = "card" }: { id: string; variant?: "card" | "inline" }) {
  const { has, toggle, ready } = useFavorites();
  const active = ready && has(id);

  return (
    <button
      type="button"
      className={`fav-btn ${variant} ${active ? "active" : ""}`}
      aria-pressed={active}
      aria-label={active ? "お気に入りから削除" : "お気に入りに追加"}
      title={active ? "お気に入りから削除" : "お気に入りに追加"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      <span aria-hidden>{active ? "♥" : "♡"}</span>
      {variant === "inline" ? <span className="fav-label">{active ? "お気に入り済み" : "お気に入り"}</span> : null}
    </button>
  );
}

"use client";

import { useCompare } from "./compare-provider";

export function CompareToggle({ id, variant = "card" }: { id: string; variant?: "card" | "inline" }) {
  const { has, toggle, full } = useCompare();
  const active = has(id);
  const disabled = !active && full;

  return (
    <button
      type="button"
      className={`compare-toggle ${variant} ${active ? "active" : ""}`}
      aria-pressed={active}
      disabled={disabled}
      title={disabled ? `比較は最大4件までです` : active ? "比較から外す" : "比較に追加"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      <span aria-hidden>⇄</span> {active ? "比較中" : "比較"}
    </button>
  );
}

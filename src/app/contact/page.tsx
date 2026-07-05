"use client";

import Link from "next/link";
import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 8,
  border: "1px solid var(--line-strong)",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, margin: "14px 0 6px" };

const TOPICS = ["商品について", "ご注文・配送について", "返品・交換について", "会員・ポイントについて", "その他"];

function ticketNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = String(Math.floor(1000 + (Date.now() % 9000)));
  return `INQ-${ymd}-${rand}`;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [ticket, setTicket] = useState<string | null>(null);

  const canSubmit = form.name.trim() && form.email.trim() && form.message.trim();

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setTicket(ticketNumber());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (ticket) {
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
          <h1 style={{ fontSize: 24, margin: "8px 0 4px" }}>お問い合わせを受け付けました</h1>
          <p style={{ color: "var(--ink-soft)" }}>
            通常2営業日以内にご入力のメールアドレス宛にご返信します（デモ）。
          </p>
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: 18,
              margin: "22px 0",
            }}
          >
            <div className="summary-row">
              <span>受付番号</span>
              <span style={{ fontWeight: 700 }}>{ticket}</span>
            </div>
            <div className="summary-row">
              <span>お問い合わせ種別</span>
              <span>{form.topic}</span>
            </div>
          </div>
          <Link href="/" className="btn btn-primary">
            トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 620 }}>
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">トップ</Link>
        <span>›</span>
        <span>お問い合わせ</span>
      </nav>

      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>お問い合わせ</h2>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: -6 }}>
        ご不明な点はお気軽にお問い合わせください。よくあるご質問は
        <Link href="/help" style={{ color: "var(--brand-dark)" }}>
          ご利用ガイド
        </Link>
        もご覧ください。
      </p>

      <form
        onSubmit={submit}
        style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: 22, marginTop: 8 }}
      >
        <label style={labelStyle}>お名前 *</label>
        <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="紺南 太郎" />

        <label style={labelStyle}>メールアドレス *</label>
        <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="mail@example.com" />

        <label style={labelStyle}>お問い合わせ種別</label>
        <select value={form.topic} onChange={(e) => set("topic", e.target.value)} style={{ ...inputStyle, appearance: "auto" }}>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label style={labelStyle}>お問い合わせ内容 *</label>
        <textarea
          style={{ ...inputStyle, resize: "vertical" }}
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="お問い合わせ内容をご記入ください"
        />

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 18 }} disabled={!canSubmit}>
          送信する
        </button>
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, marginBottom: 0 }}>
          ※ デモサイトのため、実際には送信されません。
        </p>
      </form>
    </div>
  );
}

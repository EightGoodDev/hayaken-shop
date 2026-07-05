"use client";

import { useEffect, useState } from "react";
import {
  formatAddress,
  loadAddresses,
  nextAddressId,
  saveAddresses,
  type Address,
} from "@/lib/addresses";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid var(--line-strong)",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, margin: "10px 0 5px" };

const EMPTY = { label: "自宅", name: "", zip: "", address: "", tel: "" };

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setAddresses(loadAddresses());
    setReady(true);
  }, []);

  function persist(list: Address[]) {
    setAddresses(list);
    saveAddresses(list);
  }

  function startEdit(a: Address) {
    setEditingId(a.id);
    setShowAdd(false);
    setForm({ label: a.label, name: a.name, zip: a.zip, address: a.address, tel: a.tel });
  }

  function startAdd() {
    setShowAdd(true);
    setEditingId(null);
    setForm(EMPTY);
  }

  function cancel() {
    setEditingId(null);
    setShowAdd(false);
    setForm(EMPTY);
  }

  function save() {
    if (!form.name.trim() || !form.zip.trim() || !form.address.trim()) return;
    if (editingId) {
      persist(addresses.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      const addr: Address = { id: nextAddressId(addresses), ...form };
      persist([...addresses, addr]);
    }
    cancel();
  }

  function remove(id: string) {
    persist(addresses.filter((a) => a.id !== id));
    if (editingId === id) cancel();
  }

  if (!ready) return <p style={{ color: "var(--muted)" }}>読み込み中…</p>;

  const editor = (
    <div className="add-addr" style={{ marginTop: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>ラベル</label>
          <input style={inputStyle} value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="自宅 / 実家 / 会社" />
        </div>
        <div>
          <label style={labelStyle}>お名前 *</label>
          <input style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="紺南 太郎" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>郵便番号 *</label>
          <input style={inputStyle} value={form.zip} onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))} placeholder="000-0000" />
        </div>
        <div>
          <label style={labelStyle}>電話番号</label>
          <input style={inputStyle} value={form.tel} onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))} placeholder="090-0000-0000" />
        </div>
      </div>
      <label style={labelStyle}>ご住所 *</label>
      <input style={inputStyle} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="大阪府大阪市○○区○○ 1-2-3" />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={save}>
          保存する
        </button>
        <button type="button" className="btn btn-ghost" style={{ padding: "8px 18px", fontSize: 13 }} onClick={cancel}>
          キャンセル
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {addresses.map((a) =>
          editingId === a.id ? (
            <div key={a.id}>{editor}</div>
          ) : (
            <div key={a.id} className="addr-card">
              <div>
                <div style={{ fontWeight: 700 }}>
                  <span className="addr-label">{a.label}</span> {a.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                  {formatAddress(a)}
                  {a.tel ? ` ／ ${a.tel}` : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button type="button" className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => startEdit(a)}>
                  編集
                </button>
                <button type="button" className="link-remove" onClick={() => remove(a.id)}>
                  削除
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {addresses.length === 0 && !showAdd ? (
        <p style={{ color: "var(--muted)", fontSize: 13 }}>登録済みのお届け先はありません。</p>
      ) : null}

      {showAdd ? editor : (
        <button type="button" className="btn btn-ghost" style={{ marginTop: 12, padding: "8px 18px", fontSize: 13 }} onClick={startAdd}>
          ＋ お届け先を追加
        </button>
      )}
    </div>
  );
}

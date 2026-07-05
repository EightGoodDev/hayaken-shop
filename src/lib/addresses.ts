/** 住所録（localStorage）。複数のお届け先を保存・選択できる。 */

export type Address = {
  id: string;
  label: string; // 例: 自宅 / 実家 / 会社
  name: string;
  zip: string;
  address: string;
  tel: string;
};

const STORAGE_KEY = "kounan_addresses_v1";

export function loadAddresses(): Address[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Address[]) : [];
  } catch {
    return [];
  }
}

export function saveAddresses(list: Address[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* noop */
  }
}

/** 連番IDを生成（Date/randomに依存しない） */
export function nextAddressId(list: Address[]): string {
  const max = list.reduce((m, a) => {
    const n = Number(a.id.replace(/\D/g, ""));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `addr${max + 1}`;
}

export function formatAddress(a: Address): string {
  return `〒${a.zip} ${a.address}`;
}

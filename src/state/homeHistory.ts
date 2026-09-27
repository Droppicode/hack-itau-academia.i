const KEY = "itau-home-history-idx";

function currentIdx(): number | undefined {
  const idx = (window.history.state as { idx?: number } | null)?.idx;
  return typeof idx === "number" ? idx : undefined;
}

export function markHome() {
  const idx = currentIdx();
  if (idx !== undefined) sessionStorage.setItem(KEY, String(idx));
  sessionStorage.removeItem(IA_KEY);
}

export function clearHome() {
  sessionStorage.removeItem(KEY);
}

export function deltaToHome(): number | undefined {
  const stored = sessionStorage.getItem(KEY);
  const idx = currentIdx();
  if (stored === null || idx === undefined) return undefined;
  const delta = Number(stored) - idx;
  return delta < 0 ? delta : undefined;
}

const IA_KEY = "itau-ia-history-idx";

export function markIa() {
  const idx = currentIdx();
  if (idx !== undefined) sessionStorage.setItem(IA_KEY, String(idx));
}

export function clearIa() {
  sessionStorage.removeItem(IA_KEY);
}

export function deltaToIa(): number | undefined {
  const stored = sessionStorage.getItem(IA_KEY);
  const idx = currentIdx();
  if (stored === null || idx === undefined) return undefined;
  const delta = Number(stored) - idx;
  return delta < 0 ? delta : undefined;
}

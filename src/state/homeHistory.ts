const KEY = "itau-home-history-idx";

function currentIdx(): number | undefined {
  const idx = (window.history.state as { idx?: number } | null)?.idx;
  return typeof idx === "number" ? idx : undefined;
}

export function markHome() {
  const idx = currentIdx();
  if (idx !== undefined) sessionStorage.setItem(KEY, String(idx));
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

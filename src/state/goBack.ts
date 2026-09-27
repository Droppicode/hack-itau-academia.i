import type { NavigateFunction } from "react-router-dom";

export function goBack(navigate: NavigateFunction, fallback = "/home") {
  const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
  if (idx > 0) navigate(-1);
  else navigate(fallback, { replace: true });
}

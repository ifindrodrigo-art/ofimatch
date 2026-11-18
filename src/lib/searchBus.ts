"use client";
// Canal simple para que el buscador del header, el hero y los oficios filtren la grilla de técnicos.
import type { OficioId } from "./data";

export type SearchDetail = { q?: string; trade?: OficioId | "todos" };
const EV = "ofimatch:search";

export function emitSearch(detail: SearchDetail) {
  window.dispatchEvent(new CustomEvent<SearchDetail>(EV, { detail }));
  document.getElementById("tecnicos")?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}

export function onSearch(cb: (d: SearchDetail) => void) {
  const h = (e: Event) => cb((e as CustomEvent<SearchDetail>).detail);
  window.addEventListener(EV, h);
  return () => window.removeEventListener(EV, h);
}

/** En la portada filtra en vivo; en otras páginas navega a la portada con la búsqueda. */
export function searchOrNavigate(detail: SearchDetail) {
  if (document.getElementById("tecnicos")) emitSearch(detail);
  else {
    const p = new URLSearchParams();
    if (detail.q) p.set("q", detail.q);
    if (detail.trade && detail.trade !== "todos") p.set("oficio", detail.trade);
    window.location.href = `/?${p.toString()}#tecnicos`;
  }
}

// Presentación de perfiles: iniciales, color de avatar, insignias, precio y nota.
import { oficioById } from "./data";
import { ratingOf } from "./match";
import type { Profile } from "./types";

const AV = ["#2563EB", "#0891B2", "#4F46E5", "#334155", "#1D4ED8", "#0E7490", "#1E3A8A", "#4338CA"];

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

export function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AV[h % AV.length];
}

/** Insignia calculada con datos reales (no hay verificación manual). */
export function badgeOf(p: Pick<Profile, "rating_sum" | "rating_count" | "jobs_done">): { text: string; tone: "" | "hot" | "new" } | null {
  const r = ratingOf(p);
  if (p.rating_count >= 40 && r >= 4.8) return { text: "Top técnico", tone: "" };
  if (p.jobs_done >= 100) return { text: "+100 trabajos", tone: "hot" };
  if (p.rating_count < 5 && p.jobs_done < 10) return { text: "Nuevo", tone: "new" };
  return null;
}

export const soles = (n: number) => `S/ ${Number(n).toLocaleString("es-PE", { maximumFractionDigits: 0 })}`;

export function roleOf(p: Pick<Profile, "oficio">) {
  return oficioById(p.oficio ?? "")?.singular ?? "Técnico";
}

export function ratingText(p: Pick<Profile, "rating_sum" | "rating_count">) {
  return p.rating_count ? ratingOf(p).toFixed(1) : "Nuevo";
}

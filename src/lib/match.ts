// Algoritmo de match de OfiMatch: cercanía + reputación + disponibilidad,
// con pesos que cambian según la urgencia de la solicitud.
import type { Urgency } from "./data";

export type WorkerLike = {
  id: string;
  lat: number;
  lng: number;
  available: boolean;
  rating_sum: number;
  rating_count: number;
};

export const WEIGHTS: Record<Urgency, { prox: number; rep: number; disp: number }> = {
  ahora: { prox: 0.55, rep: 0.25, disp: 0.2 },
  hoy: { prox: 0.45, rep: 0.35, disp: 0.2 },
  semana: { prox: 0.3, rep: 0.55, disp: 0.15 },
};

const MAX_KM = 18; // a partir de esta distancia la cercanía vale 0
const PRIOR_MEAN = 3.8; // promedio bayesiano: evita que 1 sola reseña de 5★ gane a 30 de 4.8★
const PRIOR_WEIGHT = 3;

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function ratingOf(w: Pick<WorkerLike, "rating_sum" | "rating_count">) {
  return w.rating_count ? w.rating_sum / w.rating_count : 0;
}

export function reputation(w: Pick<WorkerLike, "rating_sum" | "rating_count">) {
  const bayes = (Number(w.rating_sum) + PRIOR_MEAN * PRIOR_WEIGHT) / (w.rating_count + PRIOR_WEIGHT);
  return Math.max(0, Math.min(1, (bayes - 1) / 4));
}

export type MatchResult<W> = {
  worker: W;
  km: number;
  score: number; // 0–100
  parts: { prox: number; rep: number; disp: number }; // aportes en puntos
};

export function rankWorkers<W extends WorkerLike>(
  workers: W[],
  place: { lat: number; lng: number },
  urgency: Urgency,
): MatchResult<W>[] {
  const w = WEIGHTS[urgency];
  return workers
    .map((worker) => {
      const km = distanceKm(place, worker);
      const prox = Math.max(0, 1 - km / MAX_KM);
      const rep = reputation(worker);
      const disp = worker.available ? 1 : urgency === "ahora" ? 0 : urgency === "hoy" ? 0.4 : 0.8;
      const parts = { prox: prox * w.prox * 100, rep: rep * w.rep * 100, disp: disp * w.disp * 100 };
      return { worker, km, parts, score: parts.prox + parts.rep + parts.disp };
    })
    .sort((a, b) => b.score - a.score);
}

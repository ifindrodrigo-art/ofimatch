// Modo demo: funciona sin Supabase, guardando todo en este navegador (localStorage).
// Replica las mismas reglas que la base de datos real (estados, revelado simultáneo, demo auto-acepta).
import { districtByName, type OficioId } from "./data";
import { DEMAND_WEIGHTS, DEMO_WORKERS, OFICIO_FACTOR } from "./seed";
import type { Backend, DemandRow, Profile, Rating, Request } from "./types";

type Store = {
  profiles: Profile[];
  contacts: Record<string, string>;
  requests: Request[];
  ratings: Rating[];
  session: string | null;
  emails: Record<string, { id: string; password: string }>;
};

const KEY = "ofimatch-demo-v1";
const listeners = new Set<() => void>();
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

function fresh(): Store {
  const contacts: Record<string, string> = {};
  DEMO_WORKERS.forEach((w, i) => (contacts[w.id] = `9${String(10000000 + (i + 1) * 7351).padStart(8, "0")}`));
  return { profiles: structuredClone(DEMO_WORKERS), contacts, requests: [], ratings: [], session: null, emails: {} };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {}
  return fresh();
}
function save(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}
const emit = () => listeners.forEach((l) => l());

function withNames(s: Store, r: Request): Request {
  const c = s.profiles.find((p) => p.id === r.client_id);
  const w = s.profiles.find((p) => p.id === r.worker_id);
  return {
    ...r,
    client: c ? { full_name: c.full_name, district: c.district } : null,
    worker: w ? { full_name: w.full_name, oficio: w.oficio, rating_sum: w.rating_sum, rating_count: w.rating_count, is_demo: w.is_demo } : null,
  };
}

// Pseudoaleatorio con semilla: el mapa de demanda demo es estable entre recargas.
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

export function createDemoBackend(): Backend {
  const me = () => {
    const s = load();
    return s.profiles.find((p) => p.id === s.session) ?? null;
  };
  const need = () => {
    const p = me();
    if (!p) throw new Error("Inicia sesión primero.");
    return p;
  };

  return {
    mode: "demo",
    async currentProfile() {
      return me();
    },
    onAuthChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    async signUp(input) {
      const s = load();
      const email = input.email.trim().toLowerCase();
      if (s.emails[email]) throw new Error("Ese correo ya tiene una cuenta. Inicia sesión.");
      if (input.password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
      const d = districtByName(input.district)!;
      const p: Profile = {
        id: uid(),
        role: input.role,
        full_name: input.full_name,
        district: d.name,
        lat: d.lat,
        lng: d.lng,
        oficio: input.role === "trabajador" ? (input.oficio ?? null) : null,
        years_exp: input.role === "trabajador" ? (input.years_exp ?? null) : null,
        bio: input.role === "trabajador" ? (input.bio ?? null) : null,
        available: true,
        rating_sum: 0,
        rating_count: 0,
        jobs_done: 0,
        is_demo: false,
      };
      s.profiles.push(p);
      s.contacts[p.id] = input.phone;
      s.emails[email] = { id: p.id, password: input.password };
      s.session = p.id;
      save(s);
      emit();
      return { needsConfirm: false };
    },
    async signIn(email, password) {
      const s = load();
      const acc = s.emails[email.trim().toLowerCase()];
      if (!acc || acc.password !== password) throw new Error("Correo o contraseña incorrectos.");
      s.session = acc.id;
      save(s);
      emit();
    },
    async signOut() {
      const s = load();
      s.session = null;
      save(s);
      emit();
    },
    async listWorkers(oficio) {
      return load().profiles.filter((p) => p.role === "trabajador" && p.oficio === oficio);
    },
    async updateMyProfile(patch) {
      const p = need();
      const s = load();
      Object.assign(s.profiles.find((x) => x.id === p.id)!, patch);
      save(s);
    },
    async createRequest(input) {
      const p = need();
      const s = load();
      const d = districtByName(input.district)!;
      const worker = s.profiles.find((x) => x.id === input.worker_id);
      const demo = !!worker?.is_demo;
      const now = new Date().toISOString();
      const r: Request = {
        id: uid(),
        client_id: p.id,
        worker_id: input.worker_id,
        oficio: input.oficio,
        description: input.description,
        district: d.name,
        lat: d.lat,
        lng: d.lng,
        urgency: input.urgency,
        status: demo ? "aceptada" : "pendiente",
        match_score: input.match_score,
        amount: null,
        created_at: now,
        accepted_at: demo ? now : null,
        completed_at: null,
      };
      s.requests.unshift(r);
      save(s);
      return withNames(s, r);
    },
    async myRequests() {
      const p = me();
      if (!p) return [];
      const s = load();
      return s.requests.filter((r) => r.client_id === p.id || r.worker_id === p.id).map((r) => withNames(s, r));
    },
    async updateRequest(id, patch) {
      const p = need();
      const s = load();
      const r = s.requests.find((x) => x.id === id);
      if (!r) throw new Error("No encontramos esa solicitud.");
      const isWorker = r.worker_id === p.id;
      const worker = s.profiles.find((x) => x.id === r.worker_id);
      const to = patch.status ?? r.status;
      const ok = isWorker
        ? (r.status === "pendiente" && ["aceptada", "rechazada"].includes(to)) ||
          (r.status === "aceptada" && ["en_camino", "completada"].includes(to)) ||
          (r.status === "en_camino" && to === "completada") ||
          to === r.status
        : (r.status === "rechazada" && to === "pendiente") ||
          (to === "cancelada" && ["pendiente", "rechazada", "aceptada"].includes(r.status)) ||
          (!!worker?.is_demo && ["aceptada", "en_camino"].includes(r.status) && to === "completada") ||
          to === r.status;
      if (!ok) throw new Error(`Cambio de estado no permitido: ${r.status} → ${to}`);
      if (to === "aceptada" && r.status !== "aceptada") r.accepted_at = new Date().toISOString();
      if (to === "completada" && r.status !== "completada") {
        r.completed_at = new Date().toISOString();
        if (worker) worker.jobs_done += 1;
      }
      Object.assign(r, patch);
      if (patch.worker_id && s.profiles.find((x) => x.id === patch.worker_id)?.is_demo) {
        r.status = "aceptada";
        r.accepted_at = new Date().toISOString();
      }
      save(s);
    },
    async ratingsFor(requestId) {
      const p = me();
      return load().ratings.filter((x) => x.request_id === requestId && (x.revealed || x.rater_id === p?.id));
    },
    async rate(input) {
      const p = need();
      const s = load();
      const r = s.requests.find((x) => x.id === input.request_id);
      if (!r || r.status !== "completada") throw new Error("Solo se califica un trabajo completado.");
      if (s.ratings.some((x) => x.request_id === r.id && x.rater_id === p.id)) throw new Error("Ya calificaste este trabajo.");
      const mk = (rater: string, ratee: string, a: number, b: number, c: number, comment: string | null): Rating => ({
        id: uid(),
        request_id: r.id,
        rater_id: rater,
        ratee_id: ratee,
        s1: a,
        s2: b,
        s3: c,
        stars: Math.round(((a + b + c) / 3) * 100) / 100,
        comment,
        revealed: false,
        created_at: new Date().toISOString(),
      });
      s.ratings.push(mk(p.id, input.ratee_id, input.s1, input.s2, input.s3, input.comment || null));
      const worker = s.profiles.find((x) => x.id === r.worker_id);
      if (p.id === r.client_id && worker?.is_demo) {
        s.ratings.push(mk(worker.id, r.client_id, 5, 5, 4, "Cliente claro con lo que necesitaba y pagó a tiempo."));
      }
      const pair = s.ratings.filter((x) => x.request_id === r.id);
      if (pair.length === 2 && !pair[0].revealed) {
        pair.forEach((x) => {
          x.revealed = true;
          const ratee = s.profiles.find((pp) => pp.id === x.ratee_id)!;
          ratee.rating_sum += x.stars;
          ratee.rating_count += 1;
        });
      }
      save(s);
    },
    async reviewsOf(profileId) {
      return load().ratings.filter((x) => x.ratee_id === profileId && x.revealed).slice(-10).reverse();
    },
    async counterpartPhone(requestId) {
      const p = me();
      const s = load();
      const r = s.requests.find((x) => x.id === requestId);
      if (!p || !r || !["aceptada", "en_camino", "completada"].includes(r.status)) return null;
      const other = r.client_id === p.id ? r.worker_id : r.client_id;
      return other ? (s.contacts[other] ?? null) : null;
    },
    async demand(oficio: OficioId) {
      const rand = rng(oficio.length * 9973 + 7);
      const rows: DemandRow[] = DEMAND_WEIGHTS.map(([district, lat, lng, w]) => {
        const total = Math.max(1, Math.round(w * OFICIO_FACTOR[oficio] * (0.6 + rand()) * 1.6));
        const manana = Math.round(total * (0.3 + rand() * 0.2));
        const tarde = Math.round((total - manana) * (0.5 + rand() * 0.3));
        return { district, lat, lng, total, manana, tarde, noche: total - manana - tarde };
      });
      // Suma también las solicitudes reales hechas en este navegador.
      load().requests.filter((r) => r.oficio === oficio).forEach((r) => {
        const row = rows.find((x) => x.district === r.district);
        const h = new Date(r.created_at).getHours();
        const slot = h >= 6 && h < 12 ? "manana" : h >= 12 && h < 18 ? "tarde" : "noche";
        if (row) {
          row.total++;
          row[slot]++;
        } else rows.push({ district: r.district, lat: r.lat, lng: r.lng, total: 1, manana: +(slot === "manana"), tarde: +(slot === "tarde"), noche: +(slot === "noche") });
      });
      return rows.sort((a, b) => b.total - a.total);
    },
    async demoAccounts() {
      return load().profiles.filter((p) => !p.is_demo);
    },
    async demoLogin(profileId) {
      const s = load();
      s.session = profileId;
      save(s);
      emit();
    },
  };
}

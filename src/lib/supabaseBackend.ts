import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { districtByName, SITE_URL } from "./data";
import type { Backend, DemandRow, PortfolioItem, Profile, Rating, Request } from "./types";

const REQ_SELECT =
  "*, client:profiles!requests_client_id_fkey(full_name,district), worker:profiles!requests_worker_id_fkey(full_name,oficio,rating_sum,rating_count,is_demo)";

function fail(error: { message: string } | null) {
  if (error) throw new Error(translate(error.message));
}

function translate(msg: string) {
  if (/Invalid login credentials/i.test(msg)) return "Correo o contraseña incorrectos.";
  if (/already registered/i.test(msg)) return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (/Password should be at least/i.test(msg)) return "La contraseña debe tener al menos 6 caracteres.";
  if (/Email not confirmed/i.test(msg)) return "Confirma tu correo: te enviamos un enlace.";
  if (/rate limit/i.test(msg)) return "Demasiados intentos. Espera un minuto y vuelve a probar.";
  if (/Failed to fetch|NetworkError|Load failed/i.test(msg)) return "No hay conexión. Revisa tus datos o tu wifi y vuelve a intentar.";
  if (/exceeded the maximum allowed size|Payload too large/i.test(msg)) return "La foto pesa demasiado. Prueba con otra.";
  return msg;
}

const BUCKET = "portafolio";

export function createSupabaseBackend(url: string, key: string): Backend {
  const sb: SupabaseClient = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  const publicUrl = (path: string) => sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  let cached: { authId: string; profile: Profile } | null = null;

  async function me(): Promise<Profile | null> {
    const { data } = await sb.auth.getUser();
    const uid = data.user?.id;
    if (!uid) return (cached = null);
    if (cached?.authId === uid) return cached.profile;
    const { data: p, error } = await sb.from("profiles").select("*").eq("auth_id", uid).maybeSingle();
    fail(error);
    if (!p) return null;
    cached = { authId: uid, profile: p as Profile };
    return cached.profile;
  }

  return {
    mode: "supabase",
    async currentProfile() {
      cached = null;
      return me();
    },
    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange(() => {
        cached = null;
        cb();
      });
      return () => data.subscription.unsubscribe();
    },
    async signUp(input) {
      const d = districtByName(input.district);
      const { data, error } = await sb.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: `${SITE_URL}/app`,
          data: {
            role: input.role,
            full_name: input.full_name,
            phone: input.phone,
            district: input.district,
            lat: d?.lat,
            lng: d?.lng,
            oficio: input.oficio ?? null,
            years_exp: input.years_exp ?? null,
            bio: input.bio ?? null,
            price_from: input.price_from ?? null,
          },
        },
      });
      fail(error);
      return { needsConfirm: !data.session };
    },
    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      fail(error);
    },
    async signOut() {
      cached = null;
      await sb.auth.signOut();
    },
    async listWorkers(oficio) {
      let q = sb.from("profiles").select("*").eq("role", "trabajador");
      if (oficio) q = q.eq("oficio", oficio);
      const { data, error } = await q;
      fail(error);
      return (data ?? []) as Profile[];
    },
    async covers(ids) {
      if (!ids.length) return {};
      const { data, error } = await sb
        .from("portfolio_items")
        .select("profile_id,path,created_at")
        .in("profile_id", ids)
        .order("created_at", { ascending: false });
      if (error) return {}; // la migración 002 aún no corre: sin fotos, sin romper nada
      const out: Record<string, string> = {};
      for (const r of data ?? []) if (!out[r.profile_id]) out[r.profile_id] = publicUrl(r.path);
      return out;
    },
    async portfolioOf(profileId) {
      const { data, error } = await sb
        .from("portfolio_items")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });
      if (error) return [];
      return (data ?? []).map((r) => ({ ...r, url: publicUrl(r.path) })) as PortfolioItem[];
    },
    async addPortfolio(file, caption) {
      const p = await me();
      const { data: u } = await sb.auth.getUser();
      if (!p || !u.user) throw new Error("Inicia sesión primero.");
      const path = `${u.user.id}/${crypto.randomUUID()}.jpg`;
      const up = await sb.storage.from(BUCKET).upload(path, file, { contentType: "image/jpeg", upsert: false });
      fail(up.error);
      const { error } = await sb.from("portfolio_items").insert({ profile_id: p.id, path, caption: caption.trim() || null });
      if (error) {
        await sb.storage.from(BUCKET).remove([path]);
        fail(error);
      }
    },
    async removePortfolio(item) {
      const { error } = await sb.from("portfolio_items").delete().eq("id", item.id);
      fail(error);
      await sb.storage.from(BUCKET).remove([item.path]);
    },
    async updateMyProfile(patch) {
      const p = await me();
      if (!p) throw new Error("Inicia sesión primero.");
      const { error } = await sb.from("profiles").update(patch).eq("id", p.id);
      fail(error);
      cached = null;
    },
    async createRequest(input) {
      const p = await me();
      if (!p) throw new Error("Inicia sesión primero.");
      const d = districtByName(input.district)!;
      const { data, error } = await sb
        .from("requests")
        .insert({ ...input, client_id: p.id, lat: d.lat, lng: d.lng, status: "pendiente" })
        .select(REQ_SELECT)
        .single();
      fail(error);
      return data as Request;
    },
    async myRequests() {
      const { data, error } = await sb.from("requests").select(REQ_SELECT).order("created_at", { ascending: false });
      fail(error);
      return (data ?? []) as Request[];
    },
    async updateRequest(id, patch) {
      const { error } = await sb.from("requests").update(patch).eq("id", id);
      fail(error);
    },
    async ratingsFor(requestId) {
      const { data, error } = await sb.from("ratings").select("*").eq("request_id", requestId);
      fail(error);
      return (data ?? []) as Rating[];
    },
    async rate(input) {
      const p = await me();
      if (!p) throw new Error("Inicia sesión primero.");
      const { error } = await sb.from("ratings").insert({ ...input, rater_id: p.id, comment: input.comment || null });
      fail(error);
      cached = null;
    },
    async reviewsOf(profileId) {
      const { data, error } = await sb
        .from("ratings")
        .select("*")
        .eq("ratee_id", profileId)
        .eq("revealed", true)
        .order("created_at", { ascending: false })
        .limit(10);
      fail(error);
      return (data ?? []) as Rating[];
    },
    async counterpartPhone(requestId) {
      const { data, error } = await sb.rpc("counterpart_contact", { p_request: requestId });
      fail(error);
      return (data as string) ?? null;
    },
    async demand(oficio) {
      const { data, error } = await sb.rpc("demand_by_district", { p_oficio: oficio });
      fail(error);
      return ((data ?? []) as DemandRow[]).map((r) => ({ ...r, total: Number(r.total), manana: Number(r.manana), tarde: Number(r.tarde), noche: Number(r.noche) }));
    },
  };
}

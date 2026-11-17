"use client";
import { useState } from "react";
import { DISTRICTS, OFICIOS, URGENCIAS, districtByName, type OficioId, type Urgency } from "@/lib/data";
import { rankWorkers, ratingOf, type MatchResult } from "@/lib/match";
import type { Backend, Profile } from "@/lib/types";
import { initials } from "../Site";

export default function NewRequest({
  backend,
  profile,
  initialOficio,
  onSent,
}: {
  backend: Backend;
  profile: Profile;
  initialOficio?: OficioId;
  onSent: () => void;
}) {
  const [oficio, setOficio] = useState<OficioId>(initialOficio && OFICIOS.some((o) => o.id === initialOficio) ? initialOficio : "electricista");
  const [district, setDistrict] = useState(profile.district);
  const [urgency, setUrgency] = useState<Urgency>("hoy");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState<MatchResult<Profile>[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function findMatches(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const workers = (await backend.listWorkers(oficio)).filter((w) => w.id !== profile.id);
      setResults(rankWorkers(workers, districtByName(district)!, urgency).slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos buscar trabajadores.");
    } finally {
      setBusy(false);
    }
  }

  async function send(m: MatchResult<Profile>) {
    setBusy(true);
    setError("");
    try {
      await backend.createRequest({ worker_id: m.worker.id, oficio, description: description.trim(), district, urgency, match_score: Math.round(m.score) });
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
      setBusy(false);
    }
  }

  const of = OFICIOS.find((o) => o.id === oficio)!;

  if (results)
    return (
      <div className="stack">
        <div>
          <h1 className="h-app">Tu match</h1>
          <p className="sub-app">
            {of.plural} cerca de {district}, para {URGENCIAS.find((u) => u.id === urgency)!.label.toLowerCase()}.{" "}
            {URGENCIAS.find((u) => u.id === urgency)!.hint}.
          </p>
        </div>
        {results.length === 0 && (
          <div className="card empty">
            <p>Todavía no hay {of.plural.toLowerCase()} registrados. Prueba con otro oficio.</p>
          </div>
        )}
        <ol className="result-list">
          {results.map((r) => (
            <li key={r.worker.id} className="result" style={{ gridTemplateColumns: "44px 1fr auto" }}>
              <span className="avatar" aria-hidden="true">
                {initials(r.worker.full_name)}
              </span>
              <div>
                <div className="result-name">{r.worker.full_name}</div>
                <div className="result-meta">
                  {r.worker.district}, a {r.km.toFixed(1)} km
                  <br />
                  {r.worker.rating_count ? `★ ${ratingOf(r.worker).toFixed(1)} en ${r.worker.jobs_done} trabajos` : "Nuevo en OfiMatch"},{" "}
                  {r.worker.years_exp ?? 0} años de experiencia
                </div>
              </div>
              <div className="score">
                {Math.round(r.score)}
                <small>de 100</small>
              </div>
              <div className="bar" aria-label={`Cercanía ${Math.round(r.parts.prox)}, reputación ${Math.round(r.parts.rep)}, disponibilidad ${Math.round(r.parts.disp)}`}>
                <i className="p" style={{ width: `${r.parts.prox}%` }} />
                <i className="r" style={{ width: `${r.parts.rep}%` }} />
                <i className="d" style={{ width: `${r.parts.disp}%` }} />
              </div>
              {r.worker.bio && (
                <p className="muted" style={{ gridColumn: "1 / -1" }}>
                  {r.worker.bio}
                </p>
              )}
              <div style={{ gridColumn: "1 / -1" }} className="row">
                <span className="muted">{r.worker.available ? "Disponible ahora" : "Ocupado por ahora"}{r.worker.is_demo ? ", perfil de demostración" : ""}</span>
                <button className="btn btn-primary btn-s" style={{ marginLeft: "auto", flex: "none" }} disabled={busy} onClick={() => send(r)}>
                  Enviar solicitud
                </button>
              </div>
            </li>
          ))}
        </ol>
        <div className="legend">
          <span style={{ ["--c" as string]: "var(--turquesa)" }}>Cercanía</span>
          <span style={{ ["--c" as string]: "var(--amarillo)" }}>Reputación</span>
          <span style={{ ["--c" as string]: "var(--overol-300)" }}>Disponibilidad</span>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-ghost" onClick={() => setResults(null)}>
          Cambiar mi pedido
        </button>
      </div>
    );

  return (
    <form className="stack" onSubmit={findMatches}>
      <div>
        <h1 className="h-app">¿Qué necesitas, {profile.full_name.split(" ")[0]}?</h1>
        <p className="sub-app">Te mostramos a los trabajadores que mejor encajan con tu pedido.</p>
      </div>
      <div className="field">
        <span>Oficio</span>
        <div className="chips" role="group" aria-label="Oficio">
          {OFICIOS.map((o) => (
            <button type="button" key={o.id} className="chip" aria-pressed={oficio === o.id} onClick={() => setOficio(o.id)}>
              {o.singular}
            </button>
          ))}
        </div>
      </div>
      <label className="field">
        <span>Describe el problema</span>
        <textarea
          className="input"
          required
          minLength={5}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Ej.: ${of.trabajos[0].toLowerCase()}`}
        />
      </label>
      <label className="field">
        <span>¿Dónde?</span>
        <select className="input" value={district} onChange={(e) => setDistrict(e.target.value)}>
          {DISTRICTS.map((d) => (
            <option key={d.name}>{d.name}</option>
          ))}
        </select>
      </label>
      <div className="field">
        <span>¿Para cuándo?</span>
        <div className="seg" role="group" aria-label="Urgencia">
          {URGENCIAS.map((u) => (
            <button type="button" key={u.id} aria-pressed={urgency === u.id} onClick={() => setUrgency(u.id)}>
              {u.label}
            </button>
          ))}
        </div>
        <small>{URGENCIAS.find((u) => u.id === urgency)!.hint}.</small>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? "Buscando…" : "Ver mi match"}
      </button>
    </form>
  );
}

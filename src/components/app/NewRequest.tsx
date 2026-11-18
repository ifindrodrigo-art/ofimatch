"use client";
import { useState } from "react";
import { DISTRICTS, OFICIOS, URGENCIAS, districtByName, oficioById, type OficioId, type Urgency } from "@/lib/data";
import { rankWorkers, type MatchResult } from "@/lib/match";
import { avatarColor, badgeOf, initials, ratingText, soles } from "@/lib/people";
import type { Backend, Profile } from "@/lib/types";
import { Icon } from "../site/Icons";
import Illus from "../site/Illus";
import PortfolioSheet from "./PortfolioSheet";

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
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [sheet, setSheet] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const of = oficioById(oficio)!;
  const u = URGENCIAS.find((x) => x.id === urgency)!;

  async function findMatches(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (description.trim().length < 5) {
      setError("Cuéntanos el problema en una línea (mínimo 5 letras).");
      return;
    }
    setBusy(true);
    try {
      const workers = (await backend.listWorkers(oficio)).filter((w) => w.id !== profile.id);
      const ranked = rankWorkers(workers, districtByName(district)!, urgency).slice(0, 6);
      setResults(ranked);
      backend.covers(ranked.map((r) => r.worker.id)).then(setCovers).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos buscar técnicos.");
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

  if (results)
    return (
      <div className="stack">
        <div>
          <h1 className="h-app">Tu match</h1>
          <p className="sub-app">
            {of.plural} cerca de {district}, para {u.label.toLowerCase()}. {u.hint}.
          </p>
        </div>
        {results.length === 0 ? (
          <div className="empty-app">
            <Icon name="search" />
            <p>Todavía no hay {of.plural.toLowerCase()} registrados. Prueba con otro oficio o vuelve más tarde.</p>
          </div>
        ) : (
          <>
            <div className="legend" aria-hidden="true">
              <span style={{ ["--c" as string]: "var(--cyan)" }}>Cercanía</span>
              <span style={{ ["--c" as string]: "var(--brand)" }}>Reputación</span>
              <span style={{ ["--c" as string]: "#a5b4fc" }}>Disponibilidad</span>
            </div>
            <ol className="match-list">
              {results.map((r, i) => {
                const w = r.worker;
                const badge = badgeOf(w);
                const first = w.full_name.split(" ")[0];
                return (
                  <li key={w.id} className={`mcard${i === 0 ? " best" : ""}`}>
                    <Illus icon={of.icon} tint={of.tint} pattern={oficio === "electricista" ? "grid" : ""} chip={w.work_label} photo={covers[w.id]} photoAlt={`Trabajo de ${w.full_name}`}>
                      {w.available && (
                        <span className="gig-avail">
                          <i />
                          Disponible ahora
                        </span>
                      )}
                    </Illus>
                    <div className="mcard-body">
                      <div className="mcard-top">
                        <span className="avatar lg" style={{ ["--av" as string]: avatarColor(w.full_name) }}>
                          {initials(w.full_name)}
                        </span>
                        <div>
                          <strong>{w.full_name}</strong>
                          <span>
                            {r.km < 0.3 ? `${w.district}, tu mismo distrito` : `${w.district}, a ${r.km.toFixed(1)} km`}
                            {badge ? `, ${badge.text.toLowerCase()}` : ""}
                          </span>
                        </div>
                        <div className="score">
                          <b>{Math.round(r.score)}</b>
                          <small>de 100</small>
                        </div>
                      </div>
                      <div
                        className="scorebar"
                        role="img"
                        aria-label={`Cercanía ${Math.round(r.parts.prox)}, reputación ${Math.round(r.parts.rep)}, disponibilidad ${Math.round(r.parts.disp)} puntos`}
                      >
                        <i className="p" style={{ width: `${r.parts.prox}%` }} />
                        <i className="r" style={{ width: `${r.parts.rep}%` }} />
                        <i className="d" style={{ width: `${r.parts.disp}%` }} />
                      </div>
                      <div className="facts">
                        <span>
                          <Icon name="star" className="ico star" />
                          {w.rating_count ? `${ratingText(w)} (${w.rating_count})` : "Sin reseñas aún"}
                        </span>
                        <span>
                          <Icon name="check" />
                          {w.jobs_done} trabajos
                        </span>
                        <span>
                          <Icon name="wallet" />
                          {w.price_from ? `Desde ${soles(w.price_from)}` : "Precio a coordinar"}
                        </span>
                      </div>
                      {w.bio && <p className="mcard-bio">{w.bio}</p>}
                      {w.is_demo && <span className="badge-demo">Perfil de demostración: acepta solo.</span>}
                      <div className="row">
                        <button type="button" className="btn btn-outline" onClick={() => setSheet(w)}>
                          <Icon name="image" /> Ver trabajos
                        </button>
                        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => send(r)}>
                          Solicitar a {first}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-outline" type="button" onClick={() => setResults(null)}>
          Cambiar mi pedido
        </button>
        {sheet && <PortfolioSheet backend={backend} worker={sheet} onClose={() => setSheet(null)} />}
      </div>
    );

  return (
    <form className="stack" onSubmit={findMatches}>
      <div>
        <h1 className="h-app">¿Qué necesitas, {profile.full_name.split(" ")[0]}?</h1>
        <p className="sub-app">Te mostramos a los técnicos que mejor encajan con tu pedido.</p>
      </div>
      <div className="field">
        <span id="oficio-label">Oficio</span>
        <div className="trade-row" role="group" aria-labelledby="oficio-label">
          {OFICIOS.map((o) => (
            <button type="button" key={o.id} className="trade-chip" aria-pressed={oficio === o.id} onClick={() => setOficio(o.id)}>
              <Icon name={o.icon} />
              {o.area}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label htmlFor="r-desc">Describe el problema</label>
        <textarea id="r-desc" className="input" required minLength={5} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`Ej.: ${of.trabajos[0].toLowerCase()}`} />
      </div>
      <div className="field">
        <label htmlFor="r-district">¿Dónde?</label>
        <select id="r-district" className="input" value={district} onChange={(e) => setDistrict(e.target.value)}>
          {DISTRICTS.map((d) => (
            <option key={d.name}>{d.name}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <span id="urg-label">¿Para cuándo?</span>
        <div className="seg" role="group" aria-labelledby="urg-label">
          {URGENCIAS.map((x) => (
            <button type="button" key={x.id} aria-pressed={urgency === x.id} onClick={() => setUrgency(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <small>{u.hint}.</small>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
        {busy ? "Buscando…" : "Ver mi match"}
      </button>
    </form>
  );
}

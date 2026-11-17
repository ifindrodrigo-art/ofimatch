"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { DISTRICTS, OFICIOS, URGENCIAS, districtByName, type OficioId, type Urgency } from "@/lib/data";
import { rankWorkers, ratingOf } from "@/lib/match";
import { DEMO_WORKERS } from "@/lib/seed";
import { initials } from "./Site";

export default function Matcher({ initialOficio = "electricista" }: { initialOficio?: OficioId }) {
  const [oficio, setOficio] = useState<OficioId>(initialOficio);
  const [district, setDistrict] = useState("Lince");
  const [urgency, setUrgency] = useState<Urgency>("ahora");

  const results = useMemo(() => {
    const d = districtByName(district)!;
    return rankWorkers(
      DEMO_WORKERS.filter((w) => w.oficio === oficio),
      d,
      urgency,
    ).slice(0, 3);
  }, [oficio, district, urgency]);

  return (
    <section className="matcher" aria-labelledby="matcher-title">
      <h2 id="matcher-title">Prueba el match</h2>
      <p>Elige qué necesitas y dónde. El orden sale de la cercanía, la reputación y la disponibilidad.</p>
      <div className="matcher-controls">
        <div className="chips" role="group" aria-label="Oficio">
          {OFICIOS.map((o) => (
            <button key={o.id} type="button" className="chip" aria-pressed={oficio === o.id} onClick={() => setOficio(o.id)}>
              {o.singular}
            </button>
          ))}
        </div>
        <div className="matcher-row">
          <label className="field">
            <span>Tu distrito</span>
            <select className="input" value={district} onChange={(e) => setDistrict(e.target.value)}>
              {DISTRICTS.map((d) => (
                <option key={d.name}>{d.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>¿Para cuándo?</span>
            <select className="input" value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}>
              {URGENCIAS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <ol className="result-list" aria-live="polite">
        {results.map((r) => (
          <li key={r.worker.id} className="result">
            <span className="avatar" aria-hidden="true">
              {initials(r.worker.full_name)}
            </span>
            <div>
              <div className="result-name">{r.worker.full_name}</div>
              <div className="result-meta">
                {r.worker.district}, a {r.km.toFixed(1)} km
                <br />★ {ratingOf(r.worker).toFixed(1)} en {r.worker.rating_count} trabajos, {r.worker.available ? "disponible" : "ocupado ahora"}
              </div>
            </div>
            <div className="score">
              {Math.round(r.score)}
              <small>de 100</small>
            </div>
            <div className="bar" aria-hidden="true">
              <i className="p" style={{ width: `${r.parts.prox}%` }} />
              <i className="r" style={{ width: `${r.parts.rep}%` }} />
              <i className="d" style={{ width: `${r.parts.disp}%` }} />
            </div>
          </li>
        ))}
      </ol>
      <div className="legend">
        <span style={{ ["--c" as string]: "var(--turquesa)" }}>Cercanía</span>
        <span style={{ ["--c" as string]: "var(--amarillo)" }}>Reputación</span>
        <span style={{ ["--c" as string]: "var(--overol-300)" }}>Disponibilidad</span>
      </div>
      <Link href={`/app?oficio=${oficio}`} className="btn btn-primary btn-block" style={{ marginTop: 18 }}>
        Pedir un {OFICIOS.find((o) => o.id === oficio)!.singular.toLowerCase()}
      </Link>
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";
import { getBackend } from "@/lib/backend";
import { OFICIOS, oficioById, type OficioId } from "@/lib/data";
import type { DemandRow } from "@/lib/types";

const FRANJA = { manana: "Mañana", tarde: "Tarde", noche: "Noche" } as const;

export default function DemandCard() {
  const [oficio, setOficio] = useState<OficioId>("electricista");
  const [rows, setRows] = useState<DemandRow[] | null>(null);

  useEffect(() => {
    let alive = true;
    setRows(null);
    getBackend()
      .demand(oficio)
      .then((r) => alive && setRows(r))
      .catch(() => alive && setRows([]));
    return () => {
      alive = false;
    };
  }, [oficio]);

  const top = (rows ?? []).slice(0, 5);
  const max = Math.max(1, ...top.map((r) => r.total));
  const totals = (rows ?? []).reduce((a, r) => ({ manana: a.manana + r.manana, tarde: a.tarde + r.tarde, noche: a.noche + r.noche }), { manana: 0, tarde: 0, noche: 0 });
  const sum = totals.manana + totals.tarde + totals.noche;
  const peak = (Object.keys(totals) as (keyof typeof totals)[]).reduce((a, b) => (totals[a] >= totals[b] ? a : b));

  return (
    <div className="demand-card">
      <header>
        <div>
          <strong>Pedidos de {oficioById(oficio)!.plural.toLowerCase()}</strong>
          <span>Últimos 60 días en OfiMatch</span>
        </div>
        <label className="sr-only" htmlFor="demand-oficio">
          Oficio
        </label>
        <select id="demand-oficio" value={oficio} onChange={(e) => setOficio(e.target.value as OficioId)}>
          {OFICIOS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.area}
            </option>
          ))}
        </select>
      </header>
      <ul className="bars" aria-busy={!rows}>
        {(rows ? top : Array.from({ length: 5 }, (_, i) => ({ district: "Cargando…", total: 0, i }))).map((r, i) => (
          <li key={`${r.district}-${i}`}>
            <span>{r.district}</span>
            <span className="bar">
              <i style={{ ["--w" as string]: `${(r.total / max) * 100}%` }} />
            </span>
            <b>{rows ? r.total : ""}</b>
          </li>
        ))}
      </ul>
      <div className="slots" aria-label="Pedidos por franja horaria">
        {(Object.keys(FRANJA) as (keyof typeof FRANJA)[]).map((k) => (
          <div key={k} style={{ ["--a" as string]: sum ? 0.12 + (totals[k] / sum) * 0.75 : 0.12 }}>
            <span>{FRANJA[k]}</span>
            <b>{totals[k]}</b>
          </div>
        ))}
      </div>
      <div className="demand-foot">
        <span>
          Franja con más pedidos: <b>{sum ? FRANJA[peak].toLowerCase() : "sin datos"}</b>
        </span>
        <span>
          Distrito líder: <b>{top[0]?.district ?? "sin datos"}</b>
        </span>
      </div>
    </div>
  );
}

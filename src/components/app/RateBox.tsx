"use client";
import { useCallback, useEffect, useState } from "react";
import type { Backend, Profile, Rating, Request } from "@/lib/types";
import { Icon } from "../site/Icons";

const CRITERIA = {
  cliente: ["Puntualidad", "Calidad del trabajo", "Trato"], // cliente califica al trabajador
  trabajador: ["Pago a tiempo", "Claridad del pedido", "Trato"], // trabajador califica al cliente
};

function Stars({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="stars-input" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} de 5`} className={n <= value ? "on" : ""} onClick={() => onChange(n)}>
          <Icon name="star" className="ico star" />
        </button>
      ))}
    </div>
  );
}

export default function RateBox({ backend, profile, request, otherName }: { backend: Backend; profile: Profile; request: Request; otherName: string }) {
  const [ratings, setRatings] = useState<Rating[] | null>(null);
  const [s, setS] = useState([0, 0, 0]);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isClient = request.client_id === profile.id;
  const crit = CRITERIA[isClient ? "cliente" : "trabajador"];
  const first = otherName.split(" ")[0];

  const load = useCallback(() => backend.ratingsFor(request.id).then(setRatings).catch(() => setRatings([])), [backend, request.id]);
  useEffect(() => {
    load();
  }, [load]);

  const mine = ratings?.find((x) => x.rater_id === profile.id);
  const theirs = ratings?.find((x) => x.rater_id !== profile.id);

  useEffect(() => {
    if (!mine || mine.revealed) return;
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [mine, load]);

  if (!ratings) return null;

  if (mine && mine.revealed && theirs)
    return (
      <div className="stack">
        <p className="muted">Calificaciones reveladas a la vez:</p>
        <div className="reveal">
          <div>
            <b>Tú calificaste a {first}</b>
            <span className="big">{Number(mine.stars).toFixed(1)} / 5</span>
          </div>
          <div>
            <b>{first} te calificó</b>
            <span className="big">{Number(theirs.stars).toFixed(1)} / 5</span>
            {theirs.comment && <p className="muted">“{theirs.comment}”</p>}
          </div>
        </div>
      </div>
    );

  if (mine)
    return (
      <div className="sealed">
        <span className="lock">
          <Icon name="lock" />
        </span>
        <span>
          Tu calificación está guardada en sobre cerrado. Se revela cuando {first} también califique.
        </span>
      </div>
    );

  async function submit() {
    setBusy(true);
    setError("");
    try {
      await backend.rate({
        request_id: request.id,
        ratee_id: isClient ? request.worker_id! : request.client_id,
        s1: s[0],
        s2: s[1],
        s3: s[2],
        comment: comment.trim(),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la calificación.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <h3>Califica a {first}</h3>
      {crit.map((c, i) => (
        <div className="crit" key={c}>
          <span>{c}</span>
          <Stars label={c} value={s[i]} onChange={(n) => setS((prev) => prev.map((v, j) => (j === i ? n : v)))} />
        </div>
      ))}
      <label className="field">
        <span>Comentario (opcional)</span>
        <input className="input" maxLength={300} value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <p className="muted">{first} no verá tu nota hasta calificarte, y tú tampoco verás la suya antes.</p>
      {error && <p className="error">{error}</p>}
      <button className="btn btn-primary" disabled={busy || s.some((v) => !v)} onClick={submit}>
        Enviar calificación
      </button>
    </div>
  );
}

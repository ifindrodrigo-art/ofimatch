"use client";
import { useEffect, useState } from "react";
import { oficioById } from "@/lib/data";
import { ratingOf } from "@/lib/match";
import type { Backend, Profile, Rating } from "@/lib/types";
import { initials } from "../Site";

export default function ProfileView({ backend, profile, onChange }: { backend: Backend; profile: Profile; onChange: () => void }) {
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [busy, setBusy] = useState(false);
  const isWorker = profile.role === "trabajador";

  useEffect(() => {
    backend.reviewsOf(profile.id).then(setReviews).catch(() => {});
  }, [backend, profile.id, profile.rating_count]);

  async function toggle(available: boolean) {
    setBusy(true);
    try {
      await backend.updateMyProfile({ available });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <span className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>
          {initials(profile.full_name)}
        </span>
        <div>
          <h1 className="h-app">{profile.full_name}</h1>
          <p className="sub-app">
            {isWorker ? `${oficioById(profile.oficio ?? "")?.singular ?? "Trabajador"} en ${profile.district}` : `Cliente en ${profile.district}`}
          </p>
        </div>
      </div>

      {isWorker && (
        <label className="switch">
          <span>
            <b>{profile.available ? "Disponible para trabajos" : "No disponible"}</b>
            <br />
            <span className="muted">Si estás disponible, subes en el match de pedidos urgentes.</span>
          </span>
          <input type="checkbox" checked={profile.available} disabled={busy} onChange={(e) => toggle(e.target.checked)} aria-label="Disponibilidad" />
        </label>
      )}

      <div className="reveal">
        <div>
          <b>Calificación</b>
          <span className="big">{profile.rating_count ? `★ ${ratingOf(profile).toFixed(1)}` : "Nuevo"}</span>
          <span className="muted">{profile.rating_count} calificaciones</span>
        </div>
        <div>
          <b>{isWorker ? "Trabajos completados" : "Tipo de cuenta"}</b>
          <span className="big" style={{ color: "var(--overol)" }}>
            {isWorker ? profile.jobs_done : "Cliente"}
          </span>
          {isWorker && <span className="muted">{profile.years_exp ?? 0} años de experiencia</span>}
        </div>
      </div>

      {profile.bio && <p>{profile.bio}</p>}

      <div className="card">
        <h3>Lo que dicen de ti</h3>
        {reviews.length === 0 ? (
          <p className="muted">Cuando completes un trabajo y ambos califiquen, las reseñas aparecen aquí.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review">
              <b>★ {Number(r.stars).toFixed(1)}</b> {r.comment || <span className="muted">Sin comentario</span>}
            </div>
          ))
        )}
      </div>

      <button className="btn btn-ghost" onClick={() => backend.signOut().then(onChange)}>
        Cerrar sesión
      </button>
    </div>
  );
}

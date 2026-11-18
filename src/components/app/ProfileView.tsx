"use client";
import { useCallback, useEffect, useState } from "react";
import { oficioById } from "@/lib/data";
import { shrinkImage } from "@/lib/image";
import { ratingOf } from "@/lib/match";
import { avatarColor, initials, soles } from "@/lib/people";
import type { Backend, PortfolioItem, Profile, Rating } from "@/lib/types";
import { Icon } from "../site/Icons";

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
      <div className="profile-head">
        <span className="avatar xl" style={{ ["--av" as string]: avatarColor(profile.full_name) }}>
          {initials(profile.full_name)}
        </span>
        <div>
          <h1 className="h-app">{profile.full_name}</h1>
          <p className="sub-app">
            {isWorker ? `${oficioById(profile.oficio ?? "")?.singular ?? "Técnico"} en ${profile.district}` : `Cliente en ${profile.district}`}
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

      <div className="stat-pair">
        <div>
          <b>Calificación</b>
          <span className="big">{profile.rating_count ? `${ratingOf(profile).toFixed(1)} / 5` : "Nuevo"}</span>
          <span className="muted">{profile.rating_count} calificaciones</span>
        </div>
        <div>
          <b>{isWorker ? "Trabajos completados" : "Tipo de cuenta"}</b>
          <span className="big">{isWorker ? profile.jobs_done : "Cliente"}</span>
          {isWorker && <span className="muted">{profile.years_exp ?? 0} años de experiencia</span>}
        </div>
      </div>

      {isWorker && <PriceEditor backend={backend} profile={profile} onSaved={onChange} />}
      {isWorker && <PortfolioManager backend={backend} profile={profile} />}

      <div className="panel">
        <h3>Lo que dicen de ti</h3>
        {reviews.length === 0 ? (
          <p className="muted">Cuando completes un trabajo y ambos califiquen, las reseñas aparecen aquí.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review">
              <b>{Number(r.stars).toFixed(1)} / 5</b> {r.comment || <span className="muted">Sin comentario</span>}
            </div>
          ))
        )}
      </div>

      <button type="button" className="btn btn-outline" onClick={() => backend.signOut().then(onChange)}>
        Cerrar sesión
      </button>
    </div>
  );
}

function PriceEditor({ backend, profile, onSaved }: { backend: Backend; profile: Profile; onSaved: () => void }) {
  const [price, setPrice] = useState(profile.price_from ? String(profile.price_from) : "");
  const [work, setWork] = useState(profile.work_label ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const dirty = price !== String(profile.price_from ?? "") || work !== (profile.work_label ?? "") || bio !== (profile.bio ?? "");

  const edit = (fn: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    fn(e.target.value);
    setState("idle");
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const n = Number(price);
    if (!(n > 0)) {
      setError("Pon tu precio desde en soles, por ejemplo 60.");
      return;
    }
    setState("saving");
    try {
      await backend.updateMyProfile({ price_from: n, work_label: work.trim() || null, bio: bio.trim() || null });
      setState("saved");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
      setState("idle");
    }
  }

  return (
    <form className="panel" onSubmit={save}>
      <h3>Tu tarjeta</h3>
      <p className="muted">
        Así te ven los clientes: {price ? `desde ${soles(Number(price) || 0)}` : "sin precio"}
        {work ? `, ${work}` : ""}.
      </p>
      <div className="field">
        <label htmlFor="p-price">Precio desde (S/)</label>
        <input id="p-price" className="input" type="number" min={1} inputMode="numeric" style={{ maxWidth: 180 }} value={price} onChange={edit(setPrice)} />
      </div>
      <div className="field">
        <label htmlFor="p-work">Trabajo destacado</label>
        <input id="p-work" className="input" maxLength={60} placeholder="Tablero domiciliario" value={work} onChange={edit(setWork)} />
        <small>Aparece como etiqueta sobre tu foto.</small>
      </div>
      <div className="field">
        <label htmlFor="p-bio">Descripción</label>
        <textarea id="p-bio" className="input" maxLength={400} value={bio} onChange={edit(setBio)} />
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-dark" disabled={!dirty || state === "saving"}>
        {state === "saving" ? "Guardando…" : state === "saved" && !dirty ? "Guardado" : "Guardar cambios"}
      </button>
    </form>
  );
}

function PortfolioManager({ backend, profile }: { backend: Backend; profile: Profile }) {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => backend.portfolioOf(profile.id).then(setItems).catch(() => setItems([])), [backend, profile.id]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(null), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  function pick(f: File | undefined) {
    setError("");
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function discard() {
    setFile(null);
    setPreview(null);
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await shrinkImage(file);
      await backend.addPortfolio(blob, caption);
      discard();
      setCaption("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(it: PortfolioItem) {
    if (armed !== it.id) {
      setArmed(it.id);
      return;
    }
    setArmed(null);
    setBusy(true);
    try {
      await backend.removePortfolio(it);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo borrar la foto.");
    } finally {
      setBusy(false);
    }
  }

  const count = items?.length ?? 0;

  return (
    <section className="panel" aria-labelledby="pf-title">
      <h3 id="pf-title">Fotos de tus trabajos</h3>
      <p className="muted">La foto más reciente aparece en tu tarjeta. Puedes tener hasta 12 ({count} de 12).</p>
      {items && items.length > 0 && (
        <div className="gallery">
          {items.map((it) => (
            <figure key={it.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt={it.caption || "Foto de trabajo"} loading="lazy" />
              {armed === it.id ? <figcaption>Toca otra vez para borrar</figcaption> : it.caption ? <figcaption>{it.caption}</figcaption> : null}
              <button
                type="button"
                className="del"
                aria-label={armed === it.id ? "Confirmar: borrar esta foto" : `Borrar foto${it.caption ? `: ${it.caption}` : ""}`}
                disabled={busy}
                onClick={() => remove(it)}
              >
                <Icon name={armed === it.id ? "check" : "trash"} />
              </button>
            </figure>
          ))}
        </div>
      )}
      {count < 12 && (
        <div className="add-photo">
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="preview" src={preview} alt="Vista previa de la foto elegida" />
              <div className="field">
                <label htmlFor="pf-cap">¿Qué trabajo es? (opcional)</label>
                <input id="pf-cap" className="input" maxLength={80} placeholder="Tablero instalado en Surco" value={caption} onChange={(e) => setCaption(e.target.value)} />
              </div>
              <div className="row">
                <button type="button" className="btn btn-outline" disabled={busy} onClick={discard}>
                  Elegir otra
                </button>
                <button type="button" className="btn btn-primary" disabled={busy} onClick={upload}>
                  {busy ? "Subiendo…" : "Subir foto"}
                </button>
              </div>
            </>
          ) : (
            <label className="btn btn-outline btn-block file-btn">
              <Icon name="camera" /> Agregar foto
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => pick(e.target.files?.[0])} />
            </label>
          )}
        </div>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

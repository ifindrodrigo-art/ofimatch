"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getBackend } from "@/lib/backend";
import { DISTRICTS, OFICIOS, districtByName, oficioById, type OficioId } from "@/lib/data";
import { rankWorkers } from "@/lib/match";
import { avatarColor, badgeOf, initials, ratingText, roleOf, soles } from "@/lib/people";
import { onSearch } from "@/lib/searchBus";
import { DEMO_WORKERS } from "@/lib/seed";
import type { Profile } from "@/lib/types";
import { Icon } from "./Icons";
import Illus from "./Illus";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const PAGE = 8;

function haystack(w: Profile) {
  const o = oficioById(w.oficio ?? "");
  return norm([w.full_name, w.district, w.bio, w.work_label, o?.area, o?.singular, o?.keywords].join(" "));
}

export default function WorkersSection({ fixedTrade }: { fixedTrade?: OficioId }) {
  const [workers, setWorkers] = useState<Profile[]>(() => DEMO_WORKERS.filter((w) => !fixedTrade || w.oficio === fixedTrade));
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [trade, setTrade] = useState<OficioId | "todos">(fixedTrade ?? "todos");
  const [q, setQ] = useState("");
  const [near, setNear] = useState("Surquillo");
  const [shown, setShown] = useState(PAGE);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pq = params.get("q");
    const po = params.get("oficio") as OficioId | null;
    if (pq) setQ(pq);
    if (po && OFICIOS.some((o) => o.id === po) && !fixedTrade) setTrade(po);
    try {
      const n = localStorage.getItem("ofimatch-cerca");
      if (n && districtByName(n)) setNear(n);
      setFavs(JSON.parse(localStorage.getItem("ofimatch-favoritos") || "[]"));
    } catch {}
    return onSearch((d) => {
      if (d.trade !== undefined && !fixedTrade) setTrade(d.trade);
      if (d.q !== undefined) setQ(d.q);
      if (d.trade !== undefined && d.q === undefined) setQ("");
      if (d.q !== undefined && d.trade === undefined && !fixedTrade) setTrade("todos");
      setShown(PAGE);
    });
  }, [fixedTrade]);

  useEffect(() => {
    const b = getBackend();
    let alive = true;
    b.listWorkers(fixedTrade)
      .then(async (list) => {
        if (!alive || !list.length) return;
        setWorkers(list);
        const c = await b.covers(list.map((w) => w.id));
        if (alive) setCovers(c);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [fixedTrade]);

  const list = useMemo(() => {
    const words = norm(q.trim())
      .split(/\s+/)
      .filter((x) => x.length > 2);
    const filtered = workers.filter((w) => {
      if (trade !== "todos" && w.oficio !== trade) return false;
      if (!words.length) return true;
      const hay = haystack(w);
      return words.some((x) => hay.includes(x));
    });
    return rankWorkers(filtered, districtByName(near) ?? DISTRICTS[0], "hoy");
  }, [workers, trade, q, near]);

  const toggleFav = (id: string) =>
    setFavs((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      try {
        localStorage.setItem("ofimatch-favoritos", JSON.stringify(next));
      } catch {}
      return next;
    });

  const cleanQ = q.replace(/[<>&"]/g, "");

  return (
    <>
      {!fixedTrade && (
        <div className="chips" role="group" aria-label="Filtrar por oficio">
          <button type="button" className="chip-btn" aria-pressed={trade === "todos"} onClick={() => (setTrade("todos"), setQ(""), setShown(PAGE))}>
            Todos
          </button>
          {OFICIOS.map((o) => (
            <button key={o.id} type="button" className="chip-btn" aria-pressed={trade === o.id} onClick={() => (setTrade(o.id), setQ(""), setShown(PAGE))}>
              {o.area}
            </button>
          ))}
        </div>
      )}
      <div className="result-note">
        <label className="near">
          Cerca de
          <select
            value={near}
            onChange={(e) => {
              setNear(e.target.value);
              try {
                localStorage.setItem("ofimatch-cerca", e.target.value);
              } catch {}
            }}
          >
            {DISTRICTS.map((d) => (
              <option key={d.name}>{d.name}</option>
            ))}
          </select>
        </label>
        <span aria-live="polite">
          {q ? (
            <>
              {list.length} {list.length === 1 ? "técnico" : "técnicos"} para “{cleanQ}”, ordenados por match.
            </>
          ) : (
            <>Ordenados por match: cercanía, reputación y disponibilidad.</>
          )}
        </span>
        {q && (
          <button type="button" onClick={() => setQ("")}>
            Limpiar búsqueda
          </button>
        )}
      </div>

      <div className="workers">
        {list.length === 0 ? (
          <div className="empty">
            <strong>No encontramos técnicos para “{cleanQ}”</strong>
            Prueba con el nombre del oficio, como gasfitería o electricidad.
            <button className="btn btn-outline" type="button" onClick={() => (setQ(""), setTrade(fixedTrade ?? "todos"))}>
              Ver todos los técnicos
            </button>
          </div>
        ) : (
          list.slice(0, shown).map(({ worker: w, km }) => {
            const o = oficioById(w.oficio ?? "");
            const badge = badgeOf(w);
            const href = `/app?oficio=${w.oficio}`;
            return (
              <article key={w.id} className="gig">
                <Illus
                  icon={o?.icon ?? "bolt"}
                  tint={o?.tint ?? "var(--tint-1)"}
                  pattern={o?.id === "electricista" ? "grid" : o?.id === "soldador" || o?.id === "drywall" ? "stripes" : ""}
                  chip={w.work_label}
                  photo={covers[w.id]}
                  photoAlt={w.work_label ? `${w.work_label}, trabajo de ${w.full_name}` : `Trabajo de ${w.full_name}`}
                >
                  {w.available && (
                    <span className="gig-avail">
                      <i />
                      Disponible ahora
                    </span>
                  )}
                  <button className="fav" type="button" aria-pressed={favs.includes(w.id)} aria-label={`Guardar a ${w.full_name}`} onClick={() => toggleFav(w.id)}>
                    <Icon name="heart" />
                  </button>
                </Illus>
                <div className="gig-who">
                  <span className="avatar" style={{ ["--av" as string]: avatarColor(w.full_name) }}>
                    {initials(w.full_name)}
                  </span>
                  <strong>{w.full_name}</strong>
                  {badge && <span className={`badge ${badge.tone}`}>{badge.text}</span>}
                </div>
                <h3 className="gig-title">
                  <Link href={href}>{w.bio || `${roleOf(w)} en ${w.district}`}</Link>
                </h3>
                <div className="gig-rate">
                  <Icon name="star" className="ico star" />
                  {w.rating_count ? (
                    <>
                      {ratingText(w)} <em>({w.rating_count})</em>
                    </>
                  ) : (
                    <em>Sin reseñas aún</em>
                  )}
                </div>
                <div className="gig-dist">
                  <Icon name="pin" className="ico sm" />
                  {km < 0.3 ? `${w.district}, en el mismo distrito` : `${w.district}, a ${km.toFixed(1)} km`}
                </div>
                <div className="gig-price">
                  <span>{roleOf(w)}</span>
                  {w.price_from ? `Desde ${soles(w.price_from)}` : "Precio a coordinar"}
                </div>
              </article>
            );
          })
        )}
      </div>
      {list.length > shown && (
        <div className="more-row">
          <button className="btn btn-outline" type="button" onClick={() => setShown((s) => s + PAGE)}>
            Ver más técnicos ({list.length - shown})
          </button>
        </div>
      )}
    </>
  );
}

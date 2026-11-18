"use client";
import { useEffect, useRef, useState } from "react";
import { districtByName } from "@/lib/data";
import { rankWorkers, ratingOf } from "@/lib/match";
import { avatarColor, initials, soles } from "@/lib/people";
import { emitSearch } from "@/lib/searchBus";
import { DEMO_WORKERS } from "@/lib/seed";
import { Icon } from "./Icons";

const PH = [
  "Instalar tres tomacorrientes",
  "Reparar una fuga en el baño",
  "Instalar una terma eléctrica",
  "Soldar la reja de mi casa",
  "Pintar la sala y el comedor",
  "Cambiar la chapa de la puerta",
];

const PILLS: { text: string; q: string }[] = [
  { text: "Instalación eléctrica", q: "tomacorriente" },
  { text: "Fugas de agua", q: "fuga" },
  { text: "Rejas y soldadura", q: "reja" },
  { text: "Pintura de interiores", q: "pintura" },
  { text: "Cambio de chapas", q: "chapa" },
];

// Tarjeta de match del hero: el cálculo real para un pedido urgente de electricista en Miraflores.
const cliente = districtByName("Miraflores")!;
const top = rankWorkers(
  DEMO_WORKERS.filter((w) => w.oficio === "electricista"),
  cliente,
  "ahora",
)[0];

const districtsWithWorkers = Object.entries(
  DEMO_WORKERS.reduce<Record<string, number>>((acc, w) => ((acc[w.district] = (acc[w.district] ?? 0) + 1), acc), {}),
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([d]) => d);

export default function Hero() {
  const [paused, setPaused] = useState(false);
  const [ph, setPh] = useState(0);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      if (paused || q || document.activeElement === inputRef.current) return;
      setPh((i) => (i + 1) % PH.length);
    }, 2800);
    return () => clearInterval(t);
  }, [paused, q]);

  return (
    <section className={`hero${paused ? " paused" : ""}`} id="inicio" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div>
          <h1 id="hero-title">
            Técnicos de confianza,
            <br />a minutos de tu casa
          </h1>
          <form
            className="hero-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              emitSearch({ q: q.trim() || PH[ph] });
            }}
          >
            <label className="sr-only" htmlFor="q-hero">
              ¿Qué necesitas arreglar o instalar?
            </label>
            <input ref={inputRef} id="q-hero" type="search" placeholder={PH[ph]} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
            <button type="submit" aria-label="Buscar técnicos">
              <Icon name="search" />
            </button>
          </form>
          <div className="hero-pills">
            {PILLS.map((p) => (
              <a
                key={p.q}
                className="pill"
                href="#tecnicos"
                onClick={(e) => {
                  e.preventDefault();
                  emitSearch({ q: p.q });
                }}
              >
                {p.text} <Icon name="arrow" />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="map">
            <svg viewBox="0 0 480 400" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="streets" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
                  <path d="M0 0H30M0 0V30" stroke="rgba(255,255,255,.07)" strokeWidth="1" fill="none" />
                </pattern>
              </defs>
              <rect width="480" height="400" fill="#0D2252" />
              <rect width="480" height="400" fill="url(#streets)" />
              <rect x="282" y="250" width="44" height="28" rx="6" fill="rgba(34,211,238,.12)" transform="rotate(-14 304 264)" />
              <rect x="214" y="58" width="36" height="24" rx="6" fill="rgba(34,211,238,.12)" transform="rotate(-14 232 70)" />
              <path d="M322 -10 262 410" stroke="rgba(255,255,255,.17)" strokeWidth="4" fill="none" />
              <path d="M380 -10 336 410" stroke="rgba(255,255,255,.13)" strokeWidth="7" fill="none" />
              <path d="M120 140C220 132 330 112 490 92" stroke="rgba(255,255,255,.13)" strokeWidth="3.5" fill="none" />
              <path d="M134 272C234 262 360 250 490 236" stroke="rgba(255,255,255,.11)" strokeWidth="3" fill="none" />
              <path d="M0 0H118C104 54 142 112 130 168 120 222 152 282 138 340 132 366 140 384 136 400H0Z" fill="#081738" />
              <path d="M118 0C104 54 142 112 130 168 120 222 152 282 138 340 132 366 140 384 136 400" stroke="rgba(34,211,238,.4)" strokeWidth="1.5" fill="none" />
              <text className="sea-label" x="60" y="300" transform="rotate(-84 60 300)">
                OCÉANO PACÍFICO
              </text>
              <text x="230" y="112">San Isidro</text>
              <text x="168" y="232">Miraflores</text>
              <text x="356" y="200">Surquillo</text>
              <text x="406" y="316">Surco</text>
              <text x="388" y="128">San Borja</text>
              <path className="route" d="M262 176C292 176 312 200 336 222" stroke="#22D3EE" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" fill="none" />
              <g className="pin" transform="translate(214 290)">
                <circle className="pulse" r="6" />
                <circle className="dot" r="5.5" />
              </g>
              <g className="pin" transform="translate(300 120)">
                <circle className="pulse" r="6" />
                <circle className="dot" r="5.5" />
              </g>
              <g className="pin" transform="translate(424 254)">
                <circle className="pulse" r="6" />
                <circle className="dot" r="5.5" />
              </g>
              <g className="pin" transform="translate(372 334)">
                <circle className="pulse" r="6" />
                <circle className="dot" r="5.5" />
              </g>
              <g transform="translate(262 176)">
                <rect x="-50" y="-42" width="100" height="24" rx="12" fill="#FFFFFF" />
                <text className="bubble-text" x="0" y="-26" textAnchor="middle">
                  {top.worker.full_name.split(" ")[0]}, {top.km.toFixed(1)} km
                </text>
                <circle r="12" fill="rgba(34,211,238,.25)" />
                <circle className="dot" r="7" />
              </g>
              <g transform="translate(336 222)">
                <circle r="20" fill="rgba(37,99,235,.28)" />
                <circle r="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
              </g>
            </svg>
          </div>
          <div className="toast">
            <span className="toast-ico">
              <Icon name="bolt" />
            </span>
            <div>
              <strong>Nueva solicitud cerca</strong>
              <span>3 tomacorrientes en Miraflores, hoy</span>
            </div>
          </div>
          <div className="match-card">
            <div className="mc-top">
              <span className="avatar lg" style={{ ["--av" as string]: avatarColor(top.worker.full_name) }}>
                {initials(top.worker.full_name)}
              </span>
              <div>
                <strong>{top.worker.full_name}</strong>
                <span>Electricista en {top.worker.district}</span>
              </div>
              <span className="match-pct">{Math.round(top.score)}/100 match</span>
            </div>
            <div className="mc-meta">
              <span>
                <Icon name="star" className="ico star" />
                {ratingOf(top.worker).toFixed(1)} <em>({top.worker.rating_count})</em>
              </span>
              <span>
                <Icon name="pin" />
                {top.km.toFixed(1)} km
              </span>
              <span>
                <Icon name="wallet" />
                Desde {soles(top.worker.price_from ?? 0)}
              </span>
            </div>
            <span className="btn btn-primary btn-block">Solicitar a {top.worker.full_name.split(" ")[0]}</span>
          </div>
        </div>
      </div>
      <div className="wrap hero-foot">
        <span className="label">Técnicos en:</span>
        <ul className="districts">
          {districtsWithWorkers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <button className="pause" type="button" aria-pressed={paused} aria-label={paused ? "Reanudar animación" : "Pausar animación"} onClick={() => setPaused((p) => !p)}>
          <Icon name={paused ? "play" : "pause"} />
        </button>
      </div>
    </section>
  );
}

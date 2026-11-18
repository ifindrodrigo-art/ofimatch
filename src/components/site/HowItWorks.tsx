"use client";
import { useRef, useState } from "react";
import { Icon } from "./Icons";

const STEPS = {
  cli: [
    { h: "Cuenta qué necesitas", p: "Elige el oficio, describe el trabajo en una línea y dinos tu distrito y qué tan urgente es." },
    { h: "Recibe tu match", p: "Ves a los técnicos ordenados por cercanía, reputación y disponibilidad, con su precio desde, fotos de trabajos y el puntaje de cada uno." },
    { h: "Califiquen en dos vías", p: "Al terminar, tú calificas al técnico y el técnico te califica a ti. Las dos notas se muestran al mismo tiempo." },
  ],
  tec: [
    { h: "Crea tu perfil con fotos", p: "Pon tu oficio, distrito, años de experiencia y tu precio desde. Sube fotos de tus trabajos: es tu carta de presentación." },
    { h: "Activa tu disponibilidad", p: "Recibe solicitudes de tu zona. Tú decides cuáles aceptas y coordinas por WhatsApp." },
    { h: "Crece con datos", p: "Mira en qué distritos y horarios se pide más tu oficio. Pagas 10% de comisión solo cuando terminas un trabajo." },
  ],
};

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" role="img" aria-label={`${n} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" className={`ico star${i < n ? "" : " off"}`} />
      ))}
    </span>
  );
}

export default function HowItWorks() {
  const [tab, setTab] = useState<"cli" | "tec">("cli");
  const refs = { cli: useRef<HTMLButtonElement>(null), tec: useRef<HTMLButtonElement>(null) };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tab === "cli" ? "tec" : "cli";
    setTab(next);
    refs[next].current?.focus();
  };
  return (
    <>
      <div className="sec-head">
        <h2 className="h2 h2-sm" id="how-title">
          Así funciona OfiMatch
        </h2>
        <div className="seg" role="tablist" aria-label="Tipo de usuario" onKeyDown={onKey}>
          <button ref={refs.cli} type="button" role="tab" id="tab-cli" aria-controls="how-steps" aria-selected={tab === "cli"} tabIndex={tab === "cli" ? 0 : -1} onClick={() => setTab("cli")}>
            Necesito un técnico
          </button>
          <button ref={refs.tec} type="button" role="tab" id="tab-tec" aria-controls="how-steps" aria-selected={tab === "tec"} tabIndex={tab === "tec" ? 0 : -1} onClick={() => setTab("tec")}>
            Soy técnico
          </button>
        </div>
      </div>
      <div className="how">
        <ol className="steps" id="how-steps" role="tabpanel" aria-labelledby={tab === "cli" ? "tab-cli" : "tab-tec"}>
          {STEPS[tab].map((s) => (
            <li key={s.h}>
              <div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="rate-card" aria-label="Ejemplo de calificación en dos vías">
          <header>
            <strong>Confianza en dos vías</strong>
            <span>Así se ve una calificación al cerrar un servicio</span>
          </header>
          <div className="rate-cols">
            <div className="rate-col">
              <h4>El cliente califica al técnico</h4>
              <div className="rate-row">Puntualidad<Stars n={5} /></div>
              <div className="rate-row">Calidad del trabajo<Stars n={5} /></div>
              <div className="rate-row">Trato<Stars n={4} /></div>
            </div>
            <div className="rate-col alt">
              <h4>El técnico califica al cliente</h4>
              <div className="rate-row">Pago a tiempo<Stars n={5} /></div>
              <div className="rate-row">Claridad del pedido<Stars n={4} /></div>
              <div className="rate-row">Trato<Stars n={5} /></div>
            </div>
          </div>
          <footer>
            <Icon name="lock" />
            Ninguna nota se ve hasta que los dos califican.
          </footer>
        </aside>
      </div>
    </>
  );
}

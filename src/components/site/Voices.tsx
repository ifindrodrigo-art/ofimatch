"use client";
import { useEffect, useState } from "react";

const QUOTES = [
  "“Debería haber algo como LinkedIn, pero para los oficios.”",
  "“No tengo cómo demostrar mi experiencia formalmente.”",
  "“A veces tengo días sin ningún trabajo.”",
  "“Me gustaría encontrar trabajos que estén cerca.”",
];

export default function Voices() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => go((i + 1) % QUOTES.length), 6500);
    return () => clearInterval(t);
  });

  function go(n: number) {
    setFade(true);
    setTimeout(() => {
      setI(n);
      setFade(false);
    }, 250);
  }

  return (
    <div className="voice">
      <figure>
        <blockquote style={{ opacity: fade ? 0 : 1 }}>{QUOTES[i]}</blockquote>
        <figcaption>Técnico independiente de Lima, mapa de empatía de OfiMatch, 2026</figcaption>
      </figure>
      <div className="voice-dots" role="group" aria-label="Cambiar frase">
        {QUOTES.map((_, n) => (
          <button key={n} type="button" aria-label={`Frase ${n + 1}`} aria-pressed={n === i} onClick={() => (setAuto(false), go(n))} />
        ))}
      </div>
    </div>
  );
}

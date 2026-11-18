"use client";
import { useEffect, useRef, useState } from "react";
import type { Backend, PortfolioItem, Profile } from "@/lib/types";
import { Icon } from "../site/Icons";

/** Hoja inferior con las fotos de trabajos de un técnico. */
export default function PortfolioSheet({ backend, worker, onClose }: { backend: Backend; worker: Profile; onClose: () => void }) {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backend.portfolioOf(worker.id).then(setItems).catch(() => setItems([]));
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [backend, worker.id, onClose]);
  return (
    <div className="sheet" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet-head">
          <h2 id="sheet-title">Trabajos de {worker.full_name.split(" ")[0]}</h2>
          <button ref={closeRef} type="button" className="icon-btn" aria-label="Cerrar" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {!items ? (
          <p className="muted" role="status">
            Cargando fotos…
          </p>
        ) : items.length === 0 ? (
          <p className="muted">Todavía no subió fotos de sus trabajos.</p>
        ) : (
          <div className="gallery big">
            {items.map((it) => (
              <figure key={it.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.url} alt={it.caption || `Trabajo de ${worker.full_name}`} loading="lazy" />
                {it.caption && <figcaption>{it.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

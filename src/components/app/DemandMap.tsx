"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { districtByName, oficioById } from "@/lib/data";
import type { Backend, DemandRow, Profile } from "@/lib/types";

export default function DemandMap({ backend, profile, onMoved }: { backend: Backend; profile: Profile; onMoved: () => void }) {
  const [rows, setRows] = useState<DemandRow[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const oficio = profile.oficio ?? "electricista";

  useEffect(() => {
    backend.demand(oficio).then(setRows).catch(() => setRows([]));
  }, [backend, oficio]);

  useEffect(() => {
    if (!rows || !mapEl.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(mapEl.current, { zoomControl: true, attributionControl: true }).setView([-12.06, -77.02], 10.4);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      const layer = layerRef.current!;
      layer.clearLayers();
      const max = Math.max(1, ...rows.map((r) => r.total));
      rows.forEach((r) => {
        const sel = r.district === selected;
        L.circleMarker([r.lat, r.lng], {
          radius: 7 + (r.total / max) * 22,
          color: sel ? "#13295a" : "#e0007a",
          weight: sel ? 3 : 1.5,
          fillColor: "#e0007a",
          fillOpacity: 0.18 + (r.total / max) * 0.45,
        })
          .bindTooltip(`${r.district}: ${r.total} pedidos`)
          .on("click", () => setSelected(r.district))
          .addTo(layer);
      });
      const home = districtByName(profile.district);
      if (home)
        L.circleMarker([home.lat, home.lng], { radius: 6, color: "#fff", weight: 2, fillColor: "#13295a", fillOpacity: 1 })
          .bindTooltip("Tu zona actual")
          .addTo(layer);
    })();
    return () => {
      cancelled = true;
    };
  }, [rows, selected, profile.district]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  async function moveHere(name: string) {
    const d = districtByName(name);
    const r = rows?.find((x) => x.district === name);
    setBusy(true);
    setMsg("");
    try {
      await backend.updateMyProfile({ district: name, lat: d?.lat ?? r!.lat, lng: d?.lng ?? r!.lng, available: true });
      setMsg(`Listo: ahora apareces disponible en ${name}.`);
      onMoved();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "No se pudo cambiar tu zona.");
    } finally {
      setBusy(false);
    }
  }

  const max = Math.max(1, ...(rows ?? []).map((r) => r.total));
  const sel = rows?.find((r) => r.district === selected);
  const best = sel ? (["manana", "tarde", "noche"] as const).reduce((a, b) => (sel[a] >= sel[b] ? a : b)) : null;
  const franja = { manana: "en la mañana", tarde: "en la tarde", noche: "en la noche" };

  return (
    <div className="stack">
      <div>
        <h1 className="h-app">Dónde se pide más</h1>
        <p className="sub-app">
          Pedidos de {oficioById(oficio)!.plural.toLowerCase()} en los últimos 60 días. Toca una zona para trabajar ahí.
        </p>
      </div>
      <div ref={mapEl} className="map" role="img" aria-label="Mapa de demanda por distrito" />
      {sel && (
        <div className="card">
          <h3>{sel.district}</h3>
          <p className="muted">
            {sel.total} pedidos. Se pide más {franja[best!]}.
          </p>
          <div className="franjas">
            <span>Mañana: {sel.manana}</span>
            <span>Tarde: {sel.tarde}</span>
            <span>Noche: {sel.noche}</span>
          </div>
          {profile.district === sel.district ? (
            <p className="muted">Ya estás en esta zona.</p>
          ) : (
            <button className="btn btn-primary" disabled={busy} onClick={() => moveHere(sel.district)}>
              Trabajar en {sel.district}
            </button>
          )}
        </div>
      )}
      {msg && <p className="demo-note">{msg}</p>}
      {!rows && <p className="muted">Cargando demanda…</p>}
      <ul className="zones">
        {rows?.slice(0, 10).map((r) => (
          <li key={r.district}>
            <button className="zone" aria-pressed={selected === r.district} onClick={() => setSelected(r.district)}>
              <b>{r.district}</b>
              <span className="muted">{r.total} pedidos</span>
              <span className="zone-bar" aria-hidden="true">
                <i style={{ width: `${(r.total / max) * 100}%` }} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { COMMISSION, URGENCIAS, districtByName, oficioById } from "@/lib/data";
import { rankWorkers, type MatchResult } from "@/lib/match";
import type { Backend, Profile, Request, Status } from "@/lib/types";
import RateBox from "./RateBox";

const STATUS_LABEL: Record<Status, string> = {
  pendiente: "Esperando respuesta",
  aceptada: "Aceptada",
  en_camino: "En camino",
  completada: "Completada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
};

const fmtDate = (s: string) =>
  new Date(s).toLocaleString("es-PE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function RequestList({
  backend,
  profile,
  requests,
  refresh,
}: {
  backend: Backend;
  profile: Profile;
  requests: Request[];
  refresh: () => Promise<void>;
}) {
  const [justAccepted, setJustAccepted] = useState<Request | null>(null);
  const isWorker = profile.role === "trabajador";

  if (justAccepted)
    return (
      <AcceptedScreen
        backend={backend}
        request={justAccepted}
        onClose={() => {
          setJustAccepted(null);
          refresh();
        }}
      />
    );

  const active = requests.filter((r) => !["completada", "rechazada", "cancelada"].includes(r.status) || (r.status === "rechazada" && !isWorker));
  const done = requests.filter((r) => !active.includes(r));

  return (
    <div className="stack">
      <div>
        <h1 className="h-app">{isWorker ? "Solicitudes" : "Mis pedidos"}</h1>
        <p className="sub-app">
          {isWorker
            ? profile.available
              ? "Estás disponible: los clientes de tu zona te pueden encontrar."
              : "Estás como no disponible. Actívate en Mi perfil para recibir más pedidos."
            : "Aquí ves el estado de cada pedido y calificas al terminar."}
        </p>
      </div>
      {requests.length === 0 && (
        <div className="card empty">
          <p>
            {isWorker
              ? "Todavía no tienes solicitudes. Mira el mapa de demanda para ubicarte donde más se pide tu oficio."
              : "Aún no has pedido ningún servicio. Haz tu primer pedido desde la pestaña Pedir."}
          </p>
        </div>
      )}
      {active.map((r) => (
        <RequestCard key={r.id} backend={backend} profile={profile} r={r} refresh={refresh} onAccepted={setJustAccepted} />
      ))}
      {done.length > 0 && <h2 style={{ fontSize: 18, marginTop: 8 }}>Historial</h2>}
      {done.map((r) => (
        <RequestCard key={r.id} backend={backend} profile={profile} r={r} refresh={refresh} onAccepted={setJustAccepted} />
      ))}
    </div>
  );
}

function RequestCard({
  backend,
  profile,
  r,
  refresh,
  onAccepted,
}: {
  backend: Backend;
  profile: Profile;
  r: Request;
  refresh: () => Promise<void>;
  onAccepted: (r: Request) => void;
}) {
  const isWorker = r.worker_id === profile.id;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [closing, setClosing] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [alts, setAlts] = useState<MatchResult<Profile>[] | null>(null);
  const of = oficioById(r.oficio)!;
  const other = isWorker ? r.client?.full_name : r.worker?.full_name;

  useEffect(() => {
    if (["aceptada", "en_camino", "completada"].includes(r.status)) backend.counterpartPhone(r.id).then(setPhone).catch(() => {});
  }, [backend, r.id, r.status]);

  async function act(patch: Parameters<Backend["updateRequest"]>[1], after?: () => void) {
    setBusy(true);
    setError("");
    try {
      await backend.updateRequest(r.id, patch);
      after?.();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setBusy(false);
    }
  }

  async function loadAlternatives() {
    const ws = (await backend.listWorkers(r.oficio)).filter((w) => w.id !== r.worker_id && w.id !== profile.id);
    setAlts(rankWorkers(ws, districtByName(r.district) ?? r, r.urgency).slice(0, 3));
  }

  const canClose = (isWorker && ["aceptada", "en_camino"].includes(r.status)) || (!isWorker && r.worker?.is_demo && ["aceptada", "en_camino"].includes(r.status));
  const amt = Number(amount);

  return (
    <article className="card">
      <div className="req-head">
        <div>
          <h3>
            {of.singular} en {r.district}
          </h3>
          <p className="muted">
            {isWorker ? `Cliente: ${other ?? "—"}` : `Trabajador: ${other ?? "—"}`}
            <br />
            {URGENCIAS.find((u) => u.id === r.urgency)!.label}, pedido el {fmtDate(r.created_at)}
            {r.match_score != null && <>, match {Math.round(r.match_score)}/100</>}
          </p>
        </div>
        <span className={`status status-${r.status}`}>{STATUS_LABEL[r.status]}</span>
      </div>
      <p className="req-desc">{r.description}</p>

      {phone && r.status !== "completada" && (
        <a className="btn whatsapp btn-block" href={`https://wa.me/51${phone}?text=${encodeURIComponent(`Hola ${other ?? ""}, te escribo por OfiMatch sobre: ${r.description}`)}`} target="_blank" rel="noopener noreferrer">
          Escribir por WhatsApp a {other?.split(" ")[0]}
        </a>
      )}

      {isWorker && r.status === "pendiente" && (
        <div className="row">
          <button className="btn btn-primary" disabled={busy} onClick={() => act({ status: "aceptada" }, () => onAccepted({ ...r, status: "aceptada" }))}>
            Aceptar
          </button>
          <button className="btn btn-ghost" disabled={busy} onClick={() => act({ status: "rechazada" })}>
            Rechazar
          </button>
        </div>
      )}
      {isWorker && r.status === "aceptada" && !closing && (
        <button className="btn btn-dark" disabled={busy} onClick={() => act({ status: "en_camino" })}>
          Avisar que voy en camino
        </button>
      )}
      {canClose && !closing && (
        <button className="btn btn-ghost" onClick={() => setClosing(true)}>
          Marcar trabajo como terminado
        </button>
      )}
      {closing && (
        <div className="stack">
          <label className="field">
            <span>Monto acordado (S/)</span>
            <input className="input" type="number" min={0} step="1" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="150" />
          </label>
          {amt > 0 && <Desglose amount={amt} />}
          <div className="row">
            <button className="btn btn-primary" disabled={busy || !(amt > 0)} onClick={() => act({ status: "completada", amount: amt }, () => setClosing(false))}>
              Confirmar trabajo terminado
            </button>
            <button className="btn btn-ghost" onClick={() => setClosing(false)}>
              Volver
            </button>
          </div>
        </div>
      )}
      {!isWorker && ["pendiente", "aceptada"].includes(r.status) && !closing && (
        <button className="linkish" style={{ justifySelf: "start" }} disabled={busy} onClick={() => act({ status: "cancelada" })}>
          Cancelar pedido
        </button>
      )}
      {!isWorker && r.status === "rechazada" && (
        <div className="stack">
          <p className="muted">{other?.split(" ")[0]} no puede tomar este trabajo. Envíalo a otro trabajador:</p>
          {!alts && (
            <button className="btn btn-dark" onClick={loadAlternatives}>
              Ver otras opciones
            </button>
          )}
          {alts?.map((m) => (
            <button key={m.worker.id} className="btn btn-ghost" disabled={busy} onClick={() => act({ worker_id: m.worker.id, status: "pendiente", match_score: Math.round(m.score) })}>
              Enviar a {m.worker.full_name} ({Math.round(m.score)}/100, {m.km.toFixed(1)} km)
            </button>
          ))}
          <button className="linkish" style={{ justifySelf: "start" }} disabled={busy} onClick={() => act({ status: "cancelada" })}>
            Cancelar pedido
          </button>
        </div>
      )}

      {r.status === "completada" && (
        <>
          {r.amount != null && isWorker && <Desglose amount={Number(r.amount)} />}
          <RateBox backend={backend} profile={profile} request={r} otherName={other ?? "la otra persona"} />
        </>
      )}
      {error && <p className="error">{error}</p>}
    </article>
  );
}

function Desglose({ amount }: { amount: number }) {
  return (
    <dl className="desglose" style={{ marginTop: 0 }}>
      <div>
        <dt>Monto del servicio</dt>
        <dd>S/ {amount.toFixed(2)}</dd>
      </div>
      <div>
        <dt>Comisión OfiMatch ({Math.round(COMMISSION * 100)}%)</dt>
        <dd>− S/ {(amount * COMMISSION).toFixed(2)}</dd>
      </div>
      <div className="total">
        <dt>Recibe el trabajador</dt>
        <dd>S/ {(amount * (1 - COMMISSION)).toFixed(2)}</dd>
      </div>
    </dl>
  );
}

function AcceptedScreen({ backend, request, onClose }: { backend: Backend; request: Request; onClose: () => void }) {
  const [phone, setPhone] = useState<string | null>(null);
  useEffect(() => {
    backend.counterpartPhone(request.id).then(setPhone).catch(() => {});
  }, [backend, request.id]);
  const name = request.client?.full_name ?? "el cliente";
  return (
    <div className="confirm">
      <div className="check" aria-hidden="true">
        ✓
      </div>
      <h1 className="h-app">Aceptaste el trabajo</h1>
      <p>
        {name} ya sabe que vas. Coordinen la hora y el precio por WhatsApp antes de salir.
        <br />
        <b>{request.district}</b>: {request.description}
      </p>
      {phone && (
        <a className="btn whatsapp btn-block" href={`https://wa.me/51${phone}?text=${encodeURIComponent(`Hola ${name}, soy tu técnico de OfiMatch. ¿A qué hora te viene bien?`)}`} target="_blank" rel="noopener noreferrer">
          Escribir a {name.split(" ")[0]} por WhatsApp
        </a>
      )}
      <button className="btn btn-ghost btn-block" onClick={onClose}>
        Volver a mis solicitudes
      </button>
    </div>
  );
}

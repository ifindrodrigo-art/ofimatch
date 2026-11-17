"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getBackend } from "@/lib/backend";
import type { Profile, Request } from "@/lib/types";
import type { OficioId } from "@/lib/data";
import { LogoMark } from "../Site";
import { IconList, IconMap, IconPlus, IconUser } from "./Icons";
import Auth from "./Auth";
import NewRequest from "./NewRequest";
import RequestList from "./RequestList";
import DemandMap from "./DemandMap";
import ProfileView from "./ProfileView";

type Tab = "pedir" | "pedidos" | "solicitudes" | "demanda" | "perfil";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function AppShell() {
  const [backend] = useState(() => getBackend());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pedir");
  const [requests, setRequests] = useState<Request[]>([]);
  const [install, setInstall] = useState<BIPEvent | null>(null);
  const [hint, setHint] = useState<{ oficio?: OficioId; rol?: string }>({});
  const lastId = useRef<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const p = await backend.currentProfile();
      if (p && lastId.current !== p.id) setTab(p.role === "trabajador" ? "solicitudes" : "pedir"); // nueva sesión: pestaña inicial
      lastId.current = p?.id ?? null;
      setProfile(p);
    } finally {
      setLoading(false);
    }
  }, [backend]);

  const refreshRequests = useCallback(async () => {
    try {
      setRequests(await backend.myRequests());
    } catch {}
  }, [backend]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setHint({ oficio: (q.get("oficio") as OficioId) || undefined, rol: q.get("rol") || undefined });
    refreshProfile();
    const off = backend.onAuthChange(refreshProfile);
    const onBip = (e: Event) => {
      e.preventDefault();
      setInstall(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => {
      off();
      window.removeEventListener("beforeinstallprompt", onBip);
    };
  }, [backend, refreshProfile]);

  useEffect(() => {
    if (!profile) return;
    refreshRequests();
    const t = setInterval(refreshRequests, 10000);
    return () => clearInterval(t);
  }, [profile, refreshRequests]);

  const pendingForWorker = profile?.role === "trabajador" ? requests.filter((r) => r.status === "pendiente" && r.worker_id === profile.id).length : 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] =
    profile?.role === "trabajador"
      ? [
          { id: "solicitudes", label: "Solicitudes", icon: <IconList />, badge: pendingForWorker },
          { id: "demanda", label: "Demanda", icon: <IconMap /> },
          { id: "perfil", label: "Mi perfil", icon: <IconUser /> },
        ]
      : [
          { id: "pedir", label: "Pedir", icon: <IconPlus /> },
          { id: "pedidos", label: "Mis pedidos", icon: <IconList /> },
          { id: "perfil", label: "Mi perfil", icon: <IconUser /> },
        ];

  return (
    <div className="app">
      <header className="app-top">
        <Link href="/" className="logo" aria-label="Ir a la página de OfiMatch">
          <LogoMark />
          OfiMatch
        </Link>
        <span className="spacer" />
        {install && (
          <button
            className="btn"
            onClick={async () => {
              await install.prompt();
              setInstall(null);
            }}
          >
            Instalar app
          </button>
        )}
      </header>

      <main className="app-main">
        {backend.mode === "demo" && (
          <p className="demo-note">
            Modo demostración: todo se guarda solo en este dispositivo. Los perfiles de ejemplo aceptan tus pedidos automáticamente.
          </p>
        )}
        {loading ? (
          <p className="muted">Cargando…</p>
        ) : !profile ? (
          <Auth backend={backend} initialRole={hint.rol === "trabajador" ? "trabajador" : undefined} onDone={refreshProfile} />
        ) : tab === "pedir" ? (
          <NewRequest
            backend={backend}
            profile={profile}
            initialOficio={hint.oficio}
            onSent={() => {
              refreshRequests();
              setTab("pedidos");
            }}
          />
        ) : tab === "pedidos" || tab === "solicitudes" ? (
          <RequestList backend={backend} profile={profile} requests={requests} refresh={refreshRequests} />
        ) : tab === "demanda" ? (
          <DemandMap backend={backend} profile={profile} onMoved={refreshProfile} />
        ) : (
          <ProfileView backend={backend} profile={profile} onChange={refreshProfile} />
        )}
      </main>

      {profile && (
        <nav className="app-tabs" aria-label="Secciones de la app">
          {tabs.map((t) => (
            <button key={t.id} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.icon}
              {t.label}
              {!!t.badge && <span className="badge">{t.badge}</span>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

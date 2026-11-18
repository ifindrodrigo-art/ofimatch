"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OFICIOS } from "@/lib/data";
import { searchOrNavigate } from "@/lib/searchBus";
import { Icon } from "./Icons";

export function Logo({ className = "logo" }: { className?: string }) {
  return (
    <Link className={className} href="/" aria-label="OfiMatch, inicio">
      ofimatch<i />
    </Link>
  );
}

export default function SiteHeader({ catbar = false }: { catbar?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [showCats, setShowCats] = useState(false);
  const [explore, setExplore] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 4);
      const hero = document.querySelector<HTMLElement>(".hero");
      setShowCats(catbar && !!hero && y > hero.offsetTop + hero.offsetHeight - 140);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [catbar]);

  useEffect(() => {
    if (!explore) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".drop")) setExplore(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [explore]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExplore(false);
        setDrawer(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
    if (drawer) closeRef.current?.focus();
  }, [drawer]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${showCats ? " show-cats" : ""}`}>
      <div className="wrap hdr">
        <button className="menu-btn" type="button" aria-label="Abrir menú" aria-expanded={drawer} aria-controls="drawer" onClick={() => setDrawer(true)}>
          <Icon name="menu" />
        </button>
        <Logo />
        <form
          className="hdr-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q")?.toString().trim();
            if (q) searchOrNavigate({ q });
          }}
        >
          <label className="sr-only" htmlFor="q-header">
            Buscar servicio
          </label>
          <input id="q-header" name="q" type="search" placeholder="¿Qué servicio necesitas hoy?" autoComplete="off" />
          <button type="submit" aria-label="Buscar">
            <Icon name="search" />
          </button>
        </form>
        <nav className="hdr-nav" aria-label="Principal">
          <Link className="hide-l" href="/#empresas">
            OfiMatch Empresas
          </Link>
          <div className="drop hide-l">
            <button className="drop-btn" type="button" aria-expanded={explore} aria-controls="explore-panel" onClick={() => setExplore((v) => !v)}>
              Explorar <Icon name="chev-d" />
            </button>
            <div className="drop-panel" id="explore-panel" hidden={!explore}>
              {OFICIOS.map((o) => (
                <Link key={o.id} href={`/oficios/${o.slug}`} onClick={() => setExplore(false)}>
                  <Icon name={o.icon} />
                  {o.area}
                </Link>
              ))}
              <div className="drop-foot">
                <Link href="/#como-funciona" onClick={() => setExplore(false)}>
                  Cómo funciona
                </Link>
                <Link href="/#demanda" onClick={() => setExplore(false)}>
                  Demanda por distrito
                </Link>
                <Link href="/trabajadores" onClick={() => setExplore(false)}>
                  Para técnicos
                </Link>
              </div>
            </div>
          </div>
          <Link className="hide-m" href="/trabajadores">
            Ofrece tus servicios
          </Link>
          <Link className="hide-xs" href="/app?modo=ingreso">
            Ingresar
          </Link>
          <Link className="btn btn-primary" href="/app">
            Únete
          </Link>
        </nav>
      </div>
      {catbar && (
        <div className="catbar">
          <div className="wrap">
            <ul>
              {OFICIOS.map((o) => (
                <li key={o.id}>
                  <a
                    href={`/oficios/${o.slug}`}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                      e.preventDefault();
                      searchOrNavigate({ trade: o.id });
                    }}
                  >
                    {o.area}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/#empresas">Empresas</Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {drawer && (
        <div
          className="drawer"
          id="drawer"
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as Element).closest("nav a")) setDrawer(false);
          }}
        >
          <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Menú">
            <div className="drawer-top">
              <span className="logo">
                ofimatch<i />
              </span>
              <button ref={closeRef} className="drawer-close" type="button" aria-label="Cerrar menú" onClick={() => setDrawer(false)}>
                <Icon name="close" />
              </button>
            </div>
            <Link className="btn btn-primary btn-block" href="/app" onClick={() => setDrawer(false)}>
              Únete a OfiMatch
            </Link>
            <nav aria-label="Menú móvil">
              <Link href="/app?modo=ingreso">Ingresar</Link>
              <Link href="/#como-funciona">Cómo funciona</Link>
              <Link href="/#empresas">OfiMatch Empresas</Link>
              <Link href="/#demanda">Demanda por distrito</Link>
              <Link href="/trabajadores">Ofrece tus servicios</Link>
            </nav>
            <p className="drawer-group">Oficios</p>
            <nav aria-label="Oficios">
              {OFICIOS.map((o) => (
                <Link key={o.id} href={`/oficios/${o.slug}`}>
                  <Icon name={o.icon} />
                  {o.area}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import { OFICIOS } from "@/lib/data";

export function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#13295a" />
      <path d="M9.5 19.5c2.5-7 10.5-7 13 0" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="9.5" cy="21" r="4" fill="#ffcb1f" />
      <circle cx="22.5" cy="21" r="4" fill="#e0007a" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-head">
      <div className="wrap">
        <Link href="/" className="logo" aria-label="OfiMatch, inicio">
          <LogoMark />
          OfiMatch
        </Link>
        <nav className="site-nav" aria-label="Principal">
          <Link href="/#oficios">Oficios</Link>
          <Link href="/#como-funciona">Cómo funciona</Link>
          <Link href="/trabajadores">Para trabajadores</Link>
        </nav>
        <Link href="/app" className="btn btn-dark btn-s">
          Abrir la app
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div>
          <Link href="/" className="logo">
            <LogoMark />
            OfiMatch
          </Link>
          <p>Conecta a trabajadores de oficios con clientes cercanos en Lima Metropolitana y Callao.</p>
        </div>
        <div>
          <h2>Oficios</h2>
          <ul>
            {OFICIOS.map((o) => (
              <li key={o.id}>
                <Link href={`/oficios/${o.slug}`}>{o.plural} en Lima</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>OfiMatch</h2>
          <ul>
            <li>
              <Link href="/app">Pedir un servicio</Link>
            </li>
            <li>
              <Link href="/trabajadores">Ofrecer mis servicios</Link>
            </li>
            <li>
              <Link href="/#preguntas">Preguntas frecuentes</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul>
            <li>
              <Link href="/privacidad">Privacidad y términos</Link>
            </li>
          </ul>
        </div>
        <p className="foot-note">
          OfiMatch es un proyecto académico del curso Gestión de Proyectos de la Universidad Peruana de Ciencias Aplicadas (UPC),
          Grupo 3, 2026. Los perfiles marcados como demostración son ficticios.
        </p>
      </div>
    </footer>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

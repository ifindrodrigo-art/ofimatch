import Link from "next/link";
import { OFICIOS } from "@/lib/data";

export { initials } from "@/lib/people";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-cols">
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
            <h2>Para clientes</h2>
            <ul>
              <li>
                <Link href="/app">Pedir un servicio</Link>
              </li>
              <li>
                <Link href="/#como-funciona">Cómo funciona OfiMatch</Link>
              </li>
              <li>
                <Link href="/#tecnicos">Técnicos cerca de ti</Link>
              </li>
              <li>
                <Link href="/#guias">Guías de precios</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Para técnicos</h2>
            <ul>
              <li>
                <Link href="/trabajadores">Ofrece tus servicios</Link>
              </li>
              <li>
                <Link href="/app?rol=trabajador">Crear mi perfil</Link>
              </li>
              <li>
                <Link href="/#demanda">Demanda por distrito</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>OfiMatch</h2>
            <ul>
              <li>
                <Link href="/#empresas">OfiMatch Empresas</Link>
              </li>
              <li>
                <Link href="/privacidad">Privacidad y términos</Link>
              </li>
              <li>
                <a href="https://github.com/ifindrodrigo-art/ofimatch" rel="noopener noreferrer" target="_blank">
                  Código del proyecto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-brand">
            <span className="logo">
              ofimatch<i />
            </span>
            <span>Hecho en Lima, Perú</span>
          </div>
          <p className="foot-note">
            Proyecto del curso Gestión de Proyectos, UPC, Grupo 3, 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

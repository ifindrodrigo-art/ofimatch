import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/Site";
import { Icon } from "@/components/site/Icons";
import SiteHeader from "@/components/site/SiteHeader";
import { COMMISSION } from "@/lib/data";

export const metadata: Metadata = {
  title: "Consigue más clientes para tu oficio en Lima",
  description:
    "Técnicos de oficio: recibe solicitudes de clientes cercanos, muestra tu precio desde y fotos de tus trabajos, construye tu reputación y mira dónde se pide más tu oficio. Pagas solo cuando concretas un trabajo.",
  alternates: { canonical: "/trabajadores" },
};

const pct = Math.round(COMMISSION * 100);

export default function Trabajadores() {
  const ejemplo = 150;
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero" aria-labelledby="t-title">
          <div className="hero-bg" aria-hidden="true" />
          <div className="wrap">
            <nav aria-label="Ruta">
              <ol className="crumbs">
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>Para técnicos</li>
              </ol>
            </nav>
            <h1 id="t-title">Más clientes cerca de ti, sin pagar por anunciarte</h1>
            <p>
              OfiMatch te envía solicitudes de tu oficio en tu zona. Tú decides cuáles aceptas, coordinas directo con el cliente y construyes
              una reputación que te sigue a cada trabajo.
            </p>
            <div className="row">
              <Link className="btn btn-primary btn-lg" href="/app?rol=trabajador">
                Crear mi perfil gratis
              </Link>
              <Link className="btn btn-on-dark btn-lg" href="/#demanda">
                Ver la demanda por distrito
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap two-col">
            <div className="prose">
              <h2>Lo que recibes</h2>
              <ul>
                <li>
                  <b>Solicitudes que te convienen.</b> El match prioriza a quien está cerca y disponible, así no cruzas Lima por un trabajo
                  chico.
                </li>
                <li>
                  <b>Tu vitrina.</b> Tu precio desde y hasta 12 fotos de tus trabajos aparecen en tu tarjeta, en la web y en la app.
                </li>
                <li>
                  <b>Reputación medible.</b> Cada trabajo completado suma a tu calificación y a tu contador de trabajos.
                </li>
                <li>
                  <b>Tú también calificas.</b> Evalúas si el cliente pagó a tiempo, explicó bien y te trató con respeto.
                </li>
                <li>
                  <b>Mapa de demanda.</b> Ves los distritos y horarios con más pedidos de tu oficio y te pones disponible ahí con un toque.
                </li>
              </ul>
              <h2>Cuánto cuesta</h2>
              <p>
                Crear tu perfil y recibir solicitudes es gratis. Cuando completas un trabajo, OfiMatch cobra una comisión de {pct}% sobre el
                monto acordado.
              </p>
              <h2>Qué necesitas para empezar</h2>
              <p>
                Tu oficio, tu distrito, tus años de experiencia, tu precio desde y un número de WhatsApp. Las fotos de tus trabajos las subes
                cuando quieras desde tu celular.
              </p>
            </div>
            <aside className="side-card" aria-label="Ejemplo de pago">
              <Icon name="wallet" />
              <h2>Ejemplo de un trabajo de S/ {ejemplo}</h2>
              <dl className="desglose">
                <div>
                  <dt>Monto acordado</dt>
                  <dd>S/ {ejemplo.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Comisión OfiMatch ({pct}%)</dt>
                  <dd>− S/ {(ejemplo * COMMISSION).toFixed(2)}</dd>
                </div>
                <div className="total">
                  <dt>Recibes</dt>
                  <dd>S/ {(ejemplo * (1 - COMMISSION)).toFixed(2)}</dd>
                </div>
              </dl>
              <Link className="btn btn-dark" href="/app?rol=trabajador">
                Empezar
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Site";
import { COMMISSION } from "@/lib/data";

export const metadata: Metadata = {
  title: "Consigue más clientes para tu oficio en Lima",
  description:
    "Electricistas, gasfiteros, albañiles y soldadores: recibe solicitudes de clientes cercanos, construye tu reputación y mira dónde se pide más tu oficio. Pagas solo cuando concretas un trabajo.",
  alternates: { canonical: "/trabajadores" },
};

export default function Trabajadores() {
  const ejemplo = 150;
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="wrap">
            <h1>
              Más clientes cerca de ti, <span className="marca">sin pagar por anunciarte</span>
            </h1>
            <p>
              OfiMatch te envía solicitudes de tu oficio en tu zona. Tú decides cuáles aceptas, coordinas directo con el cliente y
              construyes una reputación que te sigue a cada trabajo.
            </p>
            <div className="hero-cta">
              <Link href="/app?rol=trabajador" className="btn btn-primary">
                Crear mi perfil gratis
              </Link>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="wrap two-col">
            <div className="prose">
              <h2 style={{ marginTop: 0 }}>Lo que recibes</h2>
              <ul>
                <li>
                  <b>Solicitudes que te convienen.</b> El match prioriza a quien está cerca y disponible, así no cruzas Lima por un
                  trabajo chico.
                </li>
                <li>
                  <b>Reputación medible.</b> Cada trabajo completado suma a tu calificación y a tu contador de trabajos.
                </li>
                <li>
                  <b>Tú también calificas.</b> Evalúas si el cliente pagó a tiempo, explicó bien y te trató con respeto.
                </li>
                <li>
                  <b>Mapa de demanda.</b> Ves los distritos y horarios con más pedidos de tu oficio y puedes mover tu zona ahí con un toque.
                </li>
              </ul>
              <h2>Cuánto cuesta</h2>
              <p>
                Crear tu perfil y recibir solicitudes es gratis. Cuando completas un trabajo, OfiMatch cobra una comisión de{" "}
                {Math.round(COMMISSION * 100)}% sobre el monto acordado.
              </p>
              <h2>Qué necesitas para empezar</h2>
              <p>Tu oficio, tu distrito, tus años de experiencia y un número de WhatsApp. Las certificaciones (por ejemplo, SENCICO) suman, pero no son obligatorias para empezar.</p>
            </div>
            <aside className="matcher" aria-label="Ejemplo de pago">
              <h2>Ejemplo de un trabajo</h2>
              <p>Así se ve el desglose al cerrar un trabajo de S/ {ejemplo}.</p>
              <dl className="desglose">
                <div>
                  <dt>Monto acordado</dt>
                  <dd>S/ {ejemplo.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Comisión OfiMatch ({Math.round(COMMISSION * 100)}%)</dt>
                  <dd>− S/ {(ejemplo * COMMISSION).toFixed(2)}</dd>
                </div>
                <div className="total">
                  <dt>Recibes</dt>
                  <dd>S/ {(ejemplo * (1 - COMMISSION)).toFixed(2)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

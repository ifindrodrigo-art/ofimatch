import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, SiteFooter } from "@/components/Site";
import { Icon } from "@/components/site/Icons";
import SiteHeader from "@/components/site/SiteHeader";
import WorkersSection from "@/components/site/WorkersSection";
import { DISTRICTS, OFICIOS, SITE_URL } from "@/lib/data";

export function generateStaticParams() {
  return OFICIOS.map((o) => ({ slug: o.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const o = OFICIOS.find((x) => x.slug === slug);
  if (!o) return {};
  const title = `${o.plural} en Lima a domicilio`;
  const description = `Encuentra ${o.plural.toLowerCase()} cerca de tu distrito en Lima y Callao, con precio desde, fotos de trabajos y reseñas: ${o.trabajos
    .slice(0, 2)
    .join(", ")
    .toLowerCase()}. Pide gratis en OfiMatch.`;
  return {
    title,
    description,
    alternates: { canonical: `/oficios/${o.slug}` },
    openGraph: { title: `${title} | OfiMatch`, description, url: `${SITE_URL}/oficios/${o.slug}` },
  };
}

export default async function OficioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const o = OFICIOS.find((x) => x.slug === slug);
  if (!o) notFound();
  const url = `${SITE_URL}/oficios/${o.slug}`;
  const one = o.singular.toLowerCase();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: `${o.plural} a domicilio en Lima`,
              serviceType: o.singular,
              provider: { "@type": "Organization", name: "OfiMatch", url: SITE_URL },
              areaServed: { "@type": "City", name: "Lima" },
              url,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: `${o.plural} en Lima`, item: url },
              ],
            },
          ],
        }}
      />
      <SiteHeader />
      <main>
        <section className="page-hero" aria-labelledby="oficio-title">
          <div className="hero-bg" aria-hidden="true" />
          <div className="wrap">
            <nav aria-label="Ruta">
              <ol className="crumbs">
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>{o.area}</li>
              </ol>
            </nav>
            <h1 id="oficio-title">{o.plural} en Lima, cerca de tu casa</h1>
            <p>
              Te mostramos a los {o.plural.toLowerCase()} más cercanos a tu distrito, ordenados por reputación y disponibilidad, con su precio
              desde y fotos de sus trabajos. Pedir es gratis.
            </p>
            <div className="row">
              <Link className="btn btn-primary btn-lg" href={`/app?oficio=${o.id}`}>
                Pedir un {one}
              </Link>
              <a className="btn btn-on-dark btn-lg" href="#tecnicos">
                Ver {o.plural.toLowerCase()}
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="tecnicos" aria-labelledby="tec-title">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h2 h2-sm" id="tec-title">
                {o.plural} en OfiMatch
              </h2>
            </div>
            <WorkersSection fixedTrade={o.id} />
          </div>
        </section>

        <section className="section">
          <div className="wrap two-col">
            <div className="prose">
              <h2>Trabajos que puedes pedir</h2>
              <ul>
                {o.trabajos.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <h2>Cómo elegimos a tu {one}</h2>
              <p>
                Si es una emergencia, priorizamos a quien está más cerca y disponible. Si puede esperar unos días, damos más peso a la
                reputación: el promedio de calificaciones de clientes reales, ajustado por la cantidad de trabajos para que una sola reseña no
                pese demasiado.
              </p>
              <p>
                Cuando el {one} acepta, ambos ven el WhatsApp del otro para coordinar. Al terminar, se califican mutuamente y las notas se
                revelan a la vez.
              </p>
              <h2>{o.pregunta}</h2>
              <p>
                Cada {one} publica su precio desde en su perfil, y lo ves en su tarjeta antes de pedir. El monto final depende del trabajo, los
                materiales y la distancia, y lo acuerdan antes de empezar.
              </p>
              <h2>Distritos donde puedes pedir</h2>
              <ul className="distritos">
                {DISTRICTS.map((d) => (
                  <li key={d.name}>
                    {o.singular} en {d.name}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="side-card">
              <Icon name={o.icon} />
              <h2>¿Eres {one}?</h2>
              <p>Crea tu perfil gratis con tu precio desde y fotos de tus trabajos, y recibe solicitudes de tu zona.</p>
              <Link className="btn btn-dark" href="/app?rol=trabajador">
                Crear mi perfil
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

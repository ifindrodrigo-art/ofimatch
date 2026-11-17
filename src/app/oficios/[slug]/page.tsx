import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Matcher from "@/components/Matcher";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/Site";
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
  const description = `Encuentra ${o.plural.toLowerCase()} cerca de tu distrito en Lima y Callao con reseñas reales: ${o.trabajos
    .slice(0, 3)
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
        <section className="page-hero">
          <div className="wrap">
            <nav aria-label="Ruta">
              <ol className="crumbs">
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>{o.plural} en Lima</li>
              </ol>
            </nav>
            <h1 style={{ ["--c" as string]: o.color }}>
              <span className="marca">{o.plural}</span> en Lima, cerca de tu casa
            </h1>
            <p>
              Pide un {o.singular.toLowerCase()} en OfiMatch y te mostramos a los más cercanos a tu distrito, ordenados por reputación y
              disponibilidad. Pedir es gratis.
            </p>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="wrap two-col">
            <div className="prose">
              <h2 style={{ marginTop: 0 }}>Trabajos que puedes pedir</h2>
              <ul>
                {o.trabajos.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <h2>Cómo elegimos a tu {o.singular.toLowerCase()}</h2>
              <p>
                Si es una emergencia, priorizamos a quien está más cerca y disponible. Si puede esperar unos días, damos más peso a la
                reputación: el promedio de calificaciones de clientes reales, ajustado por la cantidad de trabajos para que una sola reseña
                no pese demasiado.
              </p>
              <p>
                Cuando el {o.singular.toLowerCase()} acepta, ambos ven el teléfono del otro para coordinar. Al terminar, se califican
                mutuamente y las notas se revelan a la vez.
              </p>
              <h2>{o.pregunta}</h2>
              <p>
                El precio depende del trabajo, los materiales y la distancia, y lo acuerdas directamente con el {o.singular.toLowerCase()}{" "}
                antes de empezar. En OfiMatch ves cuántos trabajos ha completado y qué dicen sus clientes, para que compares con
                información y no solo por precio.
              </p>
              <h2>Distritos donde hay {o.plural.toLowerCase()} en OfiMatch</h2>
              <ul className="distritos">
                {DISTRICTS.map((d) => (
                  <li key={d.name}>
                    {o.singular} en {d.name}
                  </li>
                ))}
              </ul>
            </div>
            <Matcher initialOficio={o.id} />
          </div>
        </section>
        <section className="section">
          <div className="wrap">
            <div className="cta-final">
              <h2>¿Eres {o.singular.toLowerCase()}? Recibe clientes de tu zona</h2>
              <Link href="/trabajadores" className="btn btn-dark">
                Ofrecer mis servicios
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

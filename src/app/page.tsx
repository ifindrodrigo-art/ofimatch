import Link from "next/link";
import Matcher from "@/components/Matcher";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/Site";
import { OFICIOS, SITE_URL } from "@/lib/data";

const FAQ = [
  {
    q: "¿Cómo elige OfiMatch al trabajador?",
    a: "Ordena a los trabajadores del oficio que pediste según tres cosas: qué tan cerca están de tu distrito, su reputación (calificaciones reales de otros clientes) y si están disponibles. Si es una emergencia pesa más la cercanía; si puede esperar a la semana, pesa más la reputación. Siempre ves el puntaje y por qué.",
  },
  {
    q: "¿Cuánto cuesta usar OfiMatch?",
    a: "Registrarse y pedir un servicio es gratis. El precio del trabajo lo acuerdas directamente con el trabajador. OfiMatch cobra una comisión de 10% al trabajador solo cuando el trabajo se completa; nunca por anunciarse.",
  },
  {
    q: "¿Qué es la calificación en dos vías?",
    a: "Al terminar, el cliente califica al trabajador (puntualidad, calidad y trato) y el trabajador califica al cliente (pago a tiempo, claridad y trato). Ninguno ve la nota del otro hasta que ambos califican, así nadie califica por represalia.",
  },
  {
    q: "¿Mi número de teléfono es público?",
    a: "No. Tu número solo se muestra a la otra persona cuando un trabajador acepta tu solicitud, para que coordinen por WhatsApp o llamada.",
  },
  {
    q: "¿En qué distritos funciona?",
    a: "En Lima Metropolitana y el Callao. Eliges tu distrito y el match calcula la distancia hasta el distrito de cada trabajador.",
  },
  {
    q: "Soy electricista, gasfitero, albañil o soldador. ¿Cómo me uno?",
    a: "Abre la app, elige «Ofrezco mis servicios», completa tu oficio, distrito y años de experiencia, y activa tu disponibilidad. Además verás un mapa con los distritos donde más se pide tu oficio.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#org`,
              name: "OfiMatch",
              url: SITE_URL,
              logo: `${SITE_URL}/icons/icon-512.png`,
              areaServed: "Lima Metropolitana, Perú",
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#web`,
              name: "OfiMatch",
              url: SITE_URL,
              inLanguage: "es-PE",
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="afiche">
              <h1>
                <span className="banda banda-1">¿Se malogró</span>
                <span className="banda banda-2">algo en casa?</span>
                <span className="banda banda-3">Hay un técnico cerca.</span>
              </h1>
              <p className="hero-sub">
                OfiMatch te conecta con electricistas, gasfiteros, albañiles y soldadores de tu zona, ordenados por cercanía, urgencia y
                reputación real.
              </p>
              <div className="hero-cta">
                <Link href="/app" className="btn btn-primary">
                  Pedir un servicio
                </Link>
                <Link href="/trabajadores" className="btn btn-ghost">
                  Soy trabajador de oficio
                </Link>
              </div>
              <p className="hero-trust">Gratis para pedir. En Lima Metropolitana y Callao.</p>
            </div>
            <Matcher />
          </div>
        </section>

        <section className="section" id="como-funciona" aria-labelledby="como-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="como-title">Del problema al trabajo hecho</h2>
              <p>Sin buscar en grupos de Facebook ni pedir números prestados.</p>
            </div>
            <ol className="pasos">
              <li>
                <h3>Cuenta qué necesitas</h3>
                <p>Elige el oficio, tu distrito y para cuándo lo necesitas. Describe el problema en una línea.</p>
              </li>
              <li>
                <h3>Revisa el match</h3>
                <p>Ves a los trabajadores ordenados con su puntaje, distancia, reseñas y años de experiencia.</p>
              </li>
              <li>
                <h3>Coordinen directo</h3>
                <p>Cuando el trabajador acepta, ambos ven el WhatsApp del otro para coordinar la visita y el precio.</p>
              </li>
              <li>
                <h3>Califíquense a la vez</h3>
                <p>Al terminar, ambos califican. Las notas se revelan juntas y alimentan los próximos matches.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section" aria-label="Para quién es OfiMatch">
          <div className="wrap split">
            <div className="panel panel-cliente">
              <h2>Si necesitas un técnico</h2>
              <ul>
                <li>Encuentras a alguien cerca en minutos, también para emergencias.</li>
                <li>Ves reseñas de trabajos reales antes de abrir la puerta de tu casa.</li>
                <li>Sabes por qué te recomendamos a cada persona.</li>
              </ul>
              <Link href="/app" className="btn btn-dark">
                Pedir un servicio
              </Link>
            </div>
            <div className="panel panel-trabajador">
              <h2>Si vives de tu oficio</h2>
              <ul>
                <li>Recibes clientes nuevos de tu zona sin depender solo de recomendaciones.</li>
                <li>Construyes una reputación que puedes mostrar y que también califica al cliente.</li>
                <li>Ves en qué distritos y horarios se pide más tu oficio.</li>
                <li>Pagas solo cuando concretas un trabajo.</li>
              </ul>
              <Link href="/trabajadores" className="btn btn-primary">
                Ofrecer mis servicios
              </Link>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="dosvias-title">
          <div className="wrap dosvias">
            <div>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <h2 id="dosvias-title">Una reputación que va en los dos sentidos</h2>
                <p>
                  El trabajador también califica al cliente: si pagó a tiempo, si explicó bien el trabajo y cómo lo trató. Ninguna nota se
                  muestra hasta que los dos califican.
                </p>
              </div>
            </div>
            <div className="sobres" aria-label="Ejemplo de calificación simultánea">
              <div className="sobre">
                <span className="avatar">AC</span>
                <div>
                  <b>Ana califica a Julio</b>
                  <span className="sobre-velo">Puntualidad, calidad y trato</span>
                </div>
                <span className="estrellas" aria-label="5 estrellas">
                  ★★★★★
                </span>
              </div>
              <div className="sobre">
                <span className="avatar">JQ</span>
                <div>
                  <b>Julio califica a Ana</b>
                  <span className="sobre-velo">Pago a tiempo, claridad y trato</span>
                </div>
                <span className="estrellas" aria-label="5 estrellas">
                  ★★★★★
                </span>
              </div>
              <p className="dosvias-nota">Las dos notas aparecen al mismo tiempo, cuando ambos terminaron de calificar.</p>
            </div>
          </div>
        </section>

        <section className="section" id="oficios" aria-labelledby="oficios-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="oficios-title">Oficios en OfiMatch</h2>
              <p>Empezamos por los cuatro oficios que más se piden en los hogares y negocios de Lima.</p>
            </div>
            <div className="oficios-grid">
              {OFICIOS.map((o) => (
                <Link key={o.id} href={`/oficios/${o.slug}`} className="oficio-card" style={{ ["--c" as string]: o.color }}>
                  <h3>{o.plural} en Lima</h3>
                  <ul>
                    {o.trabajos.slice(0, 3).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="preguntas" aria-labelledby="faq-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="faq-title">Preguntas frecuentes</h2>
            </div>
            <div className="faq">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-label="Empieza ahora">
          <div className="wrap">
            <div className="cta-final">
              <h2>Instala OfiMatch en tu celular</h2>
              <Link href="/app" className="btn btn-dark">
                Abrir la app
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

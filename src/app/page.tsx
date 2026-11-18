import Link from "next/link";
import { JsonLd, SiteFooter } from "@/components/Site";
import Carousel from "@/components/site/Carousel";
import DemandCard from "@/components/site/DemandCard";
import Hero from "@/components/site/Hero";
import HowItWorks from "@/components/site/HowItWorks";
import { Icon } from "@/components/site/Icons";
import Illus from "@/components/site/Illus";
import PopularServices from "@/components/site/PopularServices";
import SiteHeader from "@/components/site/SiteHeader";
import TradeTiles from "@/components/site/TradeTiles";
import Voices from "@/components/site/Voices";
import WorkersSection from "@/components/site/WorkersSection";
import { COMMISSION, OFICIOS, SITE_URL } from "@/lib/data";

const FAQ = [
  {
    q: "¿Cómo elige OfiMatch al técnico?",
    a: "Ordena a los técnicos del oficio que pediste según qué tan cerca están de tu distrito, su reputación (calificaciones de clientes reales, ajustadas por la cantidad de trabajos) y si están disponibles. Si es una emergencia pesa más la cercanía; si puede esperar, pesa más la reputación.",
  },
  {
    q: "¿Cuánto cuesta usar OfiMatch?",
    a: `Pedir un servicio es gratis. Cada técnico muestra su precio desde y el monto final lo acuerdan antes de empezar. OfiMatch cobra ${Math.round(COMMISSION * 100)}% al técnico solo cuando el trabajo se completa.`,
  },
  {
    q: "¿Qué es la calificación en dos vías?",
    a: "Al terminar, el cliente califica al técnico y el técnico califica al cliente. Ninguno ve la nota del otro hasta que ambos califican, así nadie califica por represalia.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "OfiMatch", url: SITE_URL, logo: `${SITE_URL}/icons/icon-512.png`, areaServed: "Lima Metropolitana, Perú" },
            { "@type": "WebSite", "@id": `${SITE_URL}/#web`, name: "OfiMatch", url: SITE_URL, inLanguage: "es-PE", publisher: { "@id": `${SITE_URL}/#org` } },
            { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          ],
        }}
      />
      <SiteHeader catbar />
      <main>
        <Hero />

        <div className="wrap">
          <TradeTiles />
        </div>

        <section className="section" aria-labelledby="pop-title">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h2" id="pop-title">
                Servicios populares
              </h2>
            </div>
            <PopularServices />
          </div>
        </section>

        <section className="section" aria-labelledby="usp-title">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h2 h2-sm" id="usp-title">
                Resuelve tu casa con técnicos de confianza
              </h2>
              <Link className="btn btn-dark" href="/app">
                Únete ahora
              </Link>
            </div>
            <ul className="usp-list">
              <li>
                <span className="usp-ico">
                  <Icon name="users" />
                </span>
                Técnicos de 9 oficios en Lima Metropolitana y Callao
              </li>
              <li>
                <span className="usp-ico">
                  <Icon name="match" />
                </span>
                Match automático por oficio, cercanía y urgencia
              </li>
              <li>
                <span className="usp-ico">
                  <Icon name="camera" />
                </span>
                Perfiles con fotos de trabajos y reseñas en dos vías
              </li>
              <li>
                <span className="usp-ico">
                  <Icon name="wallet" />
                </span>
                Precio desde a la vista y monto acordado antes de empezar
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="tecnicos" aria-labelledby="tec-title">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <h2 className="h2 h2-sm" id="tec-title">
                  Técnicos cerca de ti
                </h2>
                <p className="sec-sub">Filtra por oficio, busca lo que necesitas y elige el distrito donde es el trabajo.</p>
              </div>
              <a className="link-more" href="#como-funciona">
                Cómo elegimos tu match <Icon name="arrow" />
              </a>
            </div>
            <WorkersSection />
          </div>
        </section>

        <div className="wrap band-wrap" id="empresas">
          <section className="band band-pro" aria-labelledby="pro-title">
            <div>
              <div className="band-brand">
                ofimatch<i />
                <span>empresas</span>
                <span className="soon">Próximamente</span>
              </div>
              <h2 id="pro-title">Arma tu equipo de mantenimiento sin buscar uno por uno</h2>
              <ul>
                <li>
                  <Icon name="check" />
                  Técnicos para edificios, locales y obras desde un solo lugar
                </li>
                <li>
                  <Icon name="check" />
                  Solicitudes recurrentes y urgencias en un mismo panel
                </li>
                <li>
                  <Icon name="check" />
                  Historial de cada trabajo con fotos y calificaciones
                </li>
              </ul>
              <Link className="btn btn-light" href="/app">
                Pedir con una cuenta de cliente
              </Link>
              <p className="note">
                <Icon name="shield" />
                Hoy ya puedes pedir técnicos para tu negocio con una cuenta de cliente.
              </p>
            </div>
            <div className="band-visual" aria-hidden="true">
              <div className="team-card">
                <header>
                  <div>
                    <strong>Mantenimiento mensual</strong>
                    <span>Edificio en San Isidro, 24 departamentos</span>
                  </div>
                  <span className="status go">Esta semana</span>
                </header>
                <div className="team-row">
                  <span className="avatar lg" style={{ ["--av" as string]: "#1D4ED8" }}>
                    MP
                  </span>
                  <div>
                    <strong>Miguel Paredes</strong>
                    <span>Electricista, pozo a tierra</span>
                  </div>
                  <span className="status ok">Completado</span>
                </div>
                <div className="team-row">
                  <span className="avatar lg" style={{ ["--av" as string]: "#0891B2" }}>
                    RQ
                  </span>
                  <div>
                    <strong>Rosa Quispe</strong>
                    <span>Gasfitera, bombas y tanques</span>
                  </div>
                  <span className="status go">En camino</span>
                </div>
                <div className="team-row">
                  <span className="avatar lg" style={{ ["--av" as string]: "#334155" }}>
                    LC
                  </span>
                  <div>
                    <strong>Luis Ccori</strong>
                    <span>Soldador, puerta de garaje</span>
                  </div>
                  <span className="status wait">Jueves 9:00</span>
                </div>
              </div>
              <span className="float-pill">
                <Icon name="doc" />
                Reporte mensual listo
              </span>
            </div>
          </section>
        </div>

        <div className="wrap band-wrap" id="demanda">
          <section className="band band-data" aria-labelledby="data-title">
            <div>
              <div className="band-brand">
                ofimatch<i />
                <span>para técnicos</span>
              </div>
              <h2 id="data-title">Mira dónde se necesita tu oficio, antes de salir de casa</h2>
              <p className="lead">
                El mapa de demanda junta las solicitudes de la plataforma para mostrarte qué distritos y horarios piden más tu trabajo. Con un
                toque te pones disponible en esa zona.
              </p>
              <Link className="btn btn-light" href="/trabajadores">
                Ofrece tus servicios
              </Link>
              <p className="note">
                <Icon name="wallet" />
                Registro gratis. Pagas {Math.round(COMMISSION * 100)}% solo cuando terminas un trabajo.
              </p>
            </div>
            <div className="band-visual">
              <DemandCard />
            </div>
          </section>
        </div>

        <section className="section" id="como-funciona" aria-labelledby="how-title">
          <div className="wrap">
            <HowItWorks />
          </div>
        </section>

        <section className="section" aria-labelledby="voice-title">
          <div className="wrap">
            <h2 className="h2 h2-sm" id="voice-title">
              Lo que nos dicen los técnicos
            </h2>
            <p className="sec-sub">Frases del mapa de empatía de nuestra investigación con técnicos independientes de Lima Metropolitana.</p>
            <Voices />
            <div className="stats">
              <div className="stat">
                <b>+24 000</b>
                <span>puestos proyectados en oficios especializados para 2026</span>
                <small>Fuente: MTPE, 2026</small>
              </div>
              <div className="stat">
                <b>40 %</b>
                <span>de esa demanda requiere formación técnica especializada</span>
                <small>Fuente: MTPE, 2026</small>
              </div>
              <div className="stat">
                <b>11 % → 24 %</b>
                <span>formalización con intermediación digital en el caso Zolvers</span>
                <small>Fuente: Poblete et al., 2024</small>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="guias" aria-labelledby="guides-title">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h2" id="guides-title">
                Guías de precios y oficios
              </h2>
            </div>
            <Carousel label="Guías">
              {OFICIOS.map((o) => (
                <li key={o.id}>
                  <Link className="guide" href={`/oficios/${o.slug}`}>
                    <Illus icon={o.icon} tint={o.tint} pattern={o.id === "electricista" ? "grid" : ""} />
                    <h3>{o.pregunta}</h3>
                    <p>Trabajos comunes, cómo elegimos al técnico y precios desde de {o.plural.toLowerCase()} en Lima.</p>
                  </Link>
                </li>
              ))}
            </Carousel>
          </div>
        </section>

        <div className="wrap">
          <section className="cta-band" aria-labelledby="cta-title">
            <h2 id="cta-title">Servicios técnicos al alcance de tu mano</h2>
            <div className="row">
              <Link className="btn btn-light btn-lg" href="/app">
                Pedir un servicio
              </Link>
              <Link className="btn btn-on-dark btn-lg" href="/trabajadores">
                Soy técnico
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

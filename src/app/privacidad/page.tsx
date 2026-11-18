import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/Site";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Privacidad y términos",
  description: "Cómo OfiMatch usa tus datos y las condiciones de uso de la plataforma.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero" aria-labelledby="p-title">
          <div className="hero-bg" aria-hidden="true" />
          <div className="wrap">
            <nav aria-label="Ruta">
              <ol className="crumbs">
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>Privacidad</li>
              </ol>
            </nav>
            <h1 id="p-title">Privacidad y términos</h1>
          </div>
        </section>
        <section className="section">
          <div className="wrap prose">
            <h2>Proyecto académico</h2>
            <p>
              OfiMatch es un proyecto del curso Gestión de Proyectos de la UPC (Grupo 3, 2026). Funciona como producto mínimo viable: no
              procesa pagos, no verifica la identidad de los técnicos y no garantiza la calidad de los trabajos que acuerden los usuarios.
            </p>
            <h2>Qué datos guardamos</h2>
            <p>
              Tu nombre, correo, distrito y teléfono. Si eres técnico, también tu oficio, experiencia, descripción, precio desde y las fotos de
              trabajos que subas. Además, las solicitudes que haces o recibes y las calificaciones de cada trabajo.
            </p>
            <h2>Quién ve qué</h2>
            <p>
              Tu nombre, distrito, calificación, precio desde y fotos son visibles en la plataforma. Tu teléfono solo lo ve la otra parte de un
              trabajo aceptado. Las calificaciones se muestran cuando ambas partes califican.
            </p>
            <h2>Tus derechos</h2>
            <p>
              Conforme a la Ley N.° 29733 de Protección de Datos Personales del Perú, puedes pedir acceder, corregir o eliminar tus datos
              escribiendo al equipo del proyecto. Puedes borrar tus fotos en cualquier momento desde tu perfil.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

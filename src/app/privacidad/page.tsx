import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/Site";

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
        <section className="page-hero">
          <div className="wrap">
            <h1>Privacidad y términos</h1>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap prose">
            <h2>Proyecto académico</h2>
            <p>
              OfiMatch es un proyecto desarrollado para el curso Gestión de Proyectos de la UPC (Grupo 3, 2026). Funciona como producto
              mínimo viable: no procesa pagos y no garantiza la calidad de los trabajos acordados entre usuarios.
            </p>
            <h2>Qué datos guardamos</h2>
            <p>
              Tu nombre, correo, distrito, teléfono y, si eres trabajador, tu oficio, experiencia y descripción. También las solicitudes que
              haces o recibes y las calificaciones de cada trabajo.
            </p>
            <h2>Quién ve qué</h2>
            <p>
              Tu nombre, distrito y calificación son visibles en la plataforma. Tu teléfono solo lo ve la otra parte de un trabajo aceptado.
              Las calificaciones se muestran cuando ambas partes califican.
            </p>
            <h2>Tus derechos</h2>
            <p>
              Conforme a la Ley N.° 29733 de Protección de Datos Personales del Perú, puedes pedir acceder, corregir o eliminar tus datos
              escribiendo al equipo del proyecto.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

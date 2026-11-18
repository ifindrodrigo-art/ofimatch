# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Trabajador independiente de oficio (25 a 55 años) en Lima Metropolitana y Callao: electricistas, gasfiteros, albañiles, soldadores, pintores, carpinteros, cerrajeros, técnicos en climatización e instaladores de drywall. Consigue clientes por recomendación, WhatsApp o Facebook, no tiene cómo demostrar su experiencia y tiene días sin trabajo.
- Cliente: hogares, PYMES y organizaciones que necesitan un servicio de oficio urgente o recurrente y no saben en quién confiar.
- Usuarios secundarios (no construidos todavía): SENCICO (certificación), MTPE (datos de demanda), empresas de construcción o mantenimiento.

## Product Purpose

OfiMatch empareja a trabajadores de oficios con clientes cercanos. El cliente describe el problema, elige urgencia y distrito, y recibe trabajadores ordenados por un puntaje real; el trabajador acepta, ambos coordinan por WhatsApp, cierran el trabajo y se califican. Éxito: el cliente encuentra a alguien confiable en minutos y el trabajador consigue clientes cerca y una reputación que puede mostrar.

Proyecto académico del curso Gestión de Proyectos (UPC), Grupo 3, 2026, publicado como MVP funcional.

## Positioning

Tres mecanismos juntos que ningún directorio (OLX, Marketplace, grupos de WhatsApp) ni LinkedIn ofrece para oficios en Perú:
1. Match por cercanía, urgencia y reputación, con el puntaje y su desglose visibles.
2. Calificación en dos vías con revelado simultáneo: el trabajador también califica al cliente y ninguna nota se ve hasta que ambos califican.
3. Datos de demanda por distrito y franja horaria para que el trabajador decida dónde trabajar.

## Operating Context

- Se usa sobre todo en celular (app instalable PWA) y desde la web pública que Google indexa.
- Coordinación fuera de la app por WhatsApp; el teléfono solo se revela cuando el trabajador acepta.
- Modelo freemium: pedir es gratis; comisión de 10% al trabajador solo cuando se completa un trabajo (rango 8 a 12% del Lean Canvas).

## Capabilities and Constraints

- Construido: registro de cliente o trabajador (el rol se elige una vez), solicitud con match real, aceptar/rechazar/en camino/completar, reasignación si rechazan, desglose de comisión, calificación en dos vías con revelado simultáneo, mapa de demanda accionable, perfiles demo que aceptan solos para mostrar el ciclo completo.
- En construcción (pedido por el equipo el 17/11/2026): 9 oficios, precio referencial "desde S/ X" que define el trabajador, portafolio de fotos de trabajos.
- No construido: verificación de identidad o antecedentes, pagos dentro de la app, panel para empresas, datos del MTPE integrados, chat interno, SMS.
- Stack: Next.js 15 + TypeScript, Supabase (Postgres, Auth, RLS, Storage), Vercel. Sin variables de Supabase corre en modo demostración local.

## Brand Commitments

- Nombre: OfiMatch. Wordmark en minúsculas "ofimatch" con punto cian (de la interfaz aprobada por el equipo).
- Voz: español peruano, directo y cercano ("¿Qué servicio necesitas hoy?"), sin jerga técnica.
- Interfaz de referencia aprobada por el usuario: archivo OfiMatch.html (estilo marketplace: página blanca, bandas oscuras redondeadas, tarjetas de técnicos).

## Evidence on Hand

- Investigación de Design Thinking del equipo (Plantilla_Design_Thinking_OfiMatch_v_final): frases del mapa de empatía ("Debería haber algo como LinkedIn, pero para los oficios", "No tengo cómo demostrar mi experiencia formalmente", "A veces tengo días sin ningún trabajo", "Me gustaría encontrar trabajos que estén cerca").
- Datos citados: MTPE proyecta más de 24 000 puestos en oficios especializados para 2026 y más del 40% requiere formación técnica; la intermediación digital llevó la formalización de 11% a 24% en el caso Zolvers (Poblete et al., 2024).
- No existen: testimonios de clientes reales, cifras de usuarios, clientes empresariales, verificación de técnicos. No inventarlos. Los perfiles de ejemplo son ficticios y se marcan como demostración.

## Product Principles

1. Prometer solo lo que la app hace hoy; lo futuro se marca como próximo.
2. Mostrar el mecanismo (puntaje, revelado, demanda) en lugar de afirmarlo.
3. El trabajador es un usuario de primera clase, no un recurso del cliente.
4. Cada pantalla de la app resuelve una tarea en el celular con pocos toques.

## Accessibility & Inclusion

Usuarios con alfabetización digital básica y celulares de gama media: textos claros, botones grandes, contraste alto y funcionamiento con conexión inestable.

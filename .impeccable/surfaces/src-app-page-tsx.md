---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/oficios/[slug]/page.tsx","src/app/trabajadores/page.tsx"]
---

# Surface: página pública de OfiMatch (portada + páginas por oficio)

Mode: Persuade. Audience: clientes que buscan un técnico y trabajadores de oficio que buscan clientes en Lima. Action: abrir la app para pedir un servicio o crear perfil de trabajador. Proof: puntaje de match real, revelado simultáneo, demanda real desde Supabase, citas y datos de la investigación de Design Thinking. Constraints: solo afirmaciones verdaderas (sin "verificados"), 9 oficios, precio "desde" real por trabajador, sin links muertos.

## Direction contract

THESIS: Un marketplace de oficios que se siente tan confiable como Fiverr pero hecho para Lima: la búsqueda y el técnico real están en el primer viewport. Rechaza la landing de afiche con promesas y la grilla de features con íconos.

OWN-WORLD: Página blanca con riel de 1400px, tinta azul noche #0F172A, marca azul #2563EB, acento cian #22D3EE, bandas oscuras redondeadas (noche #07122B, cobalto #0B2A6F, petróleo #063F4A) con retícula fina, tarjetas navy de servicios, tarjetas de técnico estilo gig con panel ilustrado punteado o foto real, Figtree de 300 en titulares grandes y 600 a 800 en UI, wordmark "ofimatch" con punto cian.

STORY: El visitante entiende que pide un técnico por oficio y distrito, cree porque ve técnicos reales con precio, puntaje y reseñas, y entra a la app; el trabajador ve demanda real y se registra.

FIRST VIEWPORT: Hero noche a todo ancho. Izquierda: titular Figtree 300 de dos líneas, buscador blanco de 60px con botón azul, cinco pastillas de servicios. Derecha: mapa ilustrado de distritos de Lima con rutas y pines pulsantes, tarjeta de match flotante de un técnico real y aviso de solicitud cercana. Abajo: distritos con técnicos y botón de pausa de animación.

FORM: pinned by the approved comp. seed: none (pinned) "ahora con esa misma interfaz" (OfiMatch.html aprobado por el usuario).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: buscar o tocar un oficio filtra en vivo la grilla de técnicos reales y la desplaza a la vista; motion: pulso de pines y flotación suave de las tarjetas del hero, pausable.

## Unresolved
- OfiMatch Empresas es una visión: se presenta como próxima, con la cuenta de cliente como camino actual.

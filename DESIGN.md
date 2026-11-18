---
name: OfiMatch
description: Marketplace de técnicos de oficio en Lima; página blanca con bandas oscuras redondeadas y tarjetas de técnico estilo gig.
colors:
  ink: "#0F172A"
  ink-2: "#334155"
  muted: "#64748B"
  line: "#CBD5E1"
  line-soft: "#E2E8F0"
  bg: "#FFFFFF"
  surface: "#F8FAFC"
  brand: "#2563EB"
  brand-hover: "#1D4ED8"
  brand-soft: "#DBEAFE"
  cyan: "#06B6D4"
  cyan-bright: "#22D3EE"
  amber: "#F59E0B"
  heart: "#E11D48"
  danger: "#B91C1C"
  night: "#07122B"
  navy: "#0B1F4B"
  cobalt: "#0B2A6F"
  teal: "#063F4A"
  ink-band: "#0E1A3A"
  tint-1: "#DBEAFE"
  tint-2: "#CFFAFE"
  tint-3: "#E0E7FF"
  tint-4: "#FEF3C7"
  tint-5: "#E0F2FE"
  tint-6: "#F1F5F9"
typography:
  display:
    fontFamily: "Figtree Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "72px"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Figtree Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Figtree Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Figtree Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree Variable, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  gutter: "32px"
  gutter-mobile: "16px"
  section: "56px"
  rail: "1400px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    height: "42px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    height: "42px"
  button-outline:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "42px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "46px"
    padding: "0 14px"
  chip-filter:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "38px"
  chip-filter-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  service-card:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.bg}"
    rounded: "{rounded.lg}"
    width: "200px"
  band-dark:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.bg}"
    rounded: "{rounded.lg}"
    padding: "56px 64px"
---

# OfiMatch

## Overview

Un marketplace de oficios con la claridad de una tienda conocida, hecho para Lima. La página es blanca y ordenada sobre un riel de 1400px; el color vive en superficies completas: el hero noche con el mapa ilustrado, las bandas cobalto y petróleo, la banda azul de voces y las tarjetas navy de servicios. El técnico real (nombre, foto o ilustración del oficio, precio desde, nota y distancia) es la unidad de diseño en la web y en la app.

## Colors

- **Tinta** `ink` para texto y botones oscuros; `ink-2` para títulos de sección grandes en peso 400; `muted` para datos secundarios (contraste 4.7:1 sobre blanco).
- **Marca** `brand` es la única acción primaria: buscar, pedir, solicitar. `brand-soft` para insignias.
- **Cian** `cyan` / `cyan-bright` marca lo vivo y lo positivo: disponible ahora, pines del mapa, barras de demanda, puntos del wordmark.
- **Superficies oscuras**: `night` (hero y cabeceras de páginas internas), `cobalt` (Empresas), `teal` (demanda), `navy` (tarjetas de servicios), `ink-band` (CTA final). Siempre con retícula fina al 4%.
- **Tintes** `tint-1` a `tint-6` solo como fondo de los paneles ilustrados de oficio.

## Typography

Figtree variable, alojada en el propio sitio. Titulares grandes en 300 con tracking negativo (-0.04em); títulos de sección en 400; UI en 600 a 800. Wordmark "ofimatch" en 800 con punto cian. Sin mayúsculas sostenidas ni etiquetas sobre los títulos.

## Layout

- Riel 1400px con gutter 32px (16px en móvil). Secciones de 56px (40px en móvil).
- Grilla de técnicos 4 / 3 / 2 / 1 columnas en 1240 / 900 / 520px.
- Oficios en 9 columnas que pasan a carrusel horizontal bajo 1100px; los filtros de oficio también se desplazan en móvil.
- App: columna de 600px máx., barra superior blanca de 64px y pestañas inferiores fijas; una tarea por pantalla.

## Elevation & Depth

Sombras suaves con desplazamiento: tarjetas de oficio `0 2px 8px rgba(15,23,42,.06)`; tarjetas flotantes del hero `0 24px 48px rgba(2,8,23,.38)`; menús `0 18px 40px rgba(15,23,42,.14)`. El resto se separa con líneas `line-soft`.

## Shapes

Radios 8 (botones, inputs), 12 (paneles ilustrados, tarjetas de app), 16 (bandas, tarjetas de servicios y de match) y píldora (filtros, insignias, estados). Avatares circulares con iniciales sobre un azul derivado del nombre.

## Components

- **Tarjeta de técnico (gig)**: panel 16:10 con foto real del portafolio o ilustración del oficio sobre trama punteada, etiqueta del trabajo destacado abajo a la izquierda, "Disponible ahora" y favorito arriba; debajo avatar + nombre + insignia calculada, descripción en 2 líneas, nota, distrito y distancia, y fila de precio desde.
- **Tarjeta de match (app)**: la misma tarjeta con puntaje de 0 a 100, barra apilada cercanía / reputación / disponibilidad, botones "Ver trabajos" y "Solicitar a <nombre>". La mejor queda con borde azul.
- **Bandas**: título en 300, lista con checks cian, botón claro y nota con ícono.
- **Estados**: píldoras `wait`, `go`, `done`, `off`, `ok`.
- **Íconos**: sprite de línea propio, trazo 1.6.

## Do's and Don'ts

- Do: mostrar datos reales (precio desde, fotos, notas, demanda) en lugar de afirmaciones.
- Do: marcar lo que aún no existe como "Próximamente" y los perfiles de ejemplo como demostración.
- Don't: decir "verificados" o "antecedentes revisados"; OfiMatch no verifica identidad.
- Don't: etiquetas en mayúsculas sobre los títulos, texto con degradado, emojis como íconos, links que no llevan a ninguna parte.

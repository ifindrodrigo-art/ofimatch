# OfiMatch

Plataforma web + app instalable (PWA) que conecta a técnicos de 9 oficios (electricistas, gasfiteros, albañiles, soldadores, pintores, carpinteros, cerrajeros, climatización y drywall) con clientes en Lima Metropolitana.

Diseño: sistema documentado en `DESIGN.md` y `PRODUCT.md` (generados con la skill Impeccable, instalada en `.claude/skills/impeccable`).
Proyecto del curso **Gestión de Proyectos (UPC), Grupo 3, 2026**.

## Qué hace

| Función | Dónde |
|---|---|
| Registro de trabajador o cliente (el rol se elige una vez) | `/app` |
| Solicitud + **match real** por cercanía, reputación y disponibilidad (los pesos cambian según la urgencia) | `src/lib/match.ts` |
| Aceptar / rechazar / en camino / completar, con desglose de comisión (10%) | `/app` → Solicitudes |
| **Calificación en dos vías con revelado simultáneo** (la base de datos oculta cada nota hasta que ambos califican) | `supabase/schema.sql` |
| **Mapa de demanda** por distrito y franja horaria; el trabajador puede mover su zona con un toque | `/app` → Demanda |
| Teléfono privado: solo se ve tras aceptar el trabajo (botón directo a WhatsApp) | `counterpart_contact()` |
| Sitio público optimizado para Google: portada, 4 páginas por oficio, sitemap, robots, datos estructurados | `src/app` |

## Tecnología

- **Next.js 15** (App Router, páginas estáticas para SEO) + TypeScript
- **Supabase** (Postgres + Auth + Row Level Security)
- **PWA**: manifest + service worker (`public/sw.js`)
- Mapa: Leaflet + OpenStreetMap/CARTO
- Hosting: **Vercel** (gratis)

Sin variables de Supabase la app corre en **modo demostración** (todo en el navegador), útil para presentar sin internet estable.

## Puesta en marcha

### 1. Supabase
1. Crea un proyecto en supabase.com (región São Paulo).
2. **SQL Editor → New query** → pega todo `supabase/schema.sql` → **Run**. Luego, en otra consulta, pega `supabase/migration_002.sql` → **Run** (9 oficios, precio desde y portafolio de fotos).
3. **Authentication → Sign In / Providers → Email**: desactiva *Confirm email* si quieres que las cuentas funcionen al instante (recomendado para la demo).
4. **Authentication → URL Configuration**: Site URL = tu dominio de Vercel; agrega `https://TU-DOMINIO/app` en Redirect URLs.
5. **Project Settings → API Keys**: copia la *Project URL* y la *Publishable key*.

### 2. Vercel
1. vercel.com → *Sign up with GitHub* → **Add New → Project** → importa este repositorio.
2. En *Environment Variables* agrega las de `.env.example`.
3. **Deploy**. Cada `git push` vuelve a publicar solo.

### 3. Google (para que salga al buscar "OfiMatch")
1. search.google.com/search-console → **Agregar propiedad → Prefijo de URL** → tu dominio.
2. Verificación **Etiqueta HTML**: copia solo el valor `content="..."` en la variable `NEXT_PUBLIC_GOOGLE_VERIFICATION` de Vercel y vuelve a desplegar → **Verificar**.
3. **Sitemaps** → envía `sitemap.xml`.
4. **Inspección de URL** → pega la portada → **Solicitar indexación**. Google suele tardar de 2 a 7 días.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:3000
```

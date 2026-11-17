import type { NextConfig } from "next";

// En Vercel, VERCEL_PROJECT_PRODUCTION_URL trae el dominio real de producción
// (p. ej. ofimatch-gilt.vercel.app, o el dominio propio si se agrega uno).
const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PROD_URL: prod ? `https://${prod}` : "",
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cuando las fotos vivan en un bucket (p. ej. Cloudflare R2), agrega aquí su dominio
  // para poder usar next/image:
  // images: { remotePatterns: [{ protocol: "https", hostname: "fotos.tudominio.com" }] },
};

export default nextConfig;

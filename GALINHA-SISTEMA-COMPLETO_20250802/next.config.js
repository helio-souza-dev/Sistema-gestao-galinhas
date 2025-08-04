/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuração para Docker
  output: "standalone",
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig

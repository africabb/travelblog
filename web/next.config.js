/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // R2 / S3 public URL — ajusta al dominio de tu bucket
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.s3.amazonaws.com' },
      // dominio custom de media
      { protocol: 'https', hostname: process.env.MEDIA_HOSTNAME ?? 'media.example.com' },
      // WordPress CDN (Grecia blog)
      { protocol: 'https', hostname: 'deaventurassevive.wordpress.com' },
      // M&A media CDN (hero photo, podcast)
      { protocol: 'https', hostname: 'media.hustlegotreal.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // media local servida bajo el mismo dominio público
      { protocol: 'https', hostname: 'japon.amurasoftware.com' },
      // para desarrollo local
      { protocol: 'http',  hostname: 'localhost' },
      // media local servida por la API en el servidor
      { protocol: 'http',  hostname: '204.168.146.128' },
    ],
  },
};

module.exports = nextConfig;

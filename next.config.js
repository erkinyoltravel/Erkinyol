/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.erkinyol.com' }],
        destination: 'https://erkinyol.com/:path*',
        permanent: true,
      },
    ];
  },

  // Включаем строгую проверку
  eslint: {
    ignoreDuringBuilds: false, // true = игнорировать ошибки на билде, false = падать при ошибках
  },
  typescript: {
    ignoreBuildErrors: false, // true = игнорировать ошибки TS, false = падать при ошибках
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
  },
  // Expose environment variables to serverless functions at runtime
  env: {
    JOURNAL_API_GATEWAY_URL: process.env.JOURNAL_API_GATEWAY_URL,
    TASKS_API_GATEWAY_LISTS_URL: process.env.TASKS_API_GATEWAY_LISTS_URL,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

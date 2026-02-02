/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mray-dev-resources.s3.us-east-2.amazonaws.com',
        pathname: '/ittero/**',
      },
    ],
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

const isProd = process.env.NODE_ENV === 'production';

/** @type {import("next").NextConfig} */
const nextConfig = {
  async headers() {
    return !isProd
      ? [
          {
            // allow CORS only on dev for admin site to get monaco files
            source: '/min/vs/(.*)',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET' },
            ],
          },
        ]
      : [];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@repo/db', '@repo/ui', '@repo/auth', '@repo/monaco'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
    ],
  },
};

export default nextConfig;

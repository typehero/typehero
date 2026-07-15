import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
// eslint-disable-next-line import/no-unresolved
import vercelToolbar from '@vercel/toolbar/plugins/next';

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
  turbopack: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
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
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const withVercelToolbar = vercelToolbar();

export default withSentryConfig(withBundleAnalyzer(withVercelToolbar(nextConfig)), {
  silent: true,
  org: 'typehero',
  project: 'typehero-web-production',
  widenClientFileUpload: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});

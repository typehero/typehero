// NOTE: this whole package is bugged and once they fix this we can remove this workaround
// eslint-disable-next-line import/no-unresolved
import vercelToolbar from '@vercel/toolbar/plugins/next';
import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
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
  swcMinify: true,
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withVercelToolbar = vercelToolbar();

export default withBundleAnalyzer(withVercelToolbar(nextConfig));

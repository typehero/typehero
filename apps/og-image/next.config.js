/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@repo/og-utils'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
};
export default config;

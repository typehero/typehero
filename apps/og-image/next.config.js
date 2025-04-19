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
};
export default config;

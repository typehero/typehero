import million from 'million/compiler';

const millionConfig = {
  auto: true,
};

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
};
export default million.next(nextConfig, millionConfig);

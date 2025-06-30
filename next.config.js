/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "400mb",
    },
  },
};

module.exports = nextConfig;

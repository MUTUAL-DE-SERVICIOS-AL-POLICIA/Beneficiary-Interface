/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  allowedDevOrigins: ['192.168.2.240'],
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    }
  }
};

export default nextConfig;

/** @type {import('next').NextConfig} */

const apiEndpoint = new URL(process.env.NEXT_PUBLIC_API_ENDPOINT);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: apiEndpoint.protocol.replace(":", ""),
        hostname: apiEndpoint.hostname,
        port: apiEndpoint.port,
      },
    ],
  },
};

module.exports = nextConfig;

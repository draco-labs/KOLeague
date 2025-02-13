import envsConfig from "./envs.js";

const envs = envsConfig[process.env.MODE];
if (envs) {
  console.log(`MODE: ${process.env.MODE}`);
  Object.keys(envs).forEach((key) => {
    process.env[key] = envs[key];
  });
  console.log(`Website: ${process.env.NEXT_PUBLIC_WEB_URL}`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'", 
          },
        ],
      },
    ];
  },
  images: {
    domains: ['pbs.twimg.com', 'coin-images.coingecko.com'],
  },
};

export default nextConfig;

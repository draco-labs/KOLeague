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
  // reactStrictMode: true,
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/leaderboard1',
  //       permanent: true,
  //     },
  //   ]
  // },
  async headers() {
    return [
      {
        // Áp dụng cho tất cả các route
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Hoặc 'SAMEORIGIN' nếu bạn muốn cho phép từ cùng domain
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'", // Chỉ cho phép nhúng từ cùng domain
          },
        ],
      },
    ];
  },
  images: {
    domains: ['pbs.twimg.com', 'coin-images.coingecko.com', 'minio.dev.ftech.ai'],
  },
};

export default nextConfig;

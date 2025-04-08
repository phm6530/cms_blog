import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "www.h-creations.com",
      "pixabay.com",
      "localhost", // dev
      "images.unsplash.com",
      "hnfcmdvepwcpcxxwavim.supabase.co",
      "d33h8icwcso2tj.cloudfront.net",
      "localhost:3000",
    ], // 내 포트폴리오
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // experimental: {
  //   ppr: false,
  // },
};

export default nextConfig;

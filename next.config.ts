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
    ], // 내 포트폴리오
  },
};

export default nextConfig;

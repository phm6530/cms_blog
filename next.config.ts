import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: true, // build시 console.log 삭제 .
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // 업로드 5MB 로
    },
  },
  images: {
    domains: [
      "www.h-creations.com",
      "pixabay.com",
      "images.unsplash.com",
      "hnfcmdvepwcpcxxwavim.supabase.co",
      "d33h8icwcso2tj.cloudfront.net",
      "localhost:3000",
      "oeebbhgexwkfzpmetlrs.supabase.co",
    ],
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: !(process.env.STATUS === "DEV"),
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 업로드 5MB 로
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

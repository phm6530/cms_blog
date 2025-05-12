import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: !(process.env.STATUS === "DEV"),
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://www.h-creations.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
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

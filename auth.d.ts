import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      nickname: string;
      role: string;
    };
  }

  interface User {
    id: string;
    nickname: string;
    role: "super" | "admin";
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nickname: string;
    role: string;
    picture?: string;
  }
}

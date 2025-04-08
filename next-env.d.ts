/// <reference types="next" />
/// <reference types="next/image-types/global" />
import { DefaultSession } from "next-auth";
// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

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

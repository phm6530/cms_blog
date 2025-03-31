import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/db";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      // 비동기
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email as string));

          if (!user) {
            throw new Error("정보가 일치하지 않습니다.");
          }

          if (!(await compare(password as string, user.password))) {
            throw new Error("비밀번호가 일치하지 않습니다.");
          }

          return {
            id: user.id as unknown as string,
            email: user.email as string,
          };
        } catch (err) {
          if (err instanceof Error) {
            throw new Error(err.message || "잘못된 요청입니다..");
          }
          throw new Error("알수 없는 에러..");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
    updateAge: 15 * 60, //15분
  },
});

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        role: {},
      },
      // 비동기
      async authorize(
        credentials: Partial<Record<"email" | "role", unknown>>
      ): Promise<{ email: string; role: string } | null> {
        const email = credentials.email;
        const role = credentials.role;

        if (typeof email !== "string" || typeof role !== "string") {
          return null;
        }

        return { email, role };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
    updateAge: 15 * 60, //15분
  },
});

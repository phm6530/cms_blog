import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
        token.nickname = user.nickname;
        token.role = user.role!;
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.nickname = token.nickname as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as string;
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
        profile_img: {},
        nickname: {},
      },
      // 비동기
      async authorize(
        credentials: Partial<
          Record<"email" | "role" | "profile_img" | "nickname", unknown>
        >
      ): Promise<{
        email: string;
        role: string;
        image: string | null;
        nickname: string;
      } | null> {
        const email = credentials.email;
        const role = credentials.role;
        const nickname = credentials.nickname as string;
        const profile_img = credentials.profile_img as string;

        if (typeof email !== "string" || typeof role !== "string") {
          return null;
        }

        return { email, role, image: profile_img, nickname };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
    updateAge: 15 * 60, //15분
  },
});

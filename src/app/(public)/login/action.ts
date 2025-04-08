"use server";

import { signIn } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";

type loginProps = {
  email: string;
  password: string;
};

export default async function LoginAction(data: loginProps) {
  const { email, password } = data;
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email as string));

    if (!user || !(await compare(password as string, user.password))) {
      return {
        error: true,
        errorMessage: "존재하지 않는 이메일이거나 정보가 일치하지 않습니다.",
      };
    }

    await signIn("credentials", {
      email,
      role: user.role,
      profile_img: user.profile_img,
      nickname: user.nickname,
      redirect: false,
    });

    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      return {
        error: true,
        errorMessage: err.message || "잘못된 요청입니다.",
      };
    }
    return {
      error: true,
      errorMessage: "잘못된 요청입니다.",
    };
  }
}

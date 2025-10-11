import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password }: { email: string; password: string } =
    await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "이메일과 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    console.log(user);

    if (!user || !user.password || !(await compare(password, user.password))) {
      return NextResponse.json(
        {
          success: false,
          message: "존재하지 않는 이메일이거나 정보가 일치하지 않습니다.",
        },
        { status: 401 }
      );
    }
    console.log("user:::", user);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          role: user.role,
          image: user.profile_img,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: `서버오류가 발생하였습니다\n msg : ${(err as Error).message}`,
      },
      { status: 500 }
    );
  }
}

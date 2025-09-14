import { NextResponse } from "next/server";

export async function GET() {
  // 실제로는 아무 작업도 할 필요가 없습니다.
  // 이 함수가 호출되는 것 자체가 목적입니다.
  try {
    return NextResponse.json({ success: true, message: "Server is warm." });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { success: false, message: "An error occurred." },
        { status: 500 }
      );
  }
}

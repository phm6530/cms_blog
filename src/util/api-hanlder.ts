import { NextResponse } from "next/server";
// postgreSQL restrict ErrorMsg 캐치
function isPostgresError(err: any): err is { code: string } {
  return err && typeof err.code === "string";
}

export async function apiHandler<T>(
  cb: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await cb();
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err) {
    console.log("error!");
    const message =
      err instanceof Error ? err.message : "서버 오류가 발생했습니다.";
    if (isPostgresError(err) && err.code === "23503") {
      return NextResponse.json(
        {
          success: false,
          message: "하위 그룹이 존재하여 삭제할 수 없습니다.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

import { revalidateTag, unstable_cache } from "next/cache";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type ActionOptions = {
  tags?: string[];
  cache?: {
    keys: string[];
    options?: {
      tags?: string[];
    };
  };
};

// Postgres 에러 타입 가드
function isPostgresError(err: any): err is { code: string } {
  return !!err?.code;
}

export async function actionWrapper<T>(
  cb: (...arg: any) => Promise<T>,
  options?: ActionOptions
): Promise<ActionResult<T>> {
  try {
    const cachedFn = options?.cache
      ? unstable_cache(cb, options.cache.keys, options.cache.options)
      : cb;

    const data = await cachedFn();

    if (options?.tags?.length) {
      await Promise.all(options.tags.map((tag) => revalidateTag(tag)));
    }

    return { success: true, data };
  } catch (err) {
    if (isPostgresError(err)) {
      switch (err.code) {
        case "23503": // 제약조건
          return {
            success: false,
            error: "하위 그룹이 존재하여 삭제할 수 없습니다.",
          };
        case "23505": // 존재
          return {
            success: false,
            error: "이미 존재하는 항목입니다.",
          };
      }
    }

    // 2️⃣ 기본 처리
    const message = err instanceof Error ? err.message : "서버 오류 발생";
    return { success: false, error: message };
  }
}

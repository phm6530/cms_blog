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

export async function actionWrapper<T>(
  cb: () => Promise<T>,
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
    const message = err instanceof Error ? err.message : "서버 오류 발생";
    return { success: false, error: message };
  }
}

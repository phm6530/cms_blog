import { z } from "zod";

export const wirtePostSchema = z.object({
  title: z.string().min(1, { message: "필수항목 입니다" }),
  contents: z.string().min(1, { message: "필수항목 입니다" }),
  postGroup: z
    .object({
      category: z.number().nullable(),
      group: z.number().nullable(),
    })
    .refine(
      (val) =>
        val.category !== null &&
        val.category > 0 &&
        val.group !== null &&
        val.group > 0,
      {
        message: "포스팅 그룹을 선택해주세요.",
        path: [], // 에러 메시지를 postGroup 전체에 표시
      }
    ),
  thumbnail: z.string().nullable(),
  defaultThumbNail: z.boolean(),
  imgKey: z.string().min(1, { message: "필수항목 입니다" }),
});

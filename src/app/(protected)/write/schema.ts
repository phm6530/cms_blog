import { z } from "zod";

export const wirtePostSchema = z.object({
  title: z.string().min(1, { message: "필수항목 입니다" }),
  contents: z.string().min(1, { message: "필수항목 입니다" }),
  postGroup: z.string().min(1, { message: "포스팅 그룹을 선택해주세요." }),
  thumbnail: z.string().nullable(),
  defaultThumbNail: z.boolean(),
});

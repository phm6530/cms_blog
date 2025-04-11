import { z } from "zod";

// 로그인 되었는지, 부모가있는지에 따라 스키마 다르게 처리
export const dynamicSchema = (existParent: boolean, session: boolean) => {
  let schema = z.object({
    comment: z
      .string()
      .min(5)
      .max(1000, { message: "1000자 이하로 기재해주세요" }),
  });

  if (existParent) {
    schema = schema.extend({
      parent_id: z.number().min(1, { message: "요청이 잘못되었습니다" }),
    });
  }

  if (!session) {
    schema = schema.extend({
      guest: z.string().min(2, { message: "2글자 이상으로 설정해주세요" }),
      password: z.string().min(2, { message: "4글자 이상으로 설정해주세요" }),
    });
  }

  return schema;
};

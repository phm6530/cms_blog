import { z } from "zod";

export const dynamicSchema = (existParent: boolean) => {
  let schema = z.object({
    guest: z.string().min(2, { message: "2글자 이상으로 설정해주세요" }),
    password: z.string().min(2, { message: "4글자 이상으로 설정해주세요" }),
    user_icon: z.string().min(1, { message: "필수 항목입니다." }),
    contents: z
      .string()
      .min(5)
      .max(1000, { message: "1000자 이하로 기재해주세요" }),
  });

  if (existParent) {
    schema = schema.extend({
      parent_id: z.number().min(1, { message: "요청이 잘못되었습니다" }),
    });
  }

  return schema;
};

import { z } from "zod";
import { loginSchema } from "../login/schema";

export const registerSchema = loginSchema
  .extend({
    passwordConfirm: z.string().min(4, { message: "필수항목입니다.!ㄴ" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

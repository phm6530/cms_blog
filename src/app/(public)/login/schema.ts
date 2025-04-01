import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(2, {
    message: "필수항목입니다.",
  }),
  password: z.string().min(4, {
    message: "필수항목입니다.",
  }),
});

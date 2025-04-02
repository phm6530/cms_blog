"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import InputField from "@/components/shared/inputField";
import PasswordInputField from "@/components/shared/inputPasswordField";
import { registerSchema } from "./schema";

export default function Page() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {};

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <InputField
            name="email"
            label="USER"
            placeholder="관리자 ID를 입력해주세요"
          />
          <PasswordInputField label="비밀번호" />
          <PasswordInputField
            name="passwordConfirm"
            label="비밀번호 확인"
            placeholder="비밀번호 확인해주세요"
          />
          <Button type="submit" className="w-full">
            관리자 생성
          </Button>
        </form>
      </Form>
    </>
  );
}

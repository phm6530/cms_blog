"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginSchema } from "./schema";
import InputField from "@/components/shared/inputField";
import PasswordInputField from "@/components/shared/inputPasswordField";
import Link from "next/link";
import LoginAction from "./action";
import { toast } from "sonner";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useThrottling from "@/hook/useThrottling";

export default function Page() {
  const router = useRouter();
  const { update } = useSession();
  const { throttle } = useThrottling();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const res = await throttle(() => LoginAction(data), 1500);
    if (!res) return;
    if (res.error) {
      toast.error(res.errorMessage);
      form.setValue("password", "");
      form.trigger("password");
      return;
    }

    if (res.success) {
      toast.success("로그인 되었습니다.");
      await update();
      router.push("/");
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <InputField
            name="email"
            label="USER"
            placeholder="관리자 ID를 입력해주세요"
          />
          <PasswordInputField />

          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </Form>
      <div className="auth-nav flex justify-center gap-2 p-4 items-center">
        <Link href={"/register"} className="text-xs">
          관리자 생성
        </Link>
        <span className="opacity-40">|</span>
        <Link href={"/register"} className="text-xs">
          비밀번호 찾기
        </Link>
      </div>
    </>
  );
}

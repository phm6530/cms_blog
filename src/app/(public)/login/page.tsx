"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginSchema } from "./schema";
import InputField from "@/components/shared/inputField";
import PasswordInputField from "@/components/shared/inputPasswordField";

import { toast } from "sonner";

import { useSession } from "next-auth/react";
import LoadingSpinnerWrapper from "@/components/ui/loading-disabled-wrapper";
import { z } from "zod";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";

type LoginInput = z.infer<typeof loginSchema>;
export default function Page() {
  const { status, update } = useSession();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    console.log("??1323");
    const result = await loginAction(data);
    console.log("??1323");
    console.log(result);
    if (result?.error) {
      toast.error(result.error);
    } else {
      await update();
      router.refresh();
      console.log("실행안됨????");
    }
  };

  return (
    <section className="max-w-[500px] mx-auto py-10">
      <LoadingSpinnerWrapper
        loading={status === "loading" || status === "authenticated"}
      >
        <h1 className="text-2xl mb-5 text-center">LOGIN</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <InputField name="email" placeholder="관리자 ID를 입력해주세요" />
            <PasswordInputField />

            <Button type="submit" className="w-full py-5 cursor-pointer">
              로그인
            </Button>
          </form>
        </Form>
        <div className="auth-nav flex justify-center gap-2 p-4 items-center">
          <Button
            asChild
            variant={"link"}
            className="text-zinc-600 hover:text-zinc-400"
          ></Button>
        </div>
      </LoadingSpinnerWrapper>
    </section>
  );
}

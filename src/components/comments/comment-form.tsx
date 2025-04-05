"use client";

import useThrottling from "@/hook/useThrottling";
import { useMutation } from "@tanstack/react-query";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaFormField from "../ui/textarea-field";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../shared/inputField";
import PasswordInputField from "../shared/inputPasswordField";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import { toast } from "sonner";
import LoadingSpinnerWrapper from "../ui/loading-disabled-wrapper";
import { useCallback } from "react";
import { dynamicSchema } from "./zod/comment.zod";
import { useParams } from "next/navigation";
import useStore from "@/context/store";

type CommentFormValues = z.infer<ReturnType<typeof dynamicSchema>>;

export default function CommentForm({
  postId,
  userData,
  parent_id,
}: {
  postId?: string;
  userData?: { email: string };
  parent_id?: null | number;
}) {
  const { throttle } = useThrottling();
  const params = useParams();
  const { commentsViewOff } = useStore();

  const defaultValues = useCallback((parent_id?: number | null) => {
    return {
      guest: "",
      contents: "",
      password: "",
      ...(parent_id && { parent_id }),
    };
  }, []);

  const form = useForm<CommentFormValues>({
    defaultValues: defaultValues(parent_id),
    resolver: zodResolver(dynamicSchema(!!parent_id)),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: CommentFormValues) => {
      const reponse = await withFetchRevaildationAction({
        endPoint: `api/comment/${params.id}`, // post 기준
        options: {
          method: HTTP_METHOD.POST,
          body: JSON.stringify({
            ...(!!parent_id
              ? {
                  ...data,
                  parent_id,
                }
              : data),
          }),
        },
        tags: [REVALIDATE.COMMENT, postId!],
      });

      if (!reponse.success) {
        throw new Error(reponse.message);
      }
    },
    onSuccess: () => {
      toast.success("등록 되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      form.reset(defaultValues(parent_id));
      if (!!parent_id) commentsViewOff();
    },
  });

  const submitHandler = (data: CommentFormValues) => {
    throttle(async () => mutate(data), 1500);
  };

  return (
    <LoadingSpinnerWrapper loading={isPending}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="grid gap-2"
        >
          {/* id */}
          <InputField name="guest" placeholder="닉네임" />

          {/* password */}
          <PasswordInputField />

          {/* contents */}
          <div className="col-span-5">
            <TextareaFormField
              name={"contents"}
              placeholder="남기실 메세지를 입력해주세요"
              maxLength={1000}
            />
          </div>
          <Button className="mt-3 md:mt-0 col-span-6  md:col-span-1 h-full order-2 md:order-none py-5">
            댓글 작성
          </Button>
          <div className="pt-2 text-sm flex gap-3 col-span-6 order-1 md:order-none">
            <span className="text-[11px] opacity-45">
              {form.watch("contents").length} / 1000 자
            </span>

            {/* <span className="text-destructive"> {errors[0]?.message}</span>*/}
          </div>
        </form>
      </Form>
    </LoadingSpinnerWrapper>
  );
}

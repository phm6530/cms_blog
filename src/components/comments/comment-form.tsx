"use client";

import useThrottling from "@/hook/useThrottling";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaFormField from "../ui/textarea-field";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../shared/inputField";
import PasswordInputField from "../shared/inputPasswordField";
import { toast } from "sonner";
import LoadingSpinnerWrapper from "../ui/loading-disabled-wrapper";
import { useCallback } from "react";
import { dynamicSchema } from "./zod/comment.zod";
import { useParams, useRouter } from "next/navigation";
import useStore from "@/context/store";
import { useSession } from "next-auth/react";
import ProfileAdmin from "../ui/profile-user";
import withClientFetch from "@/util/withClientFetch";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import { Skeleton } from "../ui/skeleton";

type CommentFormValues = z.infer<ReturnType<typeof dynamicSchema>>;

export default function CommentForm({
  targetSchema = "comment",
  parent_id,
  postId,
}: {
  targetSchema?: "comment" | "guestbook";
  postId: string;
  userData?: { email: string };
  parent_id?: null | number;
}) {
  const { throttle } = useThrottling();
  const params = useParams();
  const { commentsViewOff } = useStore();
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const defaultValues = useCallback((parent_id?: number | null) => {
    return {
      guest: "",
      comment: "",
      password: "",
      ...(parent_id && { parent_id }),
    };
  }, []);

  const form = useForm<CommentFormValues>({
    defaultValues: defaultValues(parent_id),
    resolver: zodResolver(dynamicSchema(!!parent_id, !!session.data?.user)),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: CommentFormValues) => {
      return await withClientFetch({
        endPoint:
          targetSchema === "comment"
            ? `api/comment/${params.id}`
            : `api/guestboard`,
        options: {
          method: HTTP_METHOD.POST,
        },
        body: !!parent_id ? { ...data, parent_id } : data,
      });
    },
    onSuccess: () => {
      toast.success("등록 되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      queryClient.invalidateQueries({
        queryKey: [`${REVALIDATE.COMMENT}:${postId}`],
      });
      form.reset(defaultValues(parent_id));
      router.refresh();
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
          className="flex flex-col gap-2"
        >
          {session.status === "loading" ? (
            <div className="flex gap-2 items-center">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-6 w-32" />{" "}
              <Skeleton className="h-6 w-32" />
            </div>
          ) : (
            <>
              {" "}
              {!session.data?.user ? (
                <div className="flex gap-2">
                  {/* id */}
                  <InputField name="guest" placeholder="닉네임" />
                  {/* password */}
                  <PasswordInputField />
                </div>
              ) : (
                <div className="flex items-center gap-3 animate-wiggle">
                  <ProfileAdmin
                    profileImg={session.data.user.image}
                    nickname={session.data.user.nickname}
                    role={session.data.user.role}
                  />
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-2 h-full w-full items-end">
            <TextareaFormField
              name={"comment"}
              placeholder="남기실 메세지를 입력해주세요"
              maxLength={1000}
              className="flex-1 min-h-[100px] w-full"
            />
            <div className="flex justify-between w-full">
              <div className="pt-2 text-sm flex gap-3 col-span-6 order-1 md:order-none">
                <span className="text-[11px] opacity-45">
                  {form.watch("comment").length} / 1000 자
                </span>

                {/* <span className="text-destructive"> {errors[0]?.message}</span>*/}
              </div>
              <Button className="py-3 px-5 h-auto!">댓글 작성</Button>
            </div>
          </div>
        </form>
      </Form>
    </LoadingSpinnerWrapper>
  );
}

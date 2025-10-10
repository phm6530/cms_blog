"use client";

import useThrottling from "@/hook/useThrottling";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import LoadingSpinnerWrapper from "../ui/loading-disabled-wrapper";
import { useCallback } from "react";
import { dynamicSchema } from "./zod/comment.zod";
import { useParams, useRouter } from "next/navigation";
import useStore from "@/context/store";
import { useSession } from "next-auth/react";
import withClientFetch from "@/util/withClientFetch";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LucideEthernetPort, UserRound } from "lucide-react";

type CommentFormValues = z.infer<ReturnType<typeof dynamicSchema>>;

export default function CommentForm({
  targetSchema = "comment",
  parent_id,
  postId,
}: {
  targetSchema?: "comment" | "guestbook";
  postId?: string;
  userData?: { email: string };
  parent_id?: null | number;
}) {
  const { throttle } = useThrottling();
  const { commentsViewOff } = useStore();
  const params = useParams();
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const schema = dynamicSchema(!!parent_id, !!session.data?.user);
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
    resolver: zodResolver(schema),
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
    onSuccess: async () => {
      toast.success("등록 되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });

      if (targetSchema === "comment") {
        await queryClient.invalidateQueries({
          queryKey: [`${REVALIDATE.COMMENT}:${postId}`],
        });
      }

      if (targetSchema === "guestbook") {
        await queryClient.invalidateQueries({
          queryKey: [REVALIDATE.GUEST_BOARD.GETBOARD],
        });
      }

      form.reset(defaultValues(parent_id));
      router.refresh();
      if (!!parent_id) commentsViewOff();
    },
  });

  const submitHandler = (data: CommentFormValues) => {
    throttle(async () => mutate(data), 1500);
  };

  const sortOrder = ["guest", "password", "comment", "parent_id"];
  const errors = form.formState.errors;

  const sortedMessages = Object.entries(errors)
    .sort(([keyA], [keyB]) => sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB))
    .map(([_, value]) => {
      void _;
      return value?.message;
    });

  return (
    <LoadingSpinnerWrapper loading={isPending}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className={cn(
            "flex gap-5 items-start border-b pb-5",
            session.data?.user ? "" : "flex-col"
          )}
        >
          {session.status === "loading" ? (
            <div className="flex gap-2 items-center">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-6 w-32" />{" "}
              <Skeleton className="h-6 w-32" />
            </div>
          ) : (
            <>
              {!session.data?.user ? (
                <div className="flex gap-2">
                  {/* id */}
                  <div
                    className={cn(
                      "focus-within:border-muted-foreground border px-2 py-1 rounded-lg w-full grid grid-cols-[1fr_auto] items-center gap-3",
                      form.formState.errors.guest && "border-red-300"
                    )}
                  >
                    <input
                      placeholder="닉네임"
                      type="text"
                      autoComplete="off"
                      className="resize-none focus:outline-0 placeholder:text-xs text-sm p-2"
                      {...form.register("guest")}
                    ></input>
                  </div>

                  <div
                    className={cn(
                      "focus-within:border-muted-foreground border px-2 py-1 rounded-lg w-full grid grid-cols-[1fr_auto] items-center gap-3",
                      form.formState.errors.password && "border-red-300"
                    )}
                  >
                    <input
                      placeholder="비밀번호"
                      type="password"
                      className="resize-none focus:outline-0 placeholder:text-xs text-sm p-2"
                      {...form.register("password")}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 animate-wiggle">
                  <div
                    className={cn(
                      "size-10  rounded-full bg-gray-500/10 flex justify-center items-center relative overflow-hidden"
                    )}
                  >
                    {!session.data.user.image ? (
                      <UserRound className="text-secondary-foreground/80" />
                    ) : (
                      <Image
                        src={session.data.user.image}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>

                  {/* <ProfileAdmin
                    profileImg={session.data.user.image}
                    nickname={session.data.user.nickname}
                    role={session.data.user.role}
                  /> */}
                </div>
              )}
            </>
          )}
          <div className="w-full">
            <div
              className={cn(
                "focus-within:border-muted-foreground border px-2 py-1 rounded-lg w-full grid grid-cols-[1fr_auto] items-center gap-3",
                form.formState.errors.comment && "border-red-300"
              )}
            >
              <textarea
                maxLength={1000}
                placeholder="하실 말씀을 적어주세요!"
                {...form.register("comment")}
                className="resize-none focus:outline-0 placeholder:text-xs text-sm p-2"
              ></textarea>

              <Button className="text-xs aspect-auto size-12">
                <LucideEthernetPort />
              </Button>
            </div>
            <div className="flex justify-between w-full mt-2">
              {sortedMessages.length > 0 && (
                <div className="col-span-full text-xs text-red-400">
                  {sortedMessages[0]}
                </div>
              )}
              <div className="ml-auto text-sm flex gap-3 col-span-6 md:order-none placeholder:text-xs!">
                <span className="text-[11px] opacity-45">
                  {form.watch("comment").length} / 1000 자
                </span>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </LoadingSpinnerWrapper>
  );
}
